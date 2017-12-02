import {DataviewManagerBase} from "../data/DataviewManagerBase";
import {ReturnResultBase} from "../util/ReturnResultBase";

/// <summary>
/// data view command base
/// </summary>
export abstract class DataViewCommandBase {

  /// <summary>
  /// dataview manager
  /// </summary>
  DataviewManager: DataviewManagerBase = null;

  /// <summary>
  /// execute the command
  /// </summary>
  abstract Execute(): ReturnResultBase ;

}
