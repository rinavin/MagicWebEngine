import {IClientCommand} from "../IClientCommand";
import {Logger, XMLConstants} from "@magic/utils";
import {Exception, StringBuilder, RefParam} from "@magic/mscorelib";
import {MGData} from "../../tasks/MGData";
import {MGDataCollection} from "../../tasks/MGDataCollection";
import {ClientManager} from "../../ClientManager";
import {MgControl} from "../../gui/MgControl";
import {Task} from "../../tasks/Task";
import {ConstInterface} from "../../ConstInterface";

/// <summary>
/// base class for commands created in the client
/// </summary>
export class ClientOriginatedCommand implements IClientCommand {
  /// <summary>
  /// attribute of command to be sent to the server
  /// </summary>
  CommandTypeAttribute: string = null;

  /// <summary>
  /// used to tell which commands are handled locally and should not be serialized
  /// </summary>
  /// <returns></returns>
  get ShouldSerialize(): boolean {
    return true;
  }

  /// <summary>
  /// should the SerializeRecords method be called for this command
  /// </summary>
  get ShouldSerializeRecords(): boolean {
    return true;
  }

  /// <summary>
  /// general serialization for stuff common to all serialized commands
  /// </summary>
  /// <returns></returns>
  Serialize(): string {
    if (!this.ShouldSerialize)
      return null;

    let message: StringBuilder = new StringBuilder();
    let hasChildElements: boolean = false;

    message.Append(XMLConstants.START_TAG + ConstInterface.MG_TAG_COMMAND);
    message.Append(" " + XMLConstants.MG_ATTR_TYPE + "=\"" + this.CommandTypeAttribute + "\"");

    let refHasChildElements: RefParam<boolean> = new RefParam(hasChildElements);
    message.Append(this.SerializeCommandData(refHasChildElements));
    hasChildElements = refHasChildElements.value;

    if (this.ShouldSerializeRecords)
      message.Append(this.SerializeRecords());

    if (hasChildElements)
      message.Append(XMLConstants.TAG_CLOSE);
    else
      message.Append(XMLConstants.TAG_TERM);

    message.Append(this.SerializeDataAfterCommand());
    return message.ToString();
  }

  /// <summary>
  /// virtual method, to allow commands to serialize specific data
  /// </summary>
  /// <param name="hasChildElements"></param>
  /// <returns></returns>
  SerializeCommandData(refHasChildElements: RefParam<boolean>): string {
    return null;
  }

  /// <summary>
  /// should not be called for Query and for IniputForceWrite:
  /// </summary>
  /// <returns></returns>
  private SerializeRecords(): string {
    let message: StringBuilder = new StringBuilder();
    try {
      let currMGData: MGData = MGDataCollection.Instance.getCurrMGData();
      let length: number = currMGData.getTasksCount();
      let titleExist: boolean = false;
      let currFocusedTask: Task = ClientManager.Instance.getLastFocusedTask();

      for (let i: number = 0; i < length; i++) {
        let task: Task = currMGData.getTask(i);
        let ctrl: MgControl = <MgControl>task.getLastParkedCtrl();
        if (ctrl !== null && task.KnownToServer && !task.IsOffline) {
          if (!titleExist) {
            message.Append(" " + ConstInterface.MG_ATTR_FOCUSLIST + "=\"");
            titleExist = true;
          }
          else
            message.Append('$');
          message.Append(task.getTaskTag() + ",");
          message.Append(task.getLastParkedCtrl().getDitIdx());
        }
      }
      if (titleExist)
        message.Append("\"");

      if (currFocusedTask !== null && !currFocusedTask.IsOffline)
        message.Append(" " + ConstInterface.MG_ATTR_FOCUSTASK + "=\"" + currFocusedTask.getTaskTag() + "\"");
    }
    catch (ex) {
      if (ex instanceof Exception) {
        Logger.Instance.WriteExceptionToLog(ex);
      }
      else
        throw ex;
    }
    return message.ToString();
  }

  /// <summary>
  /// enable commands to serialize extra data after the command serialization (e.g. execution stack)
  /// </summary>
  /// <returns></returns>
  SerializeDataAfterCommand(): string {
    return null;
  }
}
