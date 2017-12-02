
import {Headers, Http, Request, RequestMethod, RequestOptions, Response} from "@angular/http";


import {Dictionary, NString, RefParam, StringBuilder, Thread, WebException} from "@magic/mscorelib";


import {Logger, Logger_LogLevels, Logger_MessageDirection, Misc} from "@magic/utils";
import {ICommunicationsFailureHandler} from "./ICommunicationsFailureHandler";
import {isNullOrUndefined} from "util";
import {HttpClientEvents} from "./HttpClientEvents";

import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/timeout";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/toPromise";

// execution properties
const HTTP_EXPECT100CONTINUE: string        = "Expect100Continue"; // Add HTTP header "Expect:100Continue"
const USE_HIGHEST_SECURITY_PROTOCOL: string = "UseHighestSecurityProtocol"; // This property decides to use TLS v1.2 (implemented at .NET v4.5) or TLS v1.0

/// <summary>
/// this class is responsible for:
///    (i) deciding which method to use (GET/POST).
///   (ii) handling communication failures.
///  (iii) adding HTTP headers to requests.
///  (iV) retrieving HTTP headers from responses.
/// </summary>

export class HttpClient
{
	private _HTTPMaxURLLength: number            = 2048;
	private _outgoingHeaders: Dictionary<string> = new Dictionary();
	private httpService: Http;
	
	/// <summary>
	/// Gets or sets a handler for communications failure. This property may be
	/// set to null, in which case the HttpClient will automatically fail after
	/// the first reconnection attempt.
	/// </summary>
	CommunicationsFailureHandler: ICommunicationsFailureHandler = null;
	
  constructor(httpService: Http) {
		this.httpService = httpService;
		this.CommunicationsFailureHandler = null;
	}
	
	/// <summary>
	/// Returns the request method (POST or GET) based on its contents and length.
	/// </summary>
	/// <param name="requestURL"></param>
	/// <returns></returns>
	private DecideOnRequestMethod(requestContent: string, requestURL: RefParam<string>): RequestMethod {
		let method: RequestMethod = RequestMethod.Get;
		
		if (requestContent === null)
		{
			// requestContent (== content to be sent to server) is allowed only in POST requests. In case no content is required, opt for GET (for the aforementioned performance reason).
			method = RequestMethod.Get;
		}
		else
		{
			if (requestURL.value.length + 1 + requestContent.length <= this._HTTPMaxURLLength)
			{
				// append the request content to the URL, and switch to using a GET request.
				requestURL.value = requestURL.value + "?" + requestContent;
				method           = RequestMethod.Get;
			}
			else
			{
				method = RequestMethod.Post;
			}
		}
		
		return method;
	}
	
	/// <summary>Gets contents of a URL, using either GET or POST methods.
	/// The method executes the HTTP request, reads the response and return the content.
	/// </summary>
	/// <param name="requestURL">URL to be accessed.</param>
	/// <param name="requestContent">content to be sent to server (relevant only for POST method - is null for other methods).</param>
	/// <returns>response (from the server).</returns>
	async GetContent(requestURL: string, requestContent: any): Promise<string> {
		let contentFromServer: RefParam<string> = new RefParam(null);
		let requestUrlRef: RefParam<string>     = new RefParam(requestURL);
		
		let httpMethod: RequestMethod = this.DecideOnRequestMethod(requestContent, requestUrlRef);
		
		try
		{
			// Execute the http request
			let response: Response = await this.ExecuteHttpRequest(requestURL, requestContent, httpMethod, contentFromServer);
			
			let headers: Headers = response.headers;
			
			if (headers.keys.length > 0)
			{
				Logger.Instance.WriteServerToLog("Incoming Headers : " + HttpClient.HeadersToString(headers, true));
				
				// set the next session counter (which will be expected by the server in the next request).
				let nextSessionCounterString: string = response.headers.get("MgxpaNextSessionCounter");
				if (!isNullOrUndefined(nextSessionCounterString))
				{
					HttpClientEvents.CheckAndSetSessionCounter(+nextSessionCounterString);
				}
			}
		}
		catch (ex)
		{
			Logger.Instance.WriteWarningToLog(ex);
			throw ex;
		}
		
		return contentFromServer.value;
	}
	
