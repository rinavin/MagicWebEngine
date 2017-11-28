import {Encoding, List, NString} from "@magic/mscorelib";
import {Base64, Logger, StrUtil, XMLConstants, XmlParser} from "@magic/utils";
import {ClientManager} from "../ClientManager";
import {Scrambler} from "../util/Scrambler";
import {ConstInterface} from "../ConstInterface";

// This class is used to manage the user details on the client side.
// The user details are sent from the server.
export class UserDetails {
  private static _instance: UserDetails = null;
  UserName: string = null;  // user name obtained from the server.
  UserID: string = null; // userID obtained from the server
  UserInfo: string = null; // user info obtained from the server
  Password: string = null; // Password obtained from server.

  static get Instance(): UserDetails {
    if (UserDetails._instance === null)
      UserDetails._instance = new UserDetails();
    return UserDetails._instance;
  }

  /// <summary>Private CTOR as part of making this class a singleton/// </summary>
  constructor() {
    this.UserName = NString.Empty;
    this.UserID = NString.Empty;
    this.UserInfo = NString.Empty;
  }

  /// <summary>
  /// This function gets the xml tag containing user info.
  /// </summary>
  public fillData(): void {
    let parser: XmlParser = ClientManager.Instance.RuntimeCtx.Parser;
    let tokensVector: List<string>;

    let endContext: number = parser.getXMLdata().indexOf(XMLConstants.TAG_TERM, parser.getCurrIndex());
    if (endContext !== -1 && endContext < parser.getXMLdata().length) {
      // last position of its tag
      let tag: String = parser.getXMLsubstring(endContext);
      parser.add2CurrIndex(tag.indexOf(ConstInterface.MG_TAG_USER_DETAILS) + ConstInterface.MG_TAG_USER_DETAILS.length);
      tokensVector = XmlParser.getTokens(parser.getXMLsubstring(endContext), XMLConstants.XML_ATTR_DELIM);
      this.initElements(tokensVector);
      parser.setCurrIndex(endContext + XMLConstants.TAG_TERM.length); // to delete ">" too
    }
    else
      Logger.Instance.WriteExceptionToLog("in UserDetails.fillData(): out of bounds");
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="tokensVector"></param>
  /// <returns></returns>
  private initElements(tokensVector: List<String>): boolean {
    let attribute: String, valueStr;
    let isSuccess: boolean = true;
    let j: number;

    for (j = 0; j < tokensVector.Count; j += 2) {
      attribute = (<String>tokensVector[j]);
      valueStr = (<String>tokensVector[j + 1]);

      switch (attribute) {
        case ConstInterface.MG_TAG_USERNAME:
          this.UserName = valueStr;
          break;
        case ConstInterface.MG_ATTR_USERID:
          this.UserID = valueStr;
          ClientManager.Instance.setUsername(this.UserID);
          break;
        case ConstInterface.MG_ATTR_USERINFO:
          this.UserInfo = valueStr;
          break;
        case ConstInterface.MG_TAG_PASSWORD:
          this.Password = valueStr;
          let passwordDecoded: Uint8Array = Base64.decodeToByte(this.Password);
          let encryptedPassword: string = Encoding.UTF8.GetString(passwordDecoded, 0, passwordDecoded.length);
          let decryptedPassword: string = Scrambler.UnScramble(encryptedPassword, 0, encryptedPassword.length - 1);
          // At server side spaces are added at the end if the length of password is less than 4 characters.
          // Remove these extra spaces before setting the password.
          decryptedPassword = StrUtil.rtrim(decryptedPassword);
          // if the password is empty set a password containing one " ", as for userId, where if no userId
          // then a " " set to userId.
          if (NString.IsNullOrEmpty(decryptedPassword))
            decryptedPassword = " ";
          ClientManager.Instance.setPassword(decryptedPassword);
          break;
        default:
          Logger.Instance.WriteExceptionToLog("in UserDetails.initElements(): unknown attribute: " + attribute);
          isSuccess = false;
          break;
      }
    }
    return isSuccess;
  }
}
