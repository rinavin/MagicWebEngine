import {ApplicationException, Exception, NString} from "@magic/mscorelib";
import {ClientManager} from "../ClientManager";
import {MsgInterface, StrUtil} from "@magic/utils";

export class ServerError extends ApplicationException {
  static INF_NO_RESULT: number = -11;
  static ERR_CTX_NOT_FOUND: number = -197;
  static ERR_AUTHENTICATION: number = -157;
  static ERR_ACCESS_DENIED: number = -133;
  static ERR_LIMITED_LICENSE_CS: number = -136;
  static ERR_UNSYNCHRONIZED_METADATA: number = -271;
  static ERR_CANNOT_EXECUTE_OFFLINE_RC_IN_ONLINE_MODE: number = -272;
  static ERR_INCOMPATIBLE_RIACLIENT: number = -275;

  private _code: number = 0;

  constructor(msg: string);
  constructor(msg: string, code: number);
  constructor(msg: string, innerException: Exception);
  constructor(msg: string, codeOrInnerException?: any) {
    super(msg);
    if (arguments.length === 1 && (msg === null || msg.constructor === String)) {
      this.constructor_0(msg);
      return;
    }
    if (arguments.length === 2 && (msg === null || msg.constructor === String) && (codeOrInnerException === null || codeOrInnerException.constructor === Number)) {
      this.constructor_1(msg, codeOrInnerException);
      return;
    }
    this.constructor_2(msg, codeOrInnerException);
  }

  private constructor_0(msg: string): void {
  }

  private constructor_1(msg: string, code: number): void {
    this._code = code;
  }

  private constructor_2(msg: string, innerException: Exception): void {
  }

  GetCode(): number {
    return this._code;
  }

  ///<summary>
  ///  Return error message for ServerError exception.
  ///  This method will return detailed error message when :-
  ///      1) when detailed message is to be shown (i.e. DisplayGenericError = N in execution.properties)
  ///      2) when ServerError.Code is 0.
  ///  Otherwise generic error message will be returned.
  ///</summary>
  ///<returns>!!.</returns>
  GetMessage(): string {
    let message: string;

    let shouldDisplayGenericError: boolean = ClientManager.Instance.ShouldDisplayGenericError();
    if (shouldDisplayGenericError && this.GetCode() > 0) {
      let genericErrorMessage: string = ClientManager.Instance.getMessageString(MsgInterface.STR_GENERIC_ERROR_MESSAGE);
      genericErrorMessage = StrUtil.replaceStringTokens(genericErrorMessage, "%d", 1, "{0}");
      message = NString.Format(genericErrorMessage, this.GetCode());
    }
    else
      message = this.Message;
    return message;
  }
}