	/// <summary>This function executes the HTTP request and make the response object. It can execute
	///   GET or POST request. In case of POST request the variables to server will contain the
	///   variables to be send to the server.
	/// </summary>
	/// <param name="urlString">URL to be accessed.</param>
	/// <param name="requestContent">content to be sent to server (relevant only for POST method - is null for other methods).</param>
	/// <param name="httpMethod">enum RequestMethod to specify the method that will be used to execute the request.</param>
	/// <param name="contentFromServer">content received from the response. [OUT]</param>
	/// <returns></returns>
	private async ExecuteHttpRequest(urlString: string, requestContent: string, httpMethod: RequestMethod, contentFromServer: RefParam<string>): Promise<Response> {
		let httpRequest: Request   = null;
		let httpResponse: Response = null;
		
		let httpCommunicationTimeoutMS: number = HttpClientEvents.GetHttpCommunicationTimeout();
		let clientID: string                   = HttpClientEvents.GetGlobalUniqueSessionID();
		
		let executionAttempts: number = 0;  // for logging purpose only.
		
		let startTime: number = Misc.getSystemMilliseconds();
		
		// Retrying:
		//    Is controlled by:
		//       (I)  The method variable 'httpCommunicationTimeoutMS' (above),
		//       (II) The class member 'CommunicationsFailureHandler' (above).
		while (true)
		{
			executionAttempts++;
			
			try
			{
				let useHighestSecurityProtocol: boolean = HttpClient.GetUseHighestSecurityProtocol();
				if (useHighestSecurityProtocol)
				{
					// TODO: implement TLS protocol.
					// ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
				}
				
				let requestOptions: RequestOptions = new RequestOptions();
				requestOptions.url                 = urlString;
				requestOptions.method              = httpMethod;
				requestOptions.body                = requestContent;
				requestOptions.headers             = new Headers();
				this.AddHeaders(clientID, httpRequest.headers);
				
				httpRequest = new Request(new RequestOptions());
				
				Logger.Instance.WriteServerToLog(NString.Format("Request Timeout set to {0} ms", httpCommunicationTimeoutMS));
				
				if (Logger.Instance.LogLevel === Logger_LogLevels.Basic)
				{
					let contentLength: number = 0;
					if (httpRequest.method === RequestMethod.Get)
					{
						let parts: string[] = urlString.split('?');
						
						if (parts.length === 2)
							contentLength = parts[1].length;
					}
					else // (httpRequest.method === RequestMethod.Post)
						contentLength = requestContent.length;
					
					Logger.Instance.WriteBasicToLog(Logger_MessageDirection.MessageLeaving,
						HttpClientEvents.GetRuntimeCtxID(),
						HttpClientEvents.GetSessionCounter(),
						clientID,
						HttpClientEvents.ShouldDisplayGenericError() ? "-" : new URL(httpRequest.url).host,
						0,
						'-',
						JSON.stringify(httpRequest.headers.toJSON()),
						contentLength);
				}
				
				let timeBeforeRequest: number = Misc.getSystemMilliseconds();
				Logger.Instance.WriteServerToLog(NString.Format("Accessing (method: '{0}'): '{1}'", httpRequest.method, urlString));
				
				if (httpRequest.headers.keys().length > 0)
					Logger.Instance.WriteServerToLog("Outgoing Headers : " + HttpClient.HeadersToString(httpRequest.headers, false));
				
				if (httpMethod === RequestMethod.Post)
				{
					// TODO: Handle Expect100Continue.
					// httpWebRequest.ServicePoint.Expect100Continue = this.GetHTTPExpect100Continue();
					// this.WriteContentToRequest(requestContent, httpWebRequest);
				}
				
				// =============================================================================================================
				// send the request:
				// ===================
				await this.httpService.request(httpRequest)
				          .timeout(httpCommunicationTimeoutMS)
				          .catch((err: Response) => {
					          return Observable.throw(err);
				          })
          .toPromise().then(resp => {httpResponse = resp});
				
				// ===================
				// get the response:
				// ===================
				contentFromServer.value = httpResponse.text();
				
				let responseTime: number = Misc.getSystemMilliseconds() - timeBeforeRequest;
				if (Logger.Instance.LogLevel === Logger_LogLevels.Basic)
					Logger.Instance.WriteBasicToLog(Logger_MessageDirection.MessageEntering,
						HttpClientEvents.GetRuntimeCtxID(),
						HttpClientEvents.GetSessionCounter(),
						clientID,
						HttpClientEvents.ShouldDisplayGenericError() ? "-" : new URL(httpRequest.url).host,
						responseTime,
						httpResponse.status.toString(),
						JSON.stringify(httpResponse.headers.toJSON()),
						contentFromServer.value.length);
				
				break;
			}
			catch (ex)
			{
				if (Logger.Instance.LogLevel === Logger_LogLevels.Basic)
					Logger.Instance.WriteBasicErrorToLog(HttpClientEvents.GetRuntimeCtxID(),
						HttpClientEvents.GetSessionCounter(),
						clientID,
						HttpClientEvents.ShouldDisplayGenericError() ? "-" : new URL(httpRequest.url).host,
						ex);
				else
					Logger.Instance.WriteWarningToLog(ex);
				
				// status 404 (Not Found) or 403 (Forbidden) aren't retried, since they can't be recovered.
				
				let statusCode: number = ex.Response != null ? (<Response>ex.Response).status : 0;
				if (statusCode === 404 || statusCode === 403)
				{
					Logger.Instance.WriteServerToLog(NString.Format("ex.Response.StatusCode: {0}", (<Response>ex.Response).status));
					throw new WebException(ex, statusCode);
				}
				
				// delay the total http timeout / 10.
				let currentDelayMS            = httpCommunicationTimeoutMS / 10; // ms
				let httpElapsedTimeMS: number = Misc.getSystemMilliseconds() - startTime + currentDelayMS;
				if (httpElapsedTimeMS <= httpCommunicationTimeoutMS)
				{
					Thread.Sleep(currentDelayMS);
					Logger.Instance.WriteWarningToLog(NString.Format("Retrying {0} : elapsed time {1:N0}ms out of {2:N0}ms",
						urlString, httpElapsedTimeMS, httpCommunicationTimeoutMS));
					continue;
				}
				
				Logger.Instance.WriteWarningToLog(NString.Format("{0} : http timeout {1:N0}ms expired", urlString, httpCommunicationTimeoutMS));
				if (this.CommunicationsFailureHandler != null)
				{
					this.CommunicationsFailureHandler.CommunicationFailed(urlString, ex);
					if (this.CommunicationsFailureHandler.ShouldRetryLastRequest)
					{
						Logger.Instance.WriteServerToLog(NString.Format("Retrying {0}, confirmed by user ...", urlString));
						startTime = Misc.getSystemMilliseconds();
						continue;
					}
				}
				
				Logger.Instance.WriteWarningToLog("Re-throwing ...");
				Logger.Instance.WriteWarningToLog(ex);
				throw new WebException(ex);
			}
		}
		
		if (executionAttempts > 1)
		{
			Logger.Instance.WriteServerToLog(NString.Format("Succeeded after {0} attempts ...", executionAttempts));
		}
		
		return httpResponse;
	}
	
