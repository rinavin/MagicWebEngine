import {ApplicationException, List, NString} from "@magic/mscorelib";
import {Logger, XMLConstants, XmlParser} from "@magic/utils";
import {Task} from "../tasks/Task";
import {MGDataCollection} from "../tasks/MGDataCollection";
import {ClientManager} from "../ClientManager";
import {DataView} from "../data/DataView";
import {Recompute} from "./Recompute";

/// <summary>
///   Data for <recompute>....</recompute>
///   this class is used only to create the Recompute objects but do not
///   hold any data
/// </summary>
export class RecomputeTable {

  /// <summary>
  ///   get the recompute attributes
  /// </summary>
  private fillAttributes(parser: XmlParser): Task {
    let endContext: number = parser.getXMLdata().indexOf(XMLConstants.TAG_CLOSE, parser.getCurrIndex());
    let Index: number = parser.getXMLdata().indexOf(XMLConstants.MG_TAG_RECOMPUTE, parser.getCurrIndex()) + XMLConstants.MG_TAG_RECOMPUTE.length;

    let task: Task = null;
    let tokensVector: List<string> = XmlParser.getTokens(parser.getXMLdata().substr(Index, endContext - Index), '"');

    for (let j: number = 0; j < tokensVector.Count; j += 2) {
      let attribute: string = (tokensVector[j]);
      let valueStr: string = (tokensVector[j + 1]);

      if (attribute === XMLConstants.MG_ATTR_TASKID)
        task = <Task>MGDataCollection.Instance.GetTaskByID(valueStr);
      else
        Logger.Instance.WriteExceptionToLog(NString.Format("Unrecognized attribute: '{0}'", attribute));
    }
    parser.setCurrIndex(parser.getXMLdata().indexOf(XMLConstants.TAG_CLOSE, parser.getCurrIndex()) + 1);
    // start of <fld ...>

    return task;
  }

  fillData(): void;
  fillData(dataView: DataView, task: Task): void;
  fillData(dataView?: DataView, task?: Task): void {
    if (arguments.length === 0) {
      this.fillData_0();
      return;
    }
    this.fillData_1(dataView, task);
  }

  /// <summary>
  ///
  /// </summary>
  private fillData_0(): void {
    let parser: XmlParser = ClientManager.Instance.RuntimeCtx.Parser;

    let task: Task = this.fillAttributes(parser);

    if (task !== null) {
      Logger.Instance.WriteDevToLog("goes to refill recompute");
      this.fillData(<DataView>task.DataView, task);
    }
    else
      throw new ApplicationException("in RecomputeTable.fillData() invalid task id: ");
  }

  /// <summary>
  ///   To parse input string and fill inner data : Vector props
  /// </summary>
  private fillData_1(dataView: DataView, task: Task): void {
    let parser: XmlParser = ClientManager.Instance.RuntimeCtx.Parser;
    while (this.initInnerObjects(parser, parser.getNextTag(), dataView, task)) {
    }
  }

  /// <summary>
  ///   Fill Recompute Object, gives its reference to Field and reference of Field to him
  /// </summary>
  private initInnerObjects(parser: XmlParser, nameOfFound: String, dataView: DataView, task: Task): boolean {
    if (nameOfFound === null)
      return false;

    if (nameOfFound === XMLConstants.MG_TAG_RECOMPUTE)
      parser.setCurrIndex(parser.getXMLdata().indexOf(XMLConstants.TAG_CLOSE, parser.getCurrIndex()) + 1);
    // start of <fld ...>
    else if (nameOfFound === XMLConstants.MG_TAG_FLD) {
      let recompute: Recompute = new Recompute();
      recompute.fillData(dataView, task); // get reference to DataView, to make linked ref. : Recompute<-Field
      // taskReference for Recompute.props=> ControlTable.Control.task
    }
    else if (nameOfFound === '/' + XMLConstants.MG_TAG_RECOMPUTE) {
      parser.setCurrIndex2EndOfTag();
      return false;
    }
    else {
      Logger.Instance.WriteExceptionToLog(
        "There is no such tag in <recompute>, add case to RecomputeTable.initInnerObjects for " + nameOfFound);
      return false;
    }
    return true;
  }
}
