import {Dictionary, RefParam, NObject} from "@magic/mscorelib";
import {DcValues, EMPTY_DCREF} from "./DcValues";
import {FieldsTable} from "./FieldsTable";
import {TaskBase} from "../tasks/TaskBase";
import {FieldDef} from "./FieldDef";
import {ITask} from "../tasks/ITask";
import {Events} from "../../Events";

/// <summary>
/// functionality required by the GUI namespace from the DataViewBase class.
/// </summary>
export class DataViewBase extends NObject {

  _dcValsCollection: Dictionary<DcValues> = new Dictionary<DcValues>();
  private _emptyDataview: boolean = false; // Indicates the task is in Empty Dataview
  _fieldsTab: FieldsTable = null; // <dvheader> ...</dvheader> tag
  _task: TaskBase = null; // container task

  // dummy DcValues for use with non-DC choice controls
  private _emptyChoice: DcValues = new DcValues(true, false);
  private _emptyChoiceForVectors: DcValues = new DcValues(true, true);


  /// <summary>
  ///   parse the DVHEADER tag
  /// </summary>
  fillHeaderData(): void {
    this._fieldsTab.fillData(this);
  }

  /// <summary>
  ///   get a field by its id
  /// </summary>
  /// <param name = "id">field id </param>
  getField(id: number): FieldDef {
    if (this._fieldsTab != null)
      return this._fieldsTab.getField(id);

    Events.WriteExceptionToLog("in DataView.getFieldDef(int): There is no fieldsTab object");
    return null;
  }

  /// <returns> the emptyDataview</returns>
  isEmptyDataview(): boolean {
    return this._emptyDataview;
  }

  /// <param name = "emptyDataview">the emptyDataview to set</param>
  setEmptyDataview(emptyDataview: boolean): void {
    this._emptyDataview = emptyDataview;
  }

  /// <summary>
  ///   return a reference to the task of this dataview
  /// </summary>
  getTask(): ITask {
    return this._task;
  }

/// <summary>
  ///   get dcValues object by its id
  /// </summary>
  /// <param name = "dcId">id of a data control values </param>
  getDcValues(dcId: number): DcValues {
    if (dcId === EMPTY_DCREF)
      return this.getEmptyChoice();

    let dcv: RefParam<DcValues>;
    this._dcValsCollection.TryGetValue(dcId.toString(), dcv);
    return dcv.value;
  }

  /// <returns>dummy DcValues for use with non-DC choice controls</returns>
  getEmptyChoice(): DcValues {
    return this._emptyChoice;
  }


  getEmptyChoiceForVectors(): DcValues {
    return this._emptyChoiceForVectors;
  }

  /// <summary>
  ///   get fields table (<dvheader>) of the ((DataView)dataView)
  /// </summary>
  GetFieldsTab(): FieldsTable {
    return this._fieldsTab;
  }

  constructor() {
    super();
  }
}