	///<summary>
	///  Adds headers into 'requestHeaders', based on the passed parameters and class members ('_outgoingHeaders').
	///</summary>
	///<param name="clientID">!!.</param>
	///<param name="requestHeaders">Headers collection populated by the method. [REF]</param>
	private AddHeaders(clientID: string, requestHeaders: Headers): void {
		if (clientID !== null)
			requestHeaders.append("MgxpaRIAglobalUniqueSessionID", clientID);
		
		let keys: string[] = this._outgoingHeaders.Keys;
		keys.forEach((key: string) => {
			requestHeaders.append(key, this._outgoingHeaders.get_Item(key));
		});
	}
	
	/// <summary>Write Mg* prefixed headers to string in format "HEADER1:VALUE1 HEADER2:VALUE2 ..."</summary>
	/// <param name="headers"></param>
	/// <param name="bFilter">if true, list only headers prefixed with "Mg"</param>
	private static HeadersToString(headers: Headers, bFilter: boolean): StringBuilder {
		let keys: string[]            = headers.keys();
		let headersStr: StringBuilder = new StringBuilder();
		
		for (let i: number = 0; i < keys.length; i++)
		{
			// filter only headers that are prefixed with Mg* (sent from the Middleware and Server):
			if (!bFilter || keys[i].startsWith("Mg"))
				headersStr.Append(NString.Format("{0}:{1} ", keys[i], headers.get(keys[i])));
		}
		
		return headersStr;
	}
	
	/// <summary>
	/// Adds one header to the request.
	/// </summary>
	/// <param name="name"></param>
	/// <param name="value"></param>
	AddRequestHeader(name: string, value: string): void {
		this._outgoingHeaders.Add(name.trim(), value.trim());
	}
	
	/// <summary>Return the property which decide whether to set HTTP header "Expect:100Continue"</summary>
	/// <returns>bool</returns>
	private static GetHTTPExpect100Continue(): boolean {
		let result: boolean           = true;
		let executionProperty: string = HttpClientEvents.GetExecutionProperty(HTTP_EXPECT100CONTINUE);
		
		// In case the property is not given in the execution properties, it should default to true
		if (!NString.IsNullOrEmpty(executionProperty))
			result = (executionProperty === "Y");
		
		return result;
	}
	
	/// <summary>Return the property which allows to use TLS v1.2 (implemented at .NET v4.5) as a highest TLS protocol version.
	/// Otherwise use TLS v1.0 as a highest TLS protocol version</summary>
	/// <returns>bool</returns>
	private static GetUseHighestSecurityProtocol(): boolean {
		let result: boolean           = false;
		let executionProperty: string = HttpClientEvents.GetExecutionProperty(USE_HIGHEST_SECURITY_PROTOCOL);
		
		// In case the property is not given in the execution properties, it should default to false (a highest TLS protocol version is v1.0)
		if (!NString.IsNullOrEmpty(executionProperty))
			result = (executionProperty === "Y");
		
		return result;
	}
}
