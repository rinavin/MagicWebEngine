import {GuiMgForm} from "../../gui/GuiMgForm";
import {PropParentInterface} from "../../gui/PropParentInterface";
import {
  MgFont, AutoFit,
  Logger_LogLevels, MgControlType, StorageAttribute, TabbingOrderType, WindowPosition, WindowType,
  WinUom, MgArrayList, XmlParser, XMLConstants, Constants, StrUtil
} from "@magic/utils";
import {
  Debug, Hashtable, Array_Enumerator, Int32, List, NNumber,
  NString, Stack, StringBuilder, RefParam, IEnumerable
} from "@magic/mscorelib";
import {MgControlBase} from "./MgControlBase";
import {MgPoint, MgPointF} from "../../util/MgPoint";
import {GuiMgControl} from "../../gui/GuiMgControl";
import {PropTable} from "./PropTable";
import {TaskBase} from "../tasks/TaskBase";
import {ControlTable} from "./ControlTable";
import {RuntimeContextBase} from "../RuntimeContextBase";
import {Manager} from "../../Manager";
import {Events} from "../../Events";
import {Property} from "./Property";
import {MgMenu} from "./MgMenu";
import {CommandType, DockingStyle, GuiMenuEntry_MenuType, MenuStyle} from "../../GuiEnums";
import {PropDefaults} from "./PropDefaults";
import {NUM_TYPE} from "../data/NUM_TYPE";
import {FieldDef} from "../data/FieldDef";
import {Commands} from "../../Commands";
import {Field} from "../data/Field";
import {MgRectangle} from "../../util/MgRectangle";
import {ToolbarInfo} from "./ToolbarInfo";
import {MenuEntry} from "./MenuEntry";
import {KeyboardItem} from "../../gui/KeyboardItem";
import {InternalHelp, MagicHelp} from "./Helps";
import {ColorProperties, PropInterface} from "./PropInterface";
import {GuiConstants} from "../../GuiConstants";

const delimiter: string = ", ";

/// <summary>
/// data for <form>...</form>
/// </summary>
export abstract class MgFormBase extends GuiMgForm implements PropParentInterface {
  private _controlsInheritingContext: List<MgControlBase> = null;
  private _toolbarGroupsCount: Hashtable<number, ToolbarInfo> = null;        // <int index, ToolbarInfo>
  private _allowedSubformRecompute: boolean = true;
  private _concreteWindowType: WindowType = 0;
  private _containerCtrl: MgControlBase = null;
  protected _destTblRow: number = Int32.MinValue;
  private _firstRefreshOfProps: boolean = true;
  protected _firstTableTabOrder: number = 0;            // tab order of first child of table

  private _frameFormCtrl: MgControlBase = null;
  private _guiTableChildren: List<GuiMgControl> = null;
  private _horizontalFactor: number = -1;
  protected LastDvRowCreated: number = -1;

  protected _inRefreshDisp: boolean = false;
  protected _inRestore: boolean = false;

  protected _instatiatedMenus: Hashtable<number, MgMenu> = null;        // menus that belong to this form according to menu style(pulldown \ context)

  protected _lastRowSent: number = -1;                  // last row sent ro gui thread

  private _prevSelIndex: number = -1;
  protected _prevTopIndex: number = -1;
  protected _propTab: PropTable = null;

  protected _rowsInPage: number = 1;
  private _shouldCreateToolbar: boolean = false;        // if to create toolbar
  private _shouldShowPullDownMenu: boolean = false;     // if show menu
  protected _subFormCtrl: MgControlBase = null;
  private _tableChildren: List<MgControlBase> = null;   // Can't use List<T>
  private _tableColumns: List<MgControlBase> = null;
  protected _tableMgControl: MgControlBase = null;

  protected _tableItemsCount: number = 0;               // number of rows in the table
  protected _tableRefreshed: boolean = false;
  protected _task: TaskBase = null;                     // the task to which the current form belongs
  protected _topIndexUpdated: boolean = false;          // true if a top index was updated
  protected _transferingData: boolean = false;          // rows are requested for a GUI thread
  private _userStateId: string = "";
  private _verticalFactor: number = -1;

  protected _wideControl: MgControlBase = null;         // for the wide form & parent form : save the MgControl of the wide
  private _wideParentControl: MgControlBase = null;     // for the wide form : save the MgControl of the parent

  // Form representing the internal help window.Here the internal form object is kept on the form object itself.
  // Property 'IsHelpWindow' is used to differentiate between the help form and non help form.
  private _internalHelpWindow: MgFormBase = null;
  InInitForm: boolean = false;
  IsHelpWindow: boolean = false;                        // the form is help form\window or not.
  CtrlTab: ControlTable = null;
  // prevents refresh of DisplayList for the corresponding controls and currRecCompute(RC)
  // until the form is refreshed in the first time
  FormRefreshed: boolean = false;
  FormRefreshedOnceAfterFetchingDataView: boolean = false;
  RefreshRepeatableAllowed: boolean = false;
  Rows: MgArrayList<Row> = null;
  ModalFormsCount: number = 0;
  ErrorOccured: boolean = false;
  FormIsn: number = 0;
  Name: string = null;
  Opened: boolean = false;

  private displayLine: number = 0;

  set DisplayLine(value: number) {
    this.displayLine = value;
  }

  get DisplayLine(): number {
    return this.displayLine;
  }

  IsFrameSet: boolean = false;
  isLegalForm: boolean = false;
  PBImagesNumber: number = 0;
  LastClickedMenuUid: number = 0;
  ignoreFirstRefreshTable: boolean = false;

  get ShouldShowPullDownMenu(): boolean {
    return this._shouldShowPullDownMenu;
  }

  set TableChildren(value: List<MgControlBase>) {
    this._tableChildren = value;
  }

  get TableChildren(): List<MgControlBase> {
    if (this._tableChildren === null)
      this.buildTableChildren();
    return this._tableChildren;
  }

  get ShouldCreateToolbar(): boolean {
    return this._shouldCreateToolbar;
  }

  get UserStateId(): string
  {
    return this._userStateId;
  }

  set AllowedSubformRecompute(value: boolean)
  {
    this._allowedSubformRecompute = value;
  }
  get AllowedSubformRecompute(): boolean
  {
    return this._allowedSubformRecompute;
  }

  get IsMDIOrSDIFrame(): boolean {
    return MgFormBase.isMDIOrSDI(this.ConcreteWindowType);
  }

  get IsMDIFrame(): boolean {
    return this.ConcreteWindowType === WindowType.MdiFrame;
  }

  get IsSDIFrame(): boolean {
    return this.ConcreteWindowType === WindowType.Sdi;
  }

  get IsChildWindow(): boolean {
    return this.ConcreteWindowType === WindowType.ChildWindow;
  }

  get IsValidWindowTypeForWidowList(): boolean {
    return this.IsMDIChild || this.IsSDIFrame || this.ConcreteWindowType === WindowType.Floating || this.ConcreteWindowType === WindowType.Tool;
  }

  set ConcreteWindowType(value: WindowType) {
    this._concreteWindowType = value;
  }

  get ConcreteWindowType(): WindowType {
    if (this._concreteWindowType === <WindowType>0) {
      let windowType: WindowType = <WindowType>this.getProp(PropInterface.PROP_TYPE_WINDOW_TYPE).getValueInt();
      if (windowType === WindowType.ChildWindow) {
        // if there is no parent for a child window, it should behave as Default type.
        if (this.ParentForm === null)
          windowType = WindowType.Default;
        else if (this.ParentForm.IsMDIFrame)
          windowType = WindowType.MdiChild;
      }

      if (windowType === WindowType.Default || windowType === WindowType.FitToMdi)
        windowType = MgFormBase.GetConcreteWindowTypeForMDIChild(windowType === WindowType.FitToMdi);

      // #989854 & 728875. If FrameForm is SDI and called is FIT_TO_MDI then make it floating.
      let rteCtx: RuntimeContextBase = Manager.GetCurrentRuntimeContext();
      if (windowType === WindowType.FitToMdi && rteCtx.FrameForm !== null && rteCtx.FrameForm.IsSDIFrame)
        windowType = WindowType.Floating;

      // Topic : 60 (WEBCLNT version 1.5 for WIN) Modal window - change of behavior and QCR #802495
      // Currently, any window that is called from a Modal window is opened as Modal window, regardless of it's type.
      // This will be changed in RC only, and the called window type will be as defined in the called form
      // (even if called from Modal window). This will solve problems when using the non-interactive RC tasks,
      // in which the called ownerTask must be Modal.

      // QCR #937102 - if non interactive ownerTask opens mdi child it becomes modal.
      // Ref QCR #802495 - Direct children of non interactive tasks  will be opened using ShowDialog(modal behavior) to prevent events on their parents
      // Since mdi child can not implement modal behavior it is replaced with modal on the fly.

      if (MgFormBase.isMDIChild(windowType))
        if (MgFormBase.ShouldBehaveAsModal())
          windowType = WindowType.Modal;

      this._concreteWindowType = windowType;
    }
    return this._concreteWindowType;
  }

  /// <summary>
  /// returns true for mdi child and fit to mdi
  /// </summary>
  get IsMDIChild(): boolean {
    return MgFormBase.isMDIChild(this.ConcreteWindowType);
  }

  /// <summary>
  /// Returns true for a FitToMdi window.
  /// </summary>
  get IsFitToMdi(): boolean {
    return this.ConcreteWindowType === WindowType.FitToMdi;
  }

  /// <summary>
  /// Returns true for Floating, Tool or Modal.
  /// </summary>
  get IsFloatingToolOrModal(): boolean {
    return this.ConcreteWindowType === WindowType.Floating || this.ConcreteWindowType === WindowType.Tool || this.ConcreteWindowType === WindowType.Modal;
  }

  /// <summary>the form of the task that called the current task (note: NOT triggering task).
  /// If this form (form of the task that called the current task) is not visible like in case
  /// for non-interactive task with OpenWindow=No, the ParentForm will be the immediate previous
  /// visible form.
  /// This means that ParentForm's task and Task's ParentTask can be different.
  /// </summary>
  ParentForm: MgFormBase = null;

  /// <summary>
  /// When closing the current form, we need to activate another form. Actually framework does it, but it activates
  /// a different form which is not appropriate for Magic --- refer Defects #71348 and #129179.
  /// Until Defect #129937, ParentForm was activated on closing the current form. But, it is wrong to do so.
  /// Why? --- Refer detailed comment in "Fix Description" of Defect #129937.
  /// So, a separate FormToBoActivatedOnClosingCurrentForm is maintained.
  /// </summary>
  FormToBoActivatedOnClosingCurrentForm: MgFormBase = null;

  get SupportActiveRowHightlightState(): boolean {
    return this.HasTable();
  }

  /// <summary>
  /// CTOR
  /// </summary>
  constructor() {
    super();
    this._propTab = new PropTable(this);
    this.CtrlTab = new ControlTable();
    this.Rows = new MgArrayList();
    this._toolbarGroupsCount = new Hashtable<number, ToolbarInfo>();
    this._controlsInheritingContext = new List<MgControlBase>();
    this._instatiatedMenus = new Hashtable<number, MgMenu>();
    this._concreteWindowType = <WindowType>0;
    this.ParentForm = null;
    this.IsHelpWindow = false;
  }

  /// <summary>Returns the internal window form.</summary>
  /// <returns></returns>
  GetInternalHelpWindowForm(): MgFormBase {
    return this._internalHelpWindow;
  }

  /// <summary> update the count of modal child forms on the frame window</summary>
  /// <param name = "mgFormBase">current modal form</param>
  /// <param name = "increase"></param>
  UpdateModalFormsCount(mgFormBase: MgFormBase, increase: boolean): void {
    Debug.Assert(MgFormBase.isMDIOrSDI(this.ConcreteWindowType));
    if (increase)
      this.ModalFormsCount += 1;
    else
      this.ModalFormsCount -= 1;

    Events.SetModal(mgFormBase, increase);
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="expId"></param>
  /// <param name="resType"></param>
  /// <param name="length"></param>
  /// <param name="contentTypeUnicode"></param>
  /// <param name="resCellType"></param>
  /// <param name="alwaysEvaluate"></param>
  /// <param name="wasEvaluated"></param>
  /// <returns></returns>
  EvaluateExpression(expId: number, resType: StorageAttribute, length: number, contentTypeUnicode: boolean,
                     resCellType: StorageAttribute, alwaysEvaluate: boolean, wasEvaluated: RefParam<boolean>): string {
    return this._task.EvaluateExpression(expId, resType, length, contentTypeUnicode, resCellType, true, wasEvaluated);
  }

  /// <summary>
  /// This method enables a specific action on all the menu objects of the form and its children's
  /// menus.
  /// </summary>
  /// <param name = "action">action whose state has changed</param>
  /// <param name = "enable">new state of the action</param>
  EnableActionMenu(action: number, enable: boolean): void {
    let mgMenu: MgMenu = null;
    let menuStyle: MenuStyle;
    let menuStylesEnumerator: Array_Enumerator<MenuStyle> = this._instatiatedMenus.Keys;

    while (menuStylesEnumerator.MoveNext()) {
      menuStyle = <MenuStyle>menuStylesEnumerator.Current;
      mgMenu = <MgMenu>this._instatiatedMenus.get_Item(menuStyle);
      mgMenu.enableInternalEvent(this, action, enable, null);
    }
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="propId"></param>
  /// <returns></returns>
  checkIfExistProp(propId: number): boolean {
    let exist: boolean = false;
    if (this._propTab !== null) {
      let propById: Property = this._propTab.getPropById(propId);
      exist = (propById !== null);
    }
    return exist;
  }

  /// <summary>
  /// return a property of the form by its Id
  /// </summary>
  /// <param name = "propId">the Id of the property</param>
  getProp(propId: number): Property {
    let prop: Property = null;
    Debug.Assert(propId !== PropInterface.PROP_TYPE_STARTUP_POSITION, "Please use GetStartupPosition()");

    if (this._propTab !== null) {
      prop = this._propTab.getPropById(propId);

      // if the property doesn't exist then create a new property and give it the default value
      // in addition add this property to the properties table
      if (prop === null) {
        prop = PropDefaults.getDefaultProp(propId, GuiConstants.PARENT_TYPE_FORM, this);
        if (prop !== null)
          this._propTab.addProp(prop, false);
      }
    }
    return prop;
  }

  /// <summary>
  /// get a property of the form that already was computed by its Id
  /// This method does not create a property if it isn't exist.
  /// May we need to create a property and use its default value.
  /// In Phase 2 in RefreshProperties method we'll create and compute properties,
  /// perhaps we need create all properties not only those that are different from default.
  /// </summary>
  /// <param name = "propId">the Id of the property</param>
  GetComputedProperty(propId: number): Property {
    let prop: Property = null;

    if (this._propTab !== null)
      prop = this._propTab.getPropById(propId);

    return prop;
  }

  /// <summary>
  /// checks if property has expression
  /// </summary>
  /// <param name="propId"></param>
  /// <returns></returns>
  PropertyHasExpression(propId: number): boolean {
    let prop: Property = this._propTab.getPropById(propId);
    return prop !== null && prop.isExpression();
  }

  /// <summary>
  /// </summary>
  /// <returns></returns>
  getCompIdx(): number {
    return (this.getTask() === null) ? 0 : this.getTask().getCompIdx();
  }

  /// <summary>
  /// return true if this is first refresh
  /// </summary>
  /// <returns></returns>
  IsFirstRefreshOfProps(): boolean {
    return this._firstRefreshOfProps;
  }

  /// <summary>
  /// for PropParentInterface
  /// </summary>
  getForm(): MgFormBase {
    return this;
  }

  /// <summary>
  /// parse the form structure
  /// </summary>
  /// <param name = "taskRef">reference to the ownerTask of this form</param>
  fillData(taskRef: TaskBase): void {
    let parser: XmlParser = Manager.GetCurrentRuntimeContext().Parser;

    if (this._task === null && taskRef !== null)
      this._task = taskRef;

    while (this.initInnerObjects(parser.getNextTag())) {
    }

    // inherit from the system menus if no menus is defined for the form
    this.inheritSystemMenus();
  }

  /// <summary>
  /// To allocate and fill inner objects of the class
  /// </summary>
  /// <param name="foundTagName"></param>
  /// <returns></returns>
  protected initInnerObjects(foundTagName: string): boolean {
    if (foundTagName === null)
      return false;


    let parser: XmlParser = Manager.GetCurrentRuntimeContext().Parser;
    if (MgFormBase.IsFormTag(foundTagName))
      this.fillName(foundTagName);
    else if (foundTagName === XMLConstants.MG_TAG_PROP)
      this._propTab.fillData(this, 'F');
    else if (foundTagName === XMLConstants.MG_TAG_CONTROL) {
      this.CtrlTab.fillData(this);
      this.initContextPropForControls();
      if (!this.HasTable())
        this.RefreshRepeatableAllowed = true;
    }
    else if (MgFormBase.IsEndFormTag(foundTagName)) {
      parser.setCurrIndex2EndOfTag();
      return false;
    }
    else
      return false;

    return true;
  }

  /// <summary>
  ///   This method performs a loop on all the forms controls and sets the context menu property
  ///   by invoking the get method.
  ///   The get is done in order to create a context menu property for all the controls on the form.
  ///   This way any control which does not have this property set, will still have a property which
  ///   we will be able to refresh in order to set on it the forms context menu.
  /// </summary>
  initContextPropForControls(): void {
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);
      ctrl.getProp(PropInterface.PROP_TYPE_CONTEXT_MENU);
    }
  }

  /// <summary>
  /// initialization.
  /// </summary>
  init(): void {
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);
      // initializes the subform controls
      ctrl.Init();
    }

    // build the controls tabbing order
    this.buildTabbingOrder();

    // build lists of linked controls on their parents
    this.buildLinkedControlsLists();

    // build lists of sibling controls
    this.buildSiblingList();

    // build list of columns and non columns
    this.buildTableColumnsList();
    this.createForm();

    this._task.setKeyboardMappingState(Constants.ACT_STT_TBL_SCREEN_MODE, this.isScreenMode());
    this._task.setKeyboardMappingState(Constants.ACT_STT_TBL_LEFT_TO_RIGHT, !this.getProp(PropInterface.PROP_TYPE_HEBREW).getValueBoolean());

    // if we tried to write to the status bar before the task was initialized, then now is the time to display the message!
    if (this._task.getSaveStatusText() !== null)
      Manager.WriteToMessagePane(this._task, this._task.getSaveStatusText(), false);
  }

  /// <summary>
  ///   Fill name member of the class
  /// </summary>
  /// <returns> end Index of the<form ...> subtag</returns>
  fillName(formTag: string): void {
    let parser: XmlParser = Manager.GetCurrentRuntimeContext().Parser;
    let endContext: number = NString.IndexOf(parser.getXMLdata(), XMLConstants.TAG_CLOSE, parser.getCurrIndex());

    if (endContext !== -1 && endContext < parser.getXMLdata().length) {
      // last position of its tag
      let tag: string = parser.getXMLsubstring(endContext);
      parser.add2CurrIndex(NString.IndexOf(tag, formTag) + formTag.length);

      let tokensVector: List<string> = XmlParser.getTokens(parser.getXMLsubstring(endContext), XMLConstants.XML_ATTR_DELIM);

      let attribute: string;
      let valueStr: string;

      for (let i: number = 0; i < tokensVector.Count; i = i + 2) {
        attribute = tokensVector.get_Item(i);
        valueStr = tokensVector.get_Item(i + 1);

        switch (attribute) {
          case XMLConstants.MG_ATTR_NAME:
            this.Name = XmlParser.unescape(valueStr).toString();
            if (Events.ShouldLog(Logger_LogLevels.Gui))
              Events.WriteGuiToLog(NString.Format("Parsing form \"{0}\"", this.Name));
            break;
          case XMLConstants.MG_ATTR_IS_FRAMESET:
            this.IsFrameSet = XmlParser.getBoolean(valueStr);
            break;
          case XMLConstants.MG_ATTR_IS_LIGAL_RC_FORM:
            this.isLegalForm = XmlParser.getBoolean(valueStr);
            break;
          case XMLConstants.MG_ATTR_PB_IMAGES_NUMBER:
            this.PBImagesNumber = XmlParser.getInt(valueStr);
            break;
          case XMLConstants.MG_ATTR_FORM_ISN:
            this.FormIsn = XmlParser.getInt(valueStr);
            break;
          case XMLConstants.MG_ATTR_USERSTATE_ID:
            this._userStateId = XmlParser.unescape(valueStr).toString();
            break;
          default:
            Events.WriteExceptionToLog(NString.Format("Unhandled attribute '{0}'.", attribute));
            break;
        }
      }
      parser.setCurrIndex(endContext + 1); // to delete ">" too
      return;
    }
    Events.WriteExceptionToLog("in Form.FillName() out of bounds");
  }

  /// <summary>
  ///   for each control build the list of all the controls that are linked to it
  /// </summary>
  private buildLinkedControlsLists(): void {
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);
      let linkedParent: MgControlBase = ctrl.getLinkedParent(false);
      if (linkedParent !== null)
        linkedParent.linkCtrl(ctrl);
    }
  }

  /// <summary>
  ///   build list of all controls that are in the same data of the parameter mgConatol relevant only for the
  ///   RadioButton
  /// </summary>
  /// <returns></returns>
  private buildSiblingList(): void {
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);
      if (ctrl.Type === MgControlType.CTRL_TYPE_RADIO) {
        if (ctrl.getField() !== null) {
          let sibling: List<MgControlBase> = new List<MgControlBase>();
          let myIdField: number = ctrl.getField().getId();

          for (let j: number = 0; j < this.CtrlTab.getSize(); j = j + 1) {
            let currCtrl: MgControlBase = this.CtrlTab.getCtrl(j);
            if (currCtrl.Type === MgControlType.CTRL_TYPE_RADIO) {
              let field: FieldDef = currCtrl.getField();
              if (ctrl !== currCtrl && field !== null) {
                if (myIdField === field.getId())
                  sibling.Add(currCtrl);
              }
            }
          }

          if (sibling.Count > 0) {
            ctrl.setSiblingVec(sibling);
          }
        }
      }
    }
  }


  /// <summary>
  /// </summary>
  arrangeZorder(): void {
    // create array list from the _ctrlTab
    let ctrlArrayList: List<MgControlBase> = new List<MgControlBase>();

    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      ctrlArrayList.Add(this.CtrlTab.getCtrl(i));
    }
    this.arrangeZorderControls(ctrlArrayList);
  }

  /// <summary>
  ///   arrange zorder for controls. recursive function.
  /// </summary>
  /// <param name = "controls"></param>
  private arrangeZorderControls(controls: List<MgControlBase>): void {
    let lowerControl: MgControlBase = null;
    for (let i: number = 0; i < controls.Count; i = i + 1) {
      let ctrl: MgControlBase = controls.get_Item(i);
      if (lowerControl !== null) {
        // if there is no parent need to move above the lower control
        if (ctrl.getParent() === lowerControl.getParent()) {
          Commands.addAsync(CommandType.MOVE_ABOVE, ctrl);
          lowerControl = ctrl;
        }
      }
      else
        lowerControl = ctrl;

      if (ctrl.getLinkedControls().Count > 0)
        this.arrangeZorderControls(ctrl.getLinkedControls());
    }
  }

  /// <summary>
  ///   build list of all columns controls
  /// </summary>
  private buildTableColumnsList(): void {
    if (this._tableMgControl !== null) {
      this._tableColumns = new List<MgControlBase>();
      for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
        let control: MgControlBase = this.CtrlTab.getCtrl(i);
        if (control.Type === MgControlType.CTRL_TYPE_COLUMN)
          this._tableColumns.Add(control);
      }
    }
  }

  /// <summary>
  /// Checks if an internal Fit to MDI form needs to be created to hold the Main Program controls
  /// </summary>
  /// <returns></returns>
  private ShouldCreateInternalFormForMDI(): boolean {
    return this.IsMDIFrame && this.GetControlsCountExcludingStatusBar() > 0;
  }

  /// <summary>
  ///   Creates the window defined by this form and its child controls
  /// </summary>
  createForm(): void {
    let runtimeContext: RuntimeContextBase = Manager.GetCurrentRuntimeContext();

    if (this.IsMDIFrame)
      runtimeContext.FrameForm = this;

    if (!this.isSubForm()) {
      let object: any = this.FindParent(runtimeContext);

      // parent can be null.
      Commands.addAsync(CommandType.CREATE_FORM, object, this, this.ConcreteWindowType, this.Name, false, this.ShouldCreateInternalFormForMDI(), this._task.IsBlockingBatch);
    }
    this.orderSplitterContainerChildren();
    this.InitMenuInfo();

    // default create one row in table control. DON'T set items count during form open.
    // firstTableRefresh() will create the actual rows, and refresh the table.
    if (this.HasTable())
      this.InitTableControl();

    Commands.beginInvoke();
  }

  protected FindParent(runtimeContext: RuntimeContextBase): any {
    let parent: any = this.GetParentForm();

    if (this.IsMDIChild || parent === null)
      parent = runtimeContext.FrameForm;

    return parent;
  }

  /// <summary>
  ///   order the splitter container children. The child that is docked to fill is added first, then
  ///   the splitter control and finally the child that is docked either to the top or to the left
  /// </summary>
  private orderSplitterContainerChildren(): void {
    let ctrl: MgControlBase = null;
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      ctrl = this.CtrlTab.getCtrl(i);
      if (ctrl.isFrameSet()) {
        Commands.addAsync(CommandType.ORDER_MG_SPLITTER_CONTAINER_CHILDREN, ctrl);
      }
    }
  }

  /// <summary>
  ///   save information about the menu visible
  ///   save information about the toolbar visible
  /// </summary>
  /// <returns></returns>
  InitMenuInfo(): void {
    this._shouldShowPullDownMenu = false;
    this._shouldCreateToolbar = false;
    /* in MenuEntry, we need to know of the menu\toolbar need to be display*/
    // the show\hide of the menu\toolbar is compute and not recompute.

    // if the parent of the TaskBase is Modal\floating\tool, then his child will be also the same window type.
    if (this.IsMDIOrSDIFrame) {
      // check if we need to display the menu
      if (this.getProp(PropInterface.PROP_TYPE_DISPLAY_MENU) !== null)
        this._shouldShowPullDownMenu = this.getProp(PropInterface.PROP_TYPE_DISPLAY_MENU).getValueBoolean();

      // check if we need to display the toolbar
      if (this.getProp(PropInterface.PROP_TYPE_DISPLAY_TOOLBAR) !== null) {
        this._shouldCreateToolbar = this.getProp(PropInterface.PROP_TYPE_DISPLAY_TOOLBAR).getValueBoolean();
      }
    }
  }

  /// <summary>
  /// returns true for mdi child and fit to mdi
  /// </summary>
  /// <param name="windowType"></param>
  /// <returns></returns>
  static isMDIChild(windowType: WindowType): boolean {
    return windowType === WindowType.MdiChild || windowType === WindowType.FitToMdi;
  }

  /// <summary>
  /// returns true for mdi or sdi
  /// </summary>
  /// <param name="windowType"></param>
  /// <returns></returns>
  static isMDIOrSDI(windowType: WindowType): boolean {
    return windowType === WindowType.Sdi || windowType === WindowType.MdiFrame;
  }

  /// <summary>
  ///   check if the MgMenu is used by this form as a pulldown menu
  /// </summary>
  /// <param name = "mgMenu"></param>
  /// <returns></returns
  isUsedAsPulldownMenu(mgMenu: MgMenu): boolean {
    return this.getPulldownMenu() === mgMenu;
  }

  /// <summary>
  /// </summary>
  /// <returns> the attached pulldown menu</returns>
  getPulldownMenu(): MgMenu {
    return <MgMenu>this._instatiatedMenus.get_Item(MenuStyle.MENU_STYLE_PULLDOWN);
  }

  /// <summary>
  ///   return true if form has automatic tabbing order
  /// </summary>
  /// <returns></returns>
  isAutomaticTabbingOrder(): boolean {
    return this.getProp(PropInterface.PROP_TYPE_TABBING_ORDER).getValueInt() === TabbingOrderType.Automatically;
  }

  /// <summary>
  ///   true if we can refresh repeatable controls
  ///   QCR #434649, we prevent painting table's control untill shell is opened and we know how many rows to paint
  /// </summary>
  /// <returns></returns>
  isRefreshRepeatableAllowed(): boolean {
    return this.RefreshRepeatableAllowed;
  }

  /// <summary>
  ///   returns true if the form is screen mode
  /// </summary>
  isScreenMode(): boolean {
    return !this.isLineMode();
  }

  /// <summary>
  ///   returns true if the form is line mode
  ///   if we have a tree or a table on the form
  /// </summary>
  isLineMode(): boolean {
    return this.getMainControl() !== null;
  }

  /// <summary>
  ///   return true if task has table or tree
  /// </summary>
  /// <returns></returns>
  hasTable(): boolean {
    return this._tableMgControl !== null;
  }

  /// <summary>
  ///   return true if form should be opened as modal window
  /// </summary>
  /// <returns></returns>
  isDialog(): boolean {
    let isDialog: boolean = false;

    // Check for 'isDialog' only for non help form.
    if (!this.IsHelpWindow) {
      let windowType: WindowType = this.ConcreteWindowType;
      if (windowType === WindowType.Modal || windowType === WindowType.ApplicationModal)
        isDialog = true;
      else if (MgFormBase.ShouldBehaveAsModal())
        isDialog = true;
    }

    return isDialog;
  }

  /// <summary>
  /// Should this form behave as Modal although its WindowType != Modal?
  /// </summary>
  /// <returns></returns>
  protected static ShouldBehaveAsModal(): boolean {
    return false;
  }

  /// <summary>
  ///   returns true if this form is subform
  /// </summary>
  /// <returns> boolean</returns>
  isSubForm(): boolean {
    return this._subFormCtrl !== null;
  }

  /// <summary>
  ///   return true if task has table
  /// </summary>
  /// <returns></returns>
  HasTable(): boolean {
    return this._tableMgControl !== null;
  }

  /// <returns> if there is Tab control on the form</returns>
  hasTabControl(): boolean {
    let hasTabCtrl: boolean = false;
    let ctrl: MgControlBase;

    for (let i: number = 0; i < this.CtrlTab.getSize(); i++) {
      ctrl = this.CtrlTab.getCtrl(i);
      if (ctrl.isTabControl())
        hasTabCtrl = true;
    }

    return hasTabCtrl;
  }

  /// <summary>
  ///   return the menu of the form according to style
  /// </summary>
  /// <returns></returns>
  getMgMenu(style: MenuStyle): MgMenu {
    return <MgMenu>this._instatiatedMenus.get_Item(style);
  }

  /// <summary>
  ///   return the topmost mgform of the subform
  /// </summary>
  /// <returns></returns>
  getTopMostForm(): MgFormBase {
    let topMostForm: MgFormBase = this;

    // The form of the sub form control
    while (topMostForm.isSubForm() && topMostForm.ParentForm !== null)
      topMostForm = topMostForm.ParentForm;

    return topMostForm;
  }

  /// <summary>
  ///   return the topmost frame form for menu refresh.
  /// </summary>
  /// <returns></returns>
  getTopMostFrameFormForMenuRefresh(): MgFormBase {
    return this.getTopMostFrameForm();
  }

  /// <summary>
  ///   return the topmost mgform of the subform
  /// </summary>
  /// <returns></returns>
  getTopMostFrameForm(): MgFormBase {
    let topMostForm: MgFormBase = this;

    while (topMostForm !== null && !topMostForm.IsMDIOrSDIFrame)
      topMostForm = ((topMostForm.ParentForm !== null) ? topMostForm.ParentForm : null);

    return topMostForm;
  }

  /// <returns> the subFormCtrl
  /// </returns>
  getSubFormCtrl(): MgControlBase {
    return this._subFormCtrl;
  }

  /// <summary>
  ///   return object that is used for form mapping in control's map
  /// </summary>
  /// <returns></returns>
  getMapObject(): any {
    // TODO
    // return _subFormCtrl  ?? (Object)this
    return this._subFormCtrl || this;
  }

  /// <summary>Returns the requested control</summary>
  /// <param name = "ctrlIdx">the index of the requested control</param>
  getCtrl(ctrlIdx: number): MgControlBase {
    return this.CtrlTab.getCtrl(ctrlIdx);
  }

  /// <summary>
  ///   Return the control with a given name
  /// </summary>
  /// <param name = "ctrlName">the of the requested control</param>
  /// <returns> a reference to the control with the given name or null if does not exist</returns>
  GetCtrl(ctrlName: string): MgControlBase {
    return this.CtrlTab.getCtrl(ctrlName);
  }

  /// <summary>
  /// Get the items list of choice controls.
  /// </summary>
  /// <param name="mgControl"></param>
  /// <returns></returns>
  GetChoiceControlItemList(mgControl: MgControlBase): string {
    Debug.Assert(mgControl.isChoiceControl());

    let items: List<string> = new List();
    let fld: Field = mgControl.getField();
    let storageAttribute: StorageAttribute = fld.getCellsType();

    if (storageAttribute !== StorageAttribute.DATE && storageAttribute !== StorageAttribute.TIME) {
      if (mgControl.isRadio()) {
        fld.GetRadioCtrls().forEach(radioControl => {
          items.AddRange(radioControl.GetItemsRange());
        });
      }
      else {
        items.AddRange(mgControl.GetItemsRange());
      }
      return MgFormBase.ConvertArrayListToString(items, storageAttribute === StorageAttribute.NUMERIC);
    }

    return NString.Empty;
  }

  /// <summary>
  /// Get the display list of choice controls.
  /// </summary>
  /// <param name="mgControl"></param>
  /// <returns></returns>
  GetChoiceControlDisplayList(mgControl: MgControlBase): string {
    Debug.Assert(mgControl.isChoiceControl());

    let items: List<string> = new List();
    let fld: Field = mgControl.getField();
    let storageAttribute: StorageAttribute = fld.getCellsType();

    if (storageAttribute !== StorageAttribute.DATE && storageAttribute !== StorageAttribute.TIME) {
      if (mgControl.isRadio()) {
        fld.GetRadioCtrls().forEach( radioControl => {
          items.AddRange(radioControl.GetDisplayRange());
        });
      }
      else {
        items.AddRange(mgControl.GetItemsRange());
      }
      return MgFormBase.ConvertArrayListToString(items, false);
    }

    return NString.Empty;
  }

  /// <summary>
  /// Returns the comma concatenated string from array list.
  /// </summary>
  /// <param name="items"></param>
  /// <param name="isItemNumType"></param>
  /// <returns></returns>
  private static ConvertArrayListToString(items: List<string>, isItemNumType: boolean): string {
    let from: string[] = ["\\", "-", ","];
    let to: string[] = ["\\\\", "\\-", "\\,"];
    let stringBuilder: StringBuilder = new StringBuilder();
    let nUM_TYPE: NUM_TYPE;

    for (let index: number = 0; index < items.Count; index = index + 1) {
      if (isItemNumType) {
        nUM_TYPE = new NUM_TYPE(<string>items.get_Item(index));
        items[index] = nUM_TYPE.to_double().toString();
      }

      stringBuilder.Append(StrUtil.searchAndReplace(<string>items.get_Item(index), from, to));

      if (index < items.Count - 1)
        stringBuilder.Append(delimiter);
    }

    return stringBuilder.ToString();
  }

  /// <returns> the frameFormCtrl</returns>
  getFrameFormCtrl(): MgControlBase {
    return this._frameFormCtrl;
  }

  /// <summary>
  ///   return control's column
  /// </summary>
  /// <param name = "ctrl"></param>
  /// <returns></returns>
  getControlColumn(ctrl: MgControlBase): MgControlBase {
    let column: MgControlBase = null;

    if ((ctrl.IsRepeatable || ctrl.IsTableHeaderChild) && this._tableColumns !== null)
      column = this._tableColumns.get_Item(ctrl.getLayer() - 1);

    return column;
  }

  /// <returns> the container control</returns>
  getContainerCtrl(): MgControlBase {
    return this._containerCtrl;
  }

  /// <summary>
  ///   get all column on the form
  /// </summary>
  getColumnControls(): List<MgControlBase> {
    let columnControlsList: List<MgControlBase> = null;

    if (this.CtrlTab !== null) {
      for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
        let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);
        if (ctrl.Type === MgControlType.CTRL_TYPE_COLUMN) {
          if (columnControlsList === null)
            columnControlsList = new List<MgControlBase>();
          columnControlsList.Add(ctrl);
        }
      }
    }
    return columnControlsList;
  }

  /// <summary>
  ///   return the task of the form
  /// </summary>
  getTask(): TaskBase {
    return this._task;
  }

  /// <summary> /// This function returns the index of the help object attached to the form/// </summary>
  /// <returns>Help index</returns>
  getHelpIndex(): number {
    let hlpIndex: number = -1;
    let prop: Property;

    if (this._propTab !== null) {
      prop = this._propTab.getPropById(PropInterface.PROP_TYPE_HELP_SCR);
      if (prop !== null)
          hlpIndex = NNumber.Parse(prop.getValue());
    }
    return hlpIndex;
  }

  /// <summary>
  ///   translate uom Rectangle to pixels
  /// </summary>
  /// <param name = "rect"></param>
  uom2pixRect(rect: MgRectangle): MgRectangle {
    return new MgRectangle(this.uom2pix(<number>rect.x, true), this.uom2pix(<number>rect.y, false),
      this.uom2pix(<number>rect.width, true), this.uom2pix(<number>rect.height, false));
  }

  /// <summary>
  ///   convert size from uom 2 pixels and from pixels to uom
  /// </summary>
  /// <param name = "isXaxis:">if true then the result relates to the X-axis, otherwise, it relates to the Y-axis</param>
  /// <returns></returns>
  private prepareUOMConversion(isXaxis: boolean): number {
    // initialize the factor values on first call
    if (isXaxis) {
      if (this._horizontalFactor === -1)
        this._horizontalFactor = this.getProp(PropInterface.PROP_TYPE_HOR_FAC).getValueInt();
    }
    else if (this._verticalFactor === -1)
      this._verticalFactor = this.getProp(PropInterface.PROP_TYPE_VER_FAC).getValueInt();

    let uomMode: WinUom = <WinUom>this.getProp(PropInterface.PROP_TYPE_UOM).getValueInt();

    // set the object on which the calculation is to be done.
    let obj: any = this;
    if (this.isSubForm())
      obj = this._subFormCtrl;

    Debug.Assert(uomMode === WinUom.Pix);
    return <number>Commands.getResolution(obj).x / 96;
  }

  uom2pix(uomVal: number, isXaxis: boolean): number;
  uom2pix(uomVal: number, isXaxis: boolean): number;
  uom2pix(uomVal: any, isXaxis: boolean): number {
    if (arguments.length === 2 && (uomVal === null || uomVal.constructor === Number) && (isXaxis === null || isXaxis.constructor === Boolean)) {
      return this.uom2pix_0(uomVal, isXaxis);
    }
    return this.uom2pix_1(uomVal, isXaxis);
  }

  /// <summary>
  ///   converts from uom to pixels
  /// </summary>
  /// <param name = "uomVal">the measurement size in uom terms</param>
  /// <param name = "isXaxis">if true then the result relates to the X-axis, otherwise, it relates to the Y-axis</param>
  /// <returns> the uomVal converted to pixels</returns>
  private uom2pix_0(uomVal: number, isXaxis: boolean): number {
    let result: number = 0;

    // calculate the result of the conversion from uom to pixels
    if (uomVal > 0) {
      let factor: number = this.prepareUOMConversion(isXaxis);
      result = <number>(<number>(<number>uomVal * factor) + 0.5);
    }
    return result;
  }

  /// <summary>
  /// converts from double uom to pixels
  /// </summary>
  /// <param name="uomVal"></param>
  /// <param name="isXaxis"></param>
  /// <returns></returns>
  private uom2pix_1(uomVal: number, isXaxis: boolean): number {
    let result: number = 0.0;

    // calculate the result of the conversion from uom to pixels
    if (uomVal !== 0.0)
      result = uomVal * <number>this.prepareUOMConversion(isXaxis);

    return result;
  }

  pix2uom(pixVal: number, isXaxis: boolean): number;
  pix2uom(pixVal: number, isXaxis: boolean): number;
  pix2uom(pixVal: any, isXaxis: boolean): number {
    if (arguments.length === 2 && (pixVal === null || pixVal.constructor === Number) && (isXaxis === null || isXaxis.constructor === Boolean)) {
      return this.pix2uom_0(pixVal, isXaxis);
    }
    return this.pix2uom_1(pixVal, isXaxis);
  }

  /// <summary>
  ///   converts from pixels to uom
  /// </summary>
  /// <param name = "pixVal">the measurement size in pixels terms</param>
  /// <param name = "isXaxis">if true then the result relates to the X-axis, otherwise, it relates to the Y-axis</param>
  /// <returns> the uomVal converted to pixels</returns>
  private pix2uom_0(pixVal: number, isXaxis: boolean): number {
    let result: number = 0;

    // calculate the result of the conversion from pixels to uom
    if (pixVal > 0) {
      let factor: number = this.prepareUOMConversion(isXaxis);
      factor = <number>pixVal / factor;
      result = <number>(<number>factor + ((factor > 0) ? 0.5 : -0.5));
    }
    return result;
  }

  /// <summary>
  ///  converts from double pixels to uom
  /// </summary>
  /// <param name="pixVal"></param>
  /// <param name="isXaxis"></param>
  /// <returns></returns>
  private pix2uom_1(pixVal: number, isXaxis: boolean): number {
    let result: number = 0.0;

    // calculate the result of the conversion from pixels to uom
    if (pixVal !== 0.0)
      result = pixVal / <number>this.prepareUOMConversion(isXaxis);

    return result;
  }

  /// <summary>
  ///   after open the form need to move it according to the startup position property on the form
  ///   PROP_TYPE_STARTUP_POSITION
  /// </summary>
  startupPosition(): void {
    let relativeRect: MgRectangle = null;
    let mgFormParent: MgFormBase = null;
    let centerPoint: MgPoint = null;
    let addCommandType: boolean = false;
    let needConvertToPix: boolean = true;

    if (!this.isSubForm() && !this.IsFitToMdi) {
      let windowPosition: WindowPosition = this.GetStartupPosition();
      centerPoint = new MgPoint(0, 0);
      relativeRect = new MgRectangle(0, 0, 0, 0);

      switch (windowPosition) {
        case WindowPosition.CenteredToMagic: // center to MDI
        case WindowPosition.CenteredToParent:
          let currentRuntimeContext: RuntimeContextBase = Manager.GetCurrentRuntimeContext();
          if (windowPosition === WindowPosition.CenteredToMagic)
            mgFormParent = currentRuntimeContext.FrameForm;
          else {  // WindowPosition.WIN_POS_CENTERED_TO_PARENT
            mgFormParent = this.ParentForm;
            if (this.IsMDIChild) {
              let mgFormBase2: MgFormBase = this.ParentForm;
              if (this.ParentForm.getSubFormCtrl() !== null)
                mgFormBase2 = this.ParentForm.getTopMostForm();

              // For MDI child, if the topMostForm is neither MDIChild nor MDIFrame then return MDIFrame
              if (!mgFormBase2.IsChildWindow && !mgFormBase2.IsMDIChild && !mgFormBase2.IsMDIFrame)
                mgFormParent = currentRuntimeContext.FrameForm;
            }
          }

          if (mgFormParent !== null) {
            centerPoint = this.GetCenterPoint(mgFormParent);
            needConvertToPix = false;
            addCommandType = true;
          }
          break;
        case WindowPosition.Customized:
          // The x&y of the user define in the prop sheet (according to the parent)
          // the server doesn't send the x,y when inherited
          centerPoint.x = this.getProp(PropInterface.PROP_TYPE_LEFT).getValueInt();
          centerPoint.y = this.getProp(PropInterface.PROP_TYPE_TOP).getValueInt();
          addCommandType = true;
          break;
        case WindowPosition.DefaultBounds:
        case WindowPosition.DefaultLocation:
          // Do nothing, OS is define the point
          break;
        case WindowPosition.CenteredToDesktop:
          let relativeForm: MgFormBase;
          if (this.IsMDIChild)
            relativeForm = Manager.GetCurrentRuntimeContext().FrameForm;
          else
            relativeForm = this.ParentForm;

          Commands.getDesktopBounds(relativeRect, relativeForm);

          // when MdiChild position in MDIFrame
          // If child window position in parent window
          // When floating, modal, tool or sdi converting to client co-ordinates not required
          centerPoint = this.GetCenterPoint(relativeForm, relativeRect);
          needConvertToPix = false;
          addCommandType = true;
          break;
      }
    }

    if (addCommandType) {
      if (needConvertToPix) {
        centerPoint.x = this.uom2pix(<number>centerPoint.x, true);
        centerPoint.y = this.uom2pix(<number>centerPoint.y, false);
      }

      Commands.addAsync(CommandType.PROP_SET_BOUNDS, this, 0, centerPoint.x, centerPoint.y,
        GuiConstants.DEFAULT_VALUE_INT, GuiConstants.DEFAULT_VALUE_INT, false, false);
    }
  }

  private GetCenterPoint(parentForm: MgFormBase, relativeRect: MgRectangle): MgPoint;
  private GetCenterPoint(mgFormParent: MgFormBase): MgPoint;
  private GetCenterPoint(parentFormOrMgFormParent: MgFormBase, relativeRect?: MgRectangle): MgPoint {
    if (arguments.length === 2 && (parentFormOrMgFormParent === null || parentFormOrMgFormParent instanceof MgFormBase) && (relativeRect === null || relativeRect instanceof MgRectangle)) {
      return this.GetCenterPoint_0(parentFormOrMgFormParent, relativeRect);
    }
    return this.GetCenterPoint_1(parentFormOrMgFormParent);
  }

  /// <summary>
  ///   return Point ,center to the giving relativeRect
  /// </summary>
  private GetCenterPoint_0(parentForm: MgFormBase, relativeRect: MgRectangle): MgPoint {
    let x: number;
    let y: number;
    let formRect: MgRectangle = new MgRectangle(0, 0, 0, 0);

    // get bounds for the current form
    Commands.getBounds(this, formRect);

    // calculate the point
    x = (relativeRect.width - formRect.width) / 2 + relativeRect.x;
    y = (relativeRect.height - formRect.height) / 2 + relativeRect.y;

    let pt: MgPoint = new MgPoint(x, y);

    if (this.IsMDIChild || this.IsChildWindow) {
      let parent: any = null;

      if (parentForm !== null) {
        parent = parentForm;
        if (parentForm.isSubForm())
          parent = parentForm.getSubFormCtrl();
        else if (parentForm.getContainerCtrl() !== null)
          parent = parentForm.getContainerCtrl();
      }

      Commands.PointToClient(parent, pt);

      // fix negative coords
      pt.x = Math.max(pt.x, 0);
      pt.y = Math.max(pt.y, 0);
    }
    else {
      // Defect# 117245: For floating/modal windows, check if point is inside the bounds of one of the monitors.
      // If so, use that point. If it is not contained in any of the monitors, then get parent form monitor.
      // Get LeftTop of parent form monitor and use it as reference location.
      let isPointInMonitor: boolean = Commands.IsPointInMonitor(pt);

      if (!isPointInMonitor) {
        pt = Commands.GetLeftTopLocationFormMonitor(parentForm);
      }
    }
    return pt;
  }

  /// <summary>
  ///   Calculate Center point.
  ///   All co-ordinates will be converted to screen co-ordinates and then
  ///   they will be converted to client co-ordinates according to their parent.
  /// </summary>
  private GetCenterPoint_1(mgFormParent: MgFormBase): MgPoint {
    let relativeForm: MgFormBase = mgFormParent;
    let relativeRect: MgRectangle = new MgRectangle(0, 0, 0, 0);
    let centerPoint: MgPoint;
    let currentRuntimeContext: RuntimeContextBase = Manager.GetCurrentRuntimeContext();

    if (mgFormParent.getSubFormCtrl() !== null ||
      mgFormParent.getContainerCtrl() !== null) {
      // If Parent form is sub-form or form in frameset then get relativeRect of
      // appropriate control
      let ctrl: MgControlBase = (mgFormParent.getSubFormCtrl() !== null) ? mgFormParent.getSubFormCtrl() : mgFormParent.getContainerCtrl();
      Commands.getBoundsRelativeTo(ctrl, 0, relativeRect, null);
    }
    else {
      Commands.getBounds(mgFormParent, relativeRect);

      // When Parent is SDI/Floating/Modal/Tool then the co-ordinates are already screen
      // co-ordinates. When form has a subform/container control then
      // co-ordinates returned by getBoundsRelativeTo are screen co-ordinates.
      let pt: MgPoint = new MgPoint(relativeRect.x, relativeRect.y);
      switch (mgFormParent.ConcreteWindowType) {
        case WindowType.MdiFrame:
          relativeRect = Commands.GetMDIClientBounds();
          pt = new MgPoint(relativeRect.x, relativeRect.y);
          Commands.PointToScreen(currentRuntimeContext.FrameForm, pt);
          break;
        case WindowType.FitToMdi:
        case WindowType.MdiChild:
          // If calling window is MDIChild then pointToScreen of MDIClient is to be called
          Commands.PointToScreen(currentRuntimeContext.FrameForm, pt);
          break;
        case WindowType.ChildWindow:
          // If parent form is child window then call PointToScreen of its parent
          let parentObj: any = mgFormParent.GetParentForm();
          Commands.PointToScreen(parentObj, pt);
          break;
      }
      relativeRect.x = pt.x;
      relativeRect.y = pt.y;
    }

    if (this.IsMDIChild)
      relativeForm = currentRuntimeContext.FrameForm;
    else
      relativeForm = this.ParentForm;

    centerPoint = this.GetCenterPoint(relativeForm, relativeRect);

    return centerPoint;
  }

  /// <returns> get all ctrls of 'type'</returns>
  getCtrls(type: MgControlType): List<MgControlBase> {
    let curr: MgControlBase = null;
    let ctrls: List<MgControlBase> = new List<MgControlBase>();

    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      curr = this.CtrlTab.getCtrl(i);
      if (curr.Type === type)
        ctrls.Add(curr);
    }
    return ctrls;
  }

  /// <summary>
  ///   get table control
  /// </summary>
  /// <returns></returns>
  getTableCtrl(): MgControlBase {
    return this._tableMgControl;
  }

  /// <summary>
  ///   return tree or table control of the form
  /// </summary>
  /// <returns></returns>
  getMainControl(): MgControlBase {
    return this._tableMgControl;
  }

  /// <summary>
  ///   Return the control (which is not the frame form) with a given name
  /// </summary>
  /// <param name = "ctrlName">the of the requested control</param>
  /// <param name="ctrlType"></param>
  /// <returns> a reference to the control with the given name or null if does not exist</returns>
  getCtrlByName(ctrlName: string, ctrlType: MgControlType): MgControlBase {
    return this.CtrlTab.getCtrlByName(ctrlName, ctrlType);
  }

  /// <summary>
  ///   This method returns the context menu number of the form.
  ///   In case the form does not have a context menu defined, the system context menu is returned
  /// </summary>
  /// <returns></returns>
  getContextMenuNumber(): number {
    let contextMenu: number = (this.GetComputedProperty(PropInterface.PROP_TYPE_CONTEXT_MENU) !== null) ?
      this.GetComputedProperty(PropInterface.PROP_TYPE_CONTEXT_MENU).GetComputedValueInteger() : 0;

    if (contextMenu === 0) {
      if (this.isSubForm()) {
        if (this.ParentForm !== null)
          contextMenu = this.ParentForm.getContextMenuNumber();
      }
    }

    // if value is zero, we need to use the system menu definition
    if (contextMenu === 0)
      contextMenu = this.getSystemContextMenu();

    return contextMenu;
  }

  /// <summary>
  ///   return the control's context menu
  /// </summary>
  /// <param name = "createIfNotExist">This decided if Context menu is to be created or not.</param>
  /// <returns>matching mgMenu</returns>
  getContextMenu(createIfNotExist: boolean): MgMenu {
    let mgMenu: MgMenu = null;
    let contextMenuNum: number = this.getContextMenuNumber();

    if (contextMenuNum > 0)
      mgMenu = Manager.GetMenu(this.getTask().ContextID, this.getTask().getCtlIdx(), contextMenuNum, MenuStyle.MENU_STYLE_CONTEXT, this, createIfNotExist);

    return mgMenu;
  }

  /// <summary>
  ///   return the application-level context menu index
  /// </summary>
  /// <returns>matching menu index</returns>
  getSystemContextMenu(): number {
    let mainProg: TaskBase = <TaskBase>Manager.MGDataTable.GetMainProgByCtlIdx(this.getTask().ContextID, this.getTask().getCtlIdx());
    return mainProg.getSystemContextMenu();
  }

  /// <summary>
  ///   if row is not created yet creates row
  /// </summary>
  /// <param name = "idx"></param>
  checkAndCreateRow(idx: number): void {
    if (this._tableMgControl !== null && !this.isRowCreated(idx))
      this.createRow(idx);
  }

  /// <summary>
  ///   marks row created
  /// </summary>
  /// <param name = "idx"></param>
  private createRow(idx: number): void {
    Commands.addAsync(CommandType.CREATE_TABLE_ROW, this._tableMgControl, 0, idx);

    if (this.Rows.Count <= idx)
      this.Rows.SetSize(idx + 1);

    this.Rows[idx] = new Row(true, true);
  }

  /// <summary>
  ///   validate row
  /// </summary>
  /// <param name = "idx"></param>
  validateRow(idx: number): void {
    if (this._tableMgControl !== null) {
      let row: Row = this.Rows[idx];
      if (!row.Validated) {
        Commands.addAsync(CommandType.VALIDATE_TABLE_ROW, this._tableMgControl, 0, idx);
        row.Validated = true;
      }
    }
  }

  /// <summary>(public)
  /// check if specified row is valid row in page
  /// </summary>
  /// <param name="idx"></param>
  IsValidRow(idx: number): boolean {
    let validRow: boolean = false;

    if (this._tableMgControl !== null && idx >= 0 && idx < this.Rows.Count) {
      let row: Row = this.Rows[idx];
      validRow = (row !== null && row.Validated);
    }
    return validRow;
  }

  /// <summary>
  /// put record data on the screen
  /// </summary>
  refreshRow(rowIdx: number, repeatableOnly: boolean): void {
    if (this.hasTable()) {
      this.checkAndCreateRow(rowIdx);
      this.DisplayLine = rowIdx;
    }
    this.refreshControls(repeatableOnly);
  }

  /// <summary>
  ///   refresh the form properties
  /// </summary>
  refreshProps(): void {
    if (this._firstRefreshOfProps) {
      this.getProp(PropInterface.PROP_TYPE_TITLE_BAR);
      this.getProp(PropInterface.PROP_TYPE_SYSTEM_MENU);
      this.getProp(PropInterface.PROP_TYPE_MINBOX);
      this.getProp(PropInterface.PROP_TYPE_MAXBOX);
      this.getProp(PropInterface.PROP_TYPE_BORDER_STYLE);

      if (this.isSubForm())
        this.getProp(PropInterface.PROP_TYPE_WALLPAPER);
    }
    this._propTab.RefreshDisplay(false, false);

    if (this._firstRefreshOfProps)
      this._firstRefreshOfProps = false;
  }

  /// <summary>
  ///   refresh the controls of the current row
  /// </summary>
  /// <param name = "repeatableOnly">should be true in order to refresh only the controls that belong to a table</param>
  refreshControls(repeatableOnly: boolean): void {
    let ctrl: MgControlBase;
    // record does not exist
    if (this.DisplayLine === Int32.MinValue && !this.IsMDIFrame)
      return;

    // refresh the table first
    if (this._tableMgControl !== null && !repeatableOnly)
      this._tableMgControl.RefreshDisplay();

    // refresh all COLUMNS (refresh for each control base on the refresh of the column (e.g:column width)
    // so we must refresh the column first
    if (this._tableColumns !== null && !repeatableOnly) {
      for (let i: number = 0; i < this._tableColumns.Count; i = i + 1) {
        let mgControlBase: MgControlBase = this._tableColumns.get_Item(i);
        mgControlBase.RefreshDisplay();
      }
    }

    this.checkAndCreateRow(this.DisplayLine);

    // QCR #709563 Must refresh frameset's subfroms before we refresh frameset itself.
    // During refresh of the frameset nested subforms with RefreshWhenHidden might be brought to server
    // but their subform's controls have not been set with correct bounds. This causes illegal placement
    // and incorrect final location of controls on nested subforms
    let frameSets: Stack<MgControlBase> = new Stack<MgControlBase>();
    let tabAndGroupControls: Stack<MgControlBase> = new Stack<MgControlBase>();

    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      ctrl = this.CtrlTab.getCtrl(i);
      if ((ctrl.isTabControl() || ctrl.isGroup()) && !repeatableOnly) {
        tabAndGroupControls.push(ctrl);
        Commands.addAsync(CommandType.SUSPEND_LAYOUT, ctrl);
      }
      if (ctrl.Type === MgControlType.CTRL_TYPE_FRAME_SET) {
        frameSets.push(ctrl);
        continue;
      }

      if (ctrl.Type !== MgControlType.CTRL_TYPE_TABLE && ctrl.Type !== MgControlType.CTRL_TYPE_COLUMN) {
        if (ctrl.IsRepeatable || !repeatableOnly)
          ctrl.RefreshDisplay();
      }
      else if (ctrl.Type === MgControlType.CTRL_TYPE_TABLE && repeatableOnly)
        ctrl.RefreshDisplay(repeatableOnly);
    }
    while (frameSets.count() > 0)
      frameSets.pop().RefreshDisplay();

    while (tabAndGroupControls.count() > 0)
      Commands.addAsync(CommandType.RESUME_LAYOUT, tabAndGroupControls.pop());

    this.validateRow(this.DisplayLine);

    if (!this.FormRefreshedOnceAfterFetchingDataView && this._tableMgControl !== null && this._task.DataViewWasRetrieved) {
      this.FormRefreshedOnceAfterFetchingDataView = true;
      Commands.addAsync(CommandType.SET_SHOULD_APPLY_PLACEMENT_TO_HIDDEN_COLUMNS, this._tableMgControl);
    }
  }

  /// <summary>
  ///   returns true if Row is created on GUI level
  /// </summary>
  /// <param name = "idx"></param>
  /// <returns></returns>
  protected isRowCreated(idx: number): boolean {
    if (this.Rows.Count <= idx || idx < 0) {
      return false;
    }

    let row: Row = this.Rows[idx];
    if (row === null)
      return false;

    return row.Created;
  }

  /// <summary>
  ///   marks this row as not created
  /// </summary>
  /// <param name = "idx"></param>
  markRowNOTCreated(idx: number): void {
    Commands.addAsync(CommandType.UNDO_CREATE_TABLE_ROW, this._tableMgControl, 0, idx);

    if (this.Rows.Count <= idx || idx < 0)
      this.Rows[idx] = new Row(false, false);
  }

  SelectRow(): void;
  SelectRow(sendAlways: boolean): void;
  SelectRow(rowIdx: number, sendAlways: boolean): void;
  SelectRow(sendAlwaysOrRowIdx?: any, sendAlways?: boolean): void {
    if (arguments.length === 0) {
      this.SelectRow_0();
      return;
    }
    if (arguments.length === 1 && (sendAlwaysOrRowIdx === null || sendAlwaysOrRowIdx.constructor === Boolean)) {
      this.SelectRow_1(sendAlwaysOrRowIdx);
      return;
    }
    this.SelectRow_2(sendAlwaysOrRowIdx, sendAlways);
  }


  private SelectRow_0(): void {
    this.SelectRow(false);
  }

  /// <summary>
  ///   Mark current row as selected row
  /// </summary>
  private SelectRow_1(sendAlways: boolean): void {
    this.SelectRow(this.DisplayLine, sendAlways);
  }

  /// <summary>
  ///   Mark a row as selected row
  /// </summary>
  /// <param name = "rowIdx">row to select</param>
  /// <param name = "sendAlways">send selection command depending on previous value</param>
  private SelectRow_2(rowIdx: number, sendAlways: boolean): void {
    // controlForSelect can be table control or tree control
    let mainControl: MgControlBase = this.getMainControl();

    if (mainControl !== null && this.RefreshRepeatableAllowed) {
      let index: number = rowIdx;
      if (this._task.DataView.isEmptyDataview())
        index = GuiConstants.NO_ROW_SELECTED;

      if (sendAlways || index !== this._prevSelIndex) {
        // for tree control we always send selection, since sometimes we need to undo tree defaul selection
        this._prevSelIndex = index;
        Commands.addAsync(CommandType.SET_SELECTION_INDEX, mainControl, 0, index);
      }
    }
  }

  /// <summary>
  /// Mark/unmark row for multi marking
  /// </summary>
  /// <param name="rowIdx">indentifers the row</param>
  /// <param name="isMarked">mark/unmark</param>
  MarkRow(rowIdx: number, isMarked: boolean): void {
    Commands.addAsync(CommandType.SET_MARKED_ITEM_STATE, this.getTableCtrl(), rowIdx, isMarked);
  }

  /// <summary>
  ///   true if this is mdi child with startup position centered to client
  /// </summary>
  /// <returns></returns>
  MdliChildCenteredToParent(): boolean {
    if (this.ConcreteWindowType === WindowType.MdiChild) {
      if (this.GetStartupPosition() === WindowPosition.CenteredToParent)
        return true;
    }

    return false;
  }

  /// <summary>
  ///   This method returns the number of tools for the passed tool group
  /// </summary>
  /// <param name = "groupNumber">number of the tool group (0-based)</param>
  /// <returns></returns>
  getToolbarGroupCount(groupNumber: number): number {
    let toolbarInfo: ToolbarInfo = this.getToolBarInfoByGroupNumber(groupNumber, false);
    return (toolbarInfo !== null) ? toolbarInfo.getCount() : 0;
  }

  /// <summary>
  ///   return the toolbar info for group number, if not exist create it
  /// </summary>
  /// <param name = "groupNumber"></param>
  /// <param name = "createIfNotExist">TODO</param>
  /// <returns></returns>
  private getToolBarInfoByGroupNumber(groupNumber: number, createIfNotExist: boolean): ToolbarInfo {
    let toolbarInfo: ToolbarInfo = <ToolbarInfo>this._toolbarGroupsCount.get_Item(groupNumber);

    if (toolbarInfo !== null && !createIfNotExist) {
      if (toolbarInfo.getCount() === 0 && toolbarInfo.getMenuEntrySeperator() === null)
        return null;
    }

    if (toolbarInfo === null && createIfNotExist) {
      toolbarInfo = new ToolbarInfo();
      this._toolbarGroupsCount.set_Item(groupNumber, toolbarInfo);
    }

    return toolbarInfo;
  }

  /// <summary>
  /// get the rows in a page in table
  /// </summary>
  /// <returns> int is the table size</returns>
  getRowsInPage(): number {
    return this._rowsInPage;
  }

  /// <summary>
  /// set the rows in a page in table
  /// </summary>
  /// <param name = "size">the table size</param>
  setRowsInPage(size: number): void {
    this._rowsInPage = size;
  }

  /// <summary>
  ///   gets number of columns in the table
  /// </summary>
  /// <returns></returns>
  getColumnsCount(): number {
    let columnsCount: number = 0;

    if (this.CtrlTab !== null) {
      for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
        let control: MgControlBase = this.CtrlTab.getCtrl(i);
        if (control.Type === MgControlType.CTRL_TYPE_COLUMN)
          columnsCount = columnsCount + 1;
      }
    }

    return columnsCount;
  }

  /// <summary>
  ///   clear
  /// </summary>
  toolbarGroupsCountClear(): void {
    this._toolbarGroupsCount.Clear();
  }

  /// <summary>
  ///   This method adds a tools count for the passed tool group
  /// </summary>
  /// <param name = "groupNumber">number of the tool group (0-based)</param>
  /// <param name = "count">the new count of tool on the group</param>
  setToolbarGroupCount(groupNumber: number, count: number): void {
    let toolBarInfoByGroupNumber: ToolbarInfo = this.getToolBarInfoByGroupNumber(groupNumber, true);
    toolBarInfoByGroupNumber.setCount(count);
  }

  /// <summary>
  ///   returns the value of the "in refresh display" flag
  /// </summary>
  inRefreshDisplay(): boolean {
    return this._inRefreshDisp;
  }

  /// <summary>
  ///   remove the wide control from the _ctrlTab of the form
  /// </summary>
  private removeWideControl(): void {
    if (this._wideControl !== null) {
      this.CtrlTab.Remove(this._wideControl);
      Commands.addAsync(CommandType.DISPOSE_OBJECT, this._wideControl);
      this._wideControl = null;
    }
  }

  /// <summary>
  ///   return true if the wide is open
  /// </summary>
  /// <returns></returns>
  wideIsOpen(): boolean {
    return this.getTopMostForm()._wideControl !== null;
  }

  /// <summary>
  ///   get wide control
  /// </summary>
  /// <returns></returns>
  getWideControl(): MgControlBase {
    return this._wideControl;
  }

  /// <summary>
  /// </summary>
  /// <returns></returns>
  getWideParentControl(): MgControlBase {
    return this._wideParentControl;
  }

  /// <summary>
  ///   Execute the layout and all its children
  /// </summary>
  executeLayout(): void {
    Commands.addAsync(CommandType.EXECUTE_LAYOUT, this, true);
  }

  /// <summary>
  ///   decrease one from the count on the groupNumber
  /// </summary>
  /// <param name="groupNumber"></param>
  /// <param name="removeSeperat"></param>
  removeToolFromGroupCount(groupNumber: number, removeSeperat: boolean): void {
    if (this.getToolbarGroupCount(groupNumber) > 0) {
      let num: number = Math.max(this.getToolbarGroupCount(groupNumber) - 1, 0);
      this.setToolbarGroupCount(groupNumber, num);

      if (removeSeperat && num <= 1) {
        // when the group is empty(has only separator) need to remove the separator from the prev group
        // Only when it is the last group and not in the middle
        let prevGroup: number = this.getPrevGroup(groupNumber);

        // QCR#712355:Menu separator was not displayed properly as groupNumber was passed to
        // needToRemoveSeperatorFromPrevGroup() insteade of prevGroup.

        let removeSeperatorFromPrevGroup: boolean = this.needToRemoveSeperatorFromPrevGroup(prevGroup);
        if (removeSeperatorFromPrevGroup)
          this.removeSepFromGroup(prevGroup);
        else {
          let removeSeperatorFromCurrGroup: boolean = this.needToRemoveSeperatorFromCurrGroup(groupNumber);
          if (removeSeperatorFromCurrGroup)
            this.removeSepFromGroup(groupNumber);
        }
      }
      else {
        // if there is not longer any tool on the toolbar need to delete the toolbar
        // FYI: just hide the toolbar to actually deleted (it remove from the control map)
        if (this.getToolItemCount() === 0) {
          let mgMenu: MgMenu = <MgMenu>this._instatiatedMenus.get_Item(MenuStyle.MENU_STYLE_PULLDOWN);
          if (mgMenu !== null)
            mgMenu.deleteToolBar(this);
        }
      }
    }
    else {
      Debug.Assert(false);
    }
  }

  /// <param name = "currentGroup">
  /// </param>
  /// <returns></returns>
  private needToRemoveSeperatorFromPrevGroup(currentGroup: number): boolean {
    let needToRemoveSeperator: boolean = false;
    let prevGroup: number = this.getPrevGroup(currentGroup);
    let currentGroupCount: number = this.getToolbarGroupCount(currentGroup);
    let menuEntrySep: MenuEntry = this.getToolbarGroupMenuEntrySep(currentGroup);

    let itIsLastGroup: boolean = this.itIsLastGroupInToolbar(currentGroup);

    // if it is last group need to remove the sep from the last group
    if (!itIsLastGroup) {
      // remove the sep if we the second group and up, and we don't have any item
      if (prevGroup >= 0) {
        if (currentGroupCount === 0 || (currentGroupCount === 1 && menuEntrySep !== null))
          needToRemoveSeperator = true;
      }
      else {
        // it is the first group
        if (currentGroupCount === 0 && this.getGroupCount() > 1 && menuEntrySep !== null)
          needToRemoveSeperator = true;
      }
    }
    return needToRemoveSeperator;
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="groupNumber"></param>
  /// <returns></returns>
  private removeSepFromGroup(groupNumber: number): void {
    // remove the separator from the prev group
    let menuEntrySep: MenuEntry = this.getToolbarGroupMenuEntrySep(groupNumber);

    if (menuEntrySep !== null) {
      menuEntrySep.deleteMenuEntryTool(this, false, true);
      this.setToolbarGroupMenuEntrySep(groupNumber, null);
    }
  }

  /// <summary>
  ///   This method adds a menuEntry for seperator
  /// </summary>
  /// <param name = "groupNumber">number of the tool group (0-based)</param>
  /// <param name = "menuEntrySep">the new menuEntrySep of tool on the group</param>
  setToolbarGroupMenuEntrySep(groupNumber: number, menuEntrySep: MenuEntry): void {
    let toolBarInfoByGroupNumber: ToolbarInfo = this.getToolBarInfoByGroupNumber(groupNumber, true);
    toolBarInfoByGroupNumber.setMenuEntrySeperator(menuEntrySep);
  }

  /// <summary>
  ///   check if the sep need to be remove from the current group
  /// </summary>
  /// <param name = "currentGroup"></param>
  /// <returns></returns>
  private needToRemoveSeperatorFromCurrGroup(currentGroup: number): boolean {
    let needToRemoveSeperator: boolean = false;
    let itIsLastGroup: boolean = this.itIsLastGroupInToolbar(currentGroup);

    if (itIsLastGroup)
      needToRemoveSeperator = true;
    else {
      let currentGroupCount: number = this.getToolbarGroupCount(currentGroup);
      let menuEntrySep: MenuEntry = this.getToolbarGroupMenuEntrySep(currentGroup);
      if (this.getGroupCount() > 1 && currentGroupCount <= 1 && menuEntrySep !== null)
        needToRemoveSeperator = true;
    }

    return needToRemoveSeperator;
  }

  /// <summary>
  ///   return TRUE if this group is the last group in the toolbar
  /// </summary>
  /// <param name = "groupNumber"></param>
  /// <returns></returns>
  itIsLastGroupInToolbar(groupNumber: number): boolean {
    // get the ToolbarInfo of the last group count
    let toolbarInfoLastGroup: ToolbarInfo = this.getLastGroup();

    // get the ToolbarInfo of the groupNumber
    let toolBarInfoByGroupNumber: ToolbarInfo = this.getToolBarInfoByGroupNumber(groupNumber, false);

    return toolbarInfoLastGroup === toolBarInfoByGroupNumber;
  }

  /// <summary>
  ///   return the toolbar info for group number, if not exist create it
  /// </summary>
  /// <returns></returns>
  private getLastGroup(): ToolbarInfo {
    let toolbarGroupsEnumerator: Array_Enumerator<number> = this._toolbarGroupsCount.Keys;
    let toolbarInfo: ToolbarInfo = null;
    let toolbarInfoLastGorup: ToolbarInfo = null;
    let lastImageGroup: number = -1;

    while (toolbarGroupsEnumerator.MoveNext()) {
      let obj: Object = toolbarGroupsEnumerator.Current;
      toolbarInfo = this._toolbarGroupsCount.get_Item(<number>obj);
      let MenuEntrySep: MenuEntry = toolbarInfo.getMenuEntrySeperator();
      if (MenuEntrySep != null) {
        let currImageGroup: number = MenuEntrySep.ImageGroup;
        if (currImageGroup > lastImageGroup) {
          lastImageGroup = currImageGroup;
          toolbarInfoLastGorup = toolbarInfo;
        }
      }
    }
    return toolbarInfoLastGorup;
  }

  /// <summary>
  ///   This method get a menuEntry for separator
  /// </summary>
  /// <param name = "groupNumber">number of the tool group (0-based)</param>
  getToolbarGroupMenuEntrySep(groupNumber: number): MenuEntry {
    let toolBarInfoByGroupNumber: ToolbarInfo = this.getToolBarInfoByGroupNumber(groupNumber, false);
    return (toolBarInfoByGroupNumber !== null) ? toolBarInfoByGroupNumber.getMenuEntrySeperator() : null;
  }

  /// <summary>
  ///   return the number of the group
  /// </summary>
  /// <returns></returns>
  getGroupCount(): number {
    let groupCount: number = 0;
    let toolbarGroupsEnumerator: Array_Enumerator<number> = this._toolbarGroupsCount.Keys;
    while (toolbarGroupsEnumerator.MoveNext()) {
      let obj: any = toolbarGroupsEnumerator.Current;
      let toolbarInfo: ToolbarInfo = this._toolbarGroupsCount.get_Item(obj);
      let flag: boolean = toolbarInfo !== null && toolbarInfo.getCount() > 0;
      if (flag) {
        groupCount = groupCount + 1;
      }
    }
    return groupCount;
  }

  /// <summary>
  /// Table control is always first on the form
  /// When table is a child of tab, it is created before tab's layers(TabPages) are created.
  /// Computing Tab's children coordinates depends on the TabPages being created
  /// So, we must fix table's location after Tab is created
  /// QCR #289966
  /// </summary>
  fixTableLocation(): void {
    if (this.HasTable()) {
      let mgControlBase: MgControlBase = ((this._tableMgControl.getParent() instanceof MgControlBase) ? <MgControlBase>this._tableMgControl.getParent() : null);

      if (mgControlBase !== null && mgControlBase.isTabControl()) {
        this._tableMgControl.getProp(PropInterface.PROP_TYPE_TOP).RefreshDisplay(true);
        this._tableMgControl.getProp(PropInterface.PROP_TYPE_LEFT).RefreshDisplay(true);
      }
    }
  }

  /// <summary>
  /// this form may have ActiveRowHightlightState
  /// </summary>
  SetActiveHighlightRowState(state: boolean): void {
    if (this.SupportActiveRowHightlightState)
      Commands.addAsync(CommandType.PROP_SET_ACTIVE_ROW_HIGHLIGHT_STATE, this._tableMgControl, state);
  }

  /// <summary>
  ///   create placement layout on the form
  /// </summary>
  createPlacementLayout(): void {
    if (this.IsMDIFrame && this.GetControlsCountExcludingStatusBar() === 0)
      return;

    // get coordinates that were defined on the form originally,
    // i.e. before expression executed

    let rect: MgRectangle = Property.getOrgRect(this);
    if (this._subFormCtrl === null)
      Commands.addAsync(CommandType.CREATE_PLACEMENT_LAYOUT, this, 0, rect.x, rect.y, rect.width, rect.height, false, false);
    else {
      // For frame set form we have fill layout
      if (!this.IsFrameSet) {
        let autoFit: AutoFit = <AutoFit>this._subFormCtrl.getProp(PropInterface.PROP_TYPE_AUTO_FIT).getValueInt();
        if (autoFit === AutoFit.None)
        // if we replace subform with AUTO_FIT_NONE we do placement relatively to subform size
        // if regular case it will just prevent placement
          rect = this._subFormCtrl.getRect();

        Commands.addAsync(CommandType.CREATE_PLACEMENT_LAYOUT, this._subFormCtrl, 0, rect.x, rect.y, rect.width, rect.height, false, false);
      }
    }
  }

  /// <summary>
  ///   return the prev group index if exist
  /// </summary>
  /// <param name = "currGroup"></param>
  /// <returns></returns>
  private getPrevGroup(currGroup: number): number {
    // create a separator for the previous group
    let prevGroup: number = currGroup - 1;

    while (prevGroup >= 0) {
      if (this.getToolBarInfoByGroupNumber(prevGroup, false) !== null)
        break;
      else
        prevGroup--;
    }

    return prevGroup;
  }

  /// <summary>
  ///   return the count of the tool item on the toolbar (not include the separators for the groups)
  /// </summary>
  /// <returns></returns>
  getToolItemCount(): number {
    let num: number = 0;
    let toolbarGroupsEnumerator: Array_Enumerator<number> = this._toolbarGroupsCount.Keys;
    while (toolbarGroupsEnumerator.MoveNext()) {
      let obj: any = toolbarGroupsEnumerator.Current;
      let toolbarInfo: ToolbarInfo = this._toolbarGroupsCount.get_Item(obj);
      num = num + ((toolbarInfo !== null) ? toolbarInfo.getCount() : 0);
    }
    return num;
  }

  /// <summary>
  ///   This method puts the system menus on the form, in case the form does not have the
  ///   menus properties (pulldown \ context) defined.
  /// </summary>
  private inheritSystemMenus(): void {
    let prop: Property = this.getProp(442);
    let contextMenu: number = 0;
    let num: NUM_TYPE = new NUM_TYPE();

    if (prop === null || !prop.isExpression()) {
      if (prop !== null)
        contextMenu = prop.getValueInt();
      // if value is zero, we need to use the system menu definition
      if (contextMenu === 0) {
        contextMenu = this.getSystemContextMenu();
        if (contextMenu > 0) {
          num.NUM_4_LONG(contextMenu);
          this.setProp(PropInterface.PROP_TYPE_CONTEXT_MENU, num.toXMLrecord());
        }
      }
    }
  }

  /// <summary>
  ///   sets the property
  /// </summary>
  /// <param name = "propId"></param>
  /// <param name = "val"></param>
  protected setProp(propId: number, val: string): void {
    if (this._propTab === null)
      this._propTab = new PropTable(this);

    this._propTab.setProp(propId, val, this, GuiConstants.PARENT_TYPE_FORM);
  }

  getControlIdx(ctrl: MgControlBase): number {
    return this.CtrlTab.getControlIdx(ctrl, true);
  }

  /// <summary>
  ///   Add an MgMenu object to the list of the form's menus.
  ///   A form can have an MgMenu which is assigned to it directly (since the menu is set as the form's
  ///   pulldown menu, for example). It also has the context menus of its children - a context menu of
  ///   a control is created under the form and saved in the form's list, and then assigned to the control
  ///   (this to allow re-usability of menus which appear more than once).
  /// </summary>
  /// <param name = "mgMenu">menu to be added to the list</param>
  addMgMenuToList(mgMenu: MgMenu, menuStyle: MenuStyle): void {
    this._instatiatedMenus.set_Item(menuStyle, mgMenu);
  }

  /// <summary>
  ///   create separator on a group
  /// </summary>
  createSepOnGroup(mgMenu: MgMenu, groupNumber: number): void {
    let menuEntry: MenuEntry = new MenuEntry(GuiMenuEntry_MenuType.SEPARATOR, mgMenu);
    menuEntry.setVisible(true, true, true, null, null);
    this.setToolbarGroupMenuEntrySep(groupNumber, menuEntry);
    menuEntry.ImageGroup = groupNumber;
    // create the matching tool
    menuEntry.createMenuEntryTool(this, false);
  }

  /// <summary>
  ///   This method creates a new tool group for the passed group index, and places a separator in its end.
  ///   returns true if the tool group was created now, false if it already existed.
  /// </summary>
  /// <param name = "toolGroup"></param>
  createToolGroup(mgMenu: MgMenu, toolGroup: number): boolean {
    let needToCreateAtTheEnd: boolean = false;
    let toolbarInfo: ToolbarInfo = this.getToolBarInfoByGroupNumber(toolGroup, false);

    if (toolbarInfo === null || toolbarInfo.getCount() === 0) {
      // add the new toolGroup to the hashmap
      // toolbarGroupsCount.put(toolGroup, 0);
      this.setToolbarGroupCount(toolGroup, 0);

      // create a separator for the previous group
      let prevGroup: number = this.getPrevGroup(toolGroup);

      if (prevGroup >= 0) {
        // when there is already sep on the prev group, create the setp on the current group
        if (this.getToolbarGroupMenuEntrySep(prevGroup) !== null)
          needToCreateAtTheEnd = true;
        else
          this.createSepOnGroup(mgMenu, prevGroup);
      }
      else if (this.getToolbarGroupMenuEntrySep(toolGroup) === null)
        needToCreateAtTheEnd = true;
    }

    return needToCreateAtTheEnd;
  }

  /// <summary>
  ///   Loop on all form's controls and refresh the contex menu.
  /// </summary>
  refreshContextMenuForControls(): void {
    let ctrl: MgControlBase = null;
    let prop: Property = null;

    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      ctrl = this.CtrlTab.getCtrl(i);
      prop = ctrl.getProp(PropInterface.PROP_TYPE_CONTEXT_MENU);
      if (prop !== null)
        prop.RefreshDisplay(true);
    }
  }

  /// <summary>
  ///   gets record from gui level
  /// </summary>
  getTopIndexFromGUI(): number {
    let topDisplayLine: number = 0;
    if (this.hasTable())
      topDisplayLine = Commands.getTopIndex(this.getMainControl());
    return topDisplayLine;
  }

  /// <param name = "inheritingControl"></param>
  addControlToInheritingContextControls(inheritingControl: MgControlBase): void {
    if (!this._controlsInheritingContext.Contains(inheritingControl))
      this._controlsInheritingContext.Add(inheritingControl);
  }

  /// <summary>
  ///   compute column width
  ///   needed to work like in online in uom2pix calculations
  /// </summary>
  /// <param name = "layer">columns layer</param>
  /// <returns> column width in pixels</returns>
  computeColumnWidth(layer: number): number {
    let width: number = 0;
    let currentWidth: number = 0;
    for (let i: number = 0; i < layer; i = i + 1) {
      let columnCtrl: MgControlBase = this._tableColumns.get_Item(i);
      let colWidth: number = columnCtrl.getProp(PropInterface.PROP_TYPE_WIDTH).getValueInt();
      width = width + colWidth;
      if (columnCtrl.getLayer() === layer)
        currentWidth = colWidth;
    }
    let tableLeft: number = this._tableMgControl.getProp(21).getValueInt();
    return this.uom2pix(<number>(tableLeft + width), true) - this.uom2pix(<number>(tableLeft + width - currentWidth), true);
  }

  /// <summary>
  ///   get horizontal factor
  /// </summary>
  /// <returns></returns>
  getHorizontalFactor(): number {
    if (this._horizontalFactor === -1)
      this._horizontalFactor = this.getProp(PropInterface.PROP_TYPE_HOR_FAC).getValueInt();

    return this._horizontalFactor;
  }

  /// <summary>
  ///   This method returns the pulldown menu number of the form.
  ///   In case the form does not have a pulldown menu defined, the system pulldown menu is returned
  /// </summary>
  /// <returns></returns>
  getPulldownMenuNumber(): number {
    return (this.GetComputedProperty(PropInterface.PROP_TYPE_PULLDOWN_MENU) !== null) ?
      this.GetComputedProperty(PropInterface.PROP_TYPE_PULLDOWN_MENU).GetComputedValueInteger() : 0;
  }

  /// <summary>
  ///   This method returns the pulldown menu number of the form.
  ///   In case the form does not have a pulldown menu defined, the system pulldown menu is returned
  /// </summary>
  /// <returns></returns>
  setPulldownMenuNumber(idx: number, refresh: boolean): void {
    let num: NUM_TYPE = new NUM_TYPE();

    num.NUM_4_LONG(idx);
    let numString: string = num.toXMLrecord();

    this.setProp(PropInterface.PROP_TYPE_PULLDOWN_MENU, numString);

    if (refresh) {
      this.getProp(PropInterface.PROP_TYPE_PULLDOWN_MENU).RefreshDisplay(true, Int32.MinValue, false);
      if (idx === 0)
        this.toolbarGroupsCountClear();
    }
  }

  /// <summary>
  /// </summary>
  /// <returns> table items count</returns>
  getTableItemsCount(): number {
    return this._tableItemsCount;
  }

  /// <summary>
  ///   get vertical factor
  /// </summary>
  /// <returns></returns>
  getVerticalFactor(): number {
    if (this._verticalFactor === -1)
      this._verticalFactor = this.getProp(PropInterface.PROP_TYPE_VER_FAC).getValueInt();

    return this._verticalFactor;
  }

  /// <param name = "propVal"></param>
  refreshContextMenuOnLinkedControls(propVal: number): void {
    let num: NUM_TYPE = new NUM_TYPE();

    if (this._controlsInheritingContext !== null && this._controlsInheritingContext.Count > 0) {
      num.NUM_4_LONG(propVal);
      let numString: string = num.toXMLrecord();
      let mgControlBase: MgControlBase = null;
      for (let i: number = 0; i < this._controlsInheritingContext.Count; i = i + 1) {
        mgControlBase = this._controlsInheritingContext.get_Item(i);
        mgControlBase.setProp(PropInterface.PROP_TYPE_CONTEXT_MENU, numString);
        mgControlBase.getProp(PropInterface.PROP_TYPE_CONTEXT_MENU).RefreshDisplay(true);
      }
    }
  }

  /// <param name = "inheritingControl"></param>
  removeControlFromInheritingContextControls(inheritingControl: MgControlBase): void {
    if (this._controlsInheritingContext !== null && this._controlsInheritingContext.Contains(inheritingControl))
      this._controlsInheritingContext.Remove(inheritingControl);
  }

  /// <summary>
  ///   remove references to the controls of this form
  /// </summary>
  removeRefsToCtrls(): void {
    for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
      this.CtrlTab.getCtrl(i).removeRefFromField();
    }
  }

  /// <summary>
  ///   build list of table children
  /// </summary>
  buildTableChildren(): void {
    if (this._tableChildren === null) {
      this._tableChildren = new List<MgControlBase>();

      if (this.CtrlTab !== null) {
        let minTabOrder: number = 2147483647;
        let automaticTabbingOrder: boolean = this.isAutomaticTabbingOrder();

        for (let i: number = 0; i < this.CtrlTab.getSize(); i = i + 1) {
          let ctrl: MgControlBase = this.CtrlTab.getCtrl(i);

          if (ctrl.IsRepeatable || ctrl.IsTableHeaderChild) {
            this._tableChildren.Add(ctrl);

            if (automaticTabbingOrder) {
              let prop: Property = ctrl.getProp(PropInterface.PROP_TYPE_TAB_ORDER);

              if (prop !== null) {
                let valueInt: number = prop.getValueInt();
                if (valueInt < minTabOrder)
                  minTabOrder = valueInt;
              }
            }
          }
        }

        if (minTabOrder !== Int32.MaxValue && automaticTabbingOrder) {
          this._firstTableTabOrder = minTabOrder;
        }
      }
    }
  }

  /// <summary>
  ///   compute and send to Gui level original column position :
  ///   x coordinate of were column starts (in RTL - distance between table's right corner and columns right corner
  /// </summary>
  /// <param name = "columnIdx"></param>

  public setColumnOrgPos(columnIdx: number): void {
    let pos: number = 0;
    if (this._tableMgControl.getProp(PropInterface.PROP_TYPE_HEBREW).getValueBoolean()) {
      let logSize: number = 0;
      for (let i: number = this._tableColumns.Count - 1; i >= 0; i--) {
        let mgCtrl: MgControlBase = this._tableColumns[i];
        let width: number = mgCtrl.getOrgWidth();
        if (i > columnIdx)
          pos += width;
        logSize += width;
      }
      let displayWidth: number = Math.max(logSize, this._tableMgControl.getOrgWidth());
      pos = displayWidth - pos;
    }
    else {
      for (let i: number = 0; i < columnIdx; i++) {
        let mgCtrl: MgControlBase = this._tableColumns[i];
        pos += mgCtrl.getOrgWidth();
      }
    }
    pos = this.uom2pix(pos, true);
    Commands.addAsync(CommandType.SET_COLUMN_START_POS, this._tableColumns[columnIdx], 0, pos);
  }

  /// <summary>
  ///
  /// </summary>
  /// <returns></returns>
  public getGuiTableChildren(): List<GuiMgControl> {
    if (this._guiTableChildren == null) {
      this._guiTableChildren = new List<GuiMgControl>();

      for (let i: number = 0; i < this.TableChildren.Count; i = i + 1) {
        let ctrl: MgControlBase = this.TableChildren.get_Item(i);
        this._guiTableChildren.Add(ctrl);
      }
    }
    return this._guiTableChildren;
  }

  // getGuiTableChildren(): List<GuiMgControl> {
  //   let flag: boolean = this._guiTableChildren === null;
  //   if (flag) {
  //     this._guiTableChildren = new List<GuiMgControl>();
  //     let tableChildren: List<MgControlBase> = this.TableChildren;
  //     let enumerator: List_Enumerator<MgControlBase> = tableChildren.GetEnumerator();
  //     try {
  //       while (enumerator.MoveNext()) {
  //         let current: MgControlBase = enumerator.Current;
  //         this._guiTableChildren.Add(current);
  //       }
  //     }
  //     finally {
  //       (<IDisposable>enumerator).Dispose();
  //     }
  //   }
  //   return this._guiTableChildren;
  // }

  /// <summary>
  ///   Sets the table control related to this form
  /// </summary>
  /// <param name = "tableCtrl">the tableCtrl to set</param>
  setTableCtrl(tableCtrl: MgControlBase): void {
    this._tableMgControl = tableCtrl;
  }

  /// <param name = "value">the subFormCtrl to set</param>
  setFrameFormCtrl(value: MgControlBase): void {
    Debug.Assert(this._frameFormCtrl === null && value !== null);
    this._frameFormCtrl = value;
  }

  /// <param name = "value">control to set</param>
  setContainerCtrl(value: MgControlBase): void {
    Debug.Assert(this._containerCtrl === null && value !== null);
    this._containerCtrl = value;
  }

  getCtrlCount(): number {
    return this.CtrlTab.getSize();
  }

  /// <summary>
  /// Gets the size of the controls excluding controls related to StatusBar
  /// </summary>
  /// <returns></returns>
  GetControlsCountExcludingStatusBar(): number {
    return this.CtrlTab.getSize();
  }

  /// <summary>
  ///   copy text property from fromControl to toControl and ,match cursor pos and selection we can't work with
  ///   the GuiInteractive because we need to need to the command type, refresh the text and then do focus on it
  /// </summary>
  /// <param name = "fromControl"></param>
  /// <param name = "toControl"></param>
  private static matchTextData(fromControl: MgControlBase, toControl: MgControlBase): void {
    // 1. Copy the text from fromControl TO toControl.
    toControl.copyValFrom(fromControl);

    // 2. Set ModifiedByUser flag (needed for saving data in the field and ACT_CANCEL confirm dialog)
    toControl.ModifiedByUser = fromControl.ModifiedByUser;

    // 3. set the caret to be on the same char when it was on wideParentControl,
    // and select the same text that was select)
    let mgPoint: MgPoint = Manager.SelectionGet(fromControl);
    Manager.SetMark(toControl, mgPoint.x, mgPoint.y);
  }

  /// <summary>
  ///   Refresh form display if it has a property which is an expression
  /// </summary>
  refreshPropsOnExpression(): void {
    let i: number;
    let size: number = (this._propTab == null ? 0 : this._propTab.getSize());
    let prop: Property;
    let refresh: boolean = false;
    for (i = 0; i < size && !refresh; i++) {
      prop = this._propTab.getProp(i);
      if (prop.isExpression()) {
        refresh = true;
        this.refreshProps();
      }
    }
  }

  /// <summary> Sets DcValId on a Control. </summary>
  /// <param name="ditIdx">0-based index identifying a control.</param>
  /// <param name="refreshControl"> indicates whether to refresh the control or not. </param>
  setDCValIdOnControl(ditIdx: number, dcValId: number, refreshControl: boolean): void {
    let ctrl: MgControlBase = this.getCtrl(ditIdx);
    ctrl.setDcValId(dcValId);
    if (refreshControl) {
      ctrl.RefreshDisplay(false);
    }
  }

  /// <summary>
  ///   init the wide info.
  /// </summary>
  /// <param name = "parentControl"></param>
  initWideinfo(parentControl: MgControlBase): void {
    this._wideParentControl = parentControl;
  }

  /// <summary>
  ///   get the first menu that is enable that belong to the keybordItem
  /// </summary>
  /// <param name = "kbItm"></param>
  /// <param name = "menuStyle"></param>
  /// <returns></returns>
  getMenuEntrybyAccessKey(kbItm: KeyboardItem, menuStyle: MenuStyle): MenuEntry {
    let menuEntry: MenuEntry = null;
    let mgMenu = <MgMenu>this._instatiatedMenus[menuStyle];
    if (mgMenu != null) {
      let menuEntries: List<MenuEntry> = mgMenu.getMenuEntriesWithAccessKey(kbItm);
      if (menuEntries != null && menuEntries.Count > 0)
        for (let i: number = 0; i < menuEntries.Count; i++) {
          let currMenuEntry: MenuEntry = menuEntries[i];
          if (currMenuEntry.getEnabled()) {
            menuEntry = currMenuEntry;
            break;
          }
        }
    }
    return menuEntry;
  }

  /// <summary>
  ///   get rectangle of the wide to be open (in UOM)
  /// </summary>
  /// <returns> MgRectangle in of the wide related to the desktop in UOM
  ///   in magic :edt_mle.cpp \ pop_drop()
  /// </returns>
  getWideBounds(): MgRectangle {
    let dataLen: number = this._wideParentControl.getPIC().getSize();
    let wideRect = new MgRectangle(0, 0, 0, 0);
    let rect = new MgRectangle(0, 0, 0, 0);
    let parentRect = new MgRectangle(0, 0, 0, 0);
    let x: number, y, dx, dy;
    let parentObject: Object = this;

    // 1. get the bounds of the caller control
    let reletiveTo: Object = this;
    if (this._wideParentControl.getForm().isSubForm())
      reletiveTo = this._wideParentControl.getForm().getSubFormCtrl();
    else if (this.IsFrameSet)
      parentObject = reletiveTo = this.getContainerCtrl();

    Commands.getBoundsRelativeTo(this._wideParentControl, this._wideParentControl.getDisplayLine(true), rect, reletiveTo);

    // 2. get the bounds of the form
    if (this._wideParentControl.getForm().isSubForm())
      parentObject = this._wideParentControl.getForm().getSubFormCtrl();

    Commands.getClientBounds(parentObject, parentRect, false);

    // Get the font of the parent control
    let parentCtrlFontSize: MgPointF;
    let fontId: number = this._wideParentControl.getProp(PropInterface.PROP_TYPE_FONT).getValueInt();
    let mgFont: MgFont = Manager.GetFontsTable().getFont(fontId);

    // get the parent control font size
    parentCtrlFontSize = Commands.getFontMetrics(mgFont, this);

    // 3. Compute width & height of popup window
    // check the characters to be display on one line, max 60 chars and min 5 chars
    let Characters: number = Math.max(5, <number>Math.min(60, (parentRect.width - 2) / parentCtrlFontSize.x));
    dx = <number>(Characters * parentCtrlFontSize.x);

    // 4. Compute horizontal position of child
    x = rect.x - 5 - 1;
    if (x + dx > parentRect.width)
      x = Math.max(0, parentRect.width - dx - 10);

    x = Math.max(x, 0);

    dy = (dataLen / Characters) + 1;
    dy = <number>((dy * parentCtrlFontSize.y) + 6 + 2 + 2); // add 2 for large font in english window (ehud ?? )

    // 5. Compute vertical position of child
    if (rect.y + dy > parentRect.height) {
      // If the Wide window cannot be accomodated below the parent control
      // within the parent window, show it above the parent control
      y = Math.max(0, rect.y - dy);
    }
    else y = rect.y + rect.height;
    y = Math.max(y, 0);

    // 6. If the height of wide window is bigger than the parent's height
    //    the wide window will be clipped in its bottom.  It happens in URL dialog.
    if (y === 0 && parentRect.height < dy)
      dy -= <number>((dy - parentRect.height + parentCtrlFontSize.y - 1) / parentCtrlFontSize.y * parentCtrlFontSize.y);

    // 7. calculate the rect into UOM : according to the form of the wide
    wideRect.x = this._wideParentControl.getForm().pix2uom(x, true);
    wideRect.y = this._wideParentControl.getForm().pix2uom(y, false);
    wideRect.width = this._wideParentControl.getForm().pix2uom(dx, true);
    wideRect.height = this._wideParentControl.getForm().pix2uom(dy, false);
    return (wideRect);
  }

  /// <summary>
  ///   create the wide control, according to the send rect wide
  /// </summary>
  /// <param name = "rectWide"></param>
  createWideControl(rectWide: MgRectangle): void {
    let wideParentControlIndex: number = this.getWideParentControlIndex(this._wideParentControl);
    this._wideControl = this.ConstructMgControl(MgControlType.CTRL_TYPE_TEXT, this._wideParentControl.getForm().getTask(), wideParentControlIndex);
    this.CtrlTab.addControl(this._wideControl);
    this._wideControl.setWideProperties(this._wideParentControl.getForm(), this._wideParentControl, rectWide);
  }

  /// <summary>
  ///   get the parent control index of the wide control
  /// </summary>
  /// <param name = "wideParentControl"></param>
  /// <returns></returns>
  private getWideParentControlIndex(wideParentControl: MgControlBase): number {
    let parentControlIdx: number = -1;
    let parentMgControl: MgControlBase = null;
    // while we on frame set and it and the wideParentControl isn't subform, it mean the control is on Frame Form
    // we need to create the control under the FrameFormControl
    if (this.IsFrameSet && !wideParentControl.getForm().isSubForm()) {
      parentMgControl = this.getContainerCtrl();
      parentControlIdx = parentMgControl.getDitIdx();
    }
    return parentControlIdx;
  }

  /// <summary>
  /// Close internal Help.
  /// </summary>
  CloseInternalHelp(): void {
    // Closing the internal help window.
    if (this._internalHelpWindow !== null) {
      Commands.addAsync(CommandType.CLOSE_FORM, this._internalHelpWindow);
      Commands.beginInvoke();
      this._internalHelpWindow = null;
    }
  }

  /// <summary>
  /// show internal help in a self created form.
  /// </summary>
  /// <param name="hlpObject">Help object containing help details</param>
  ShowInternalHelp(hlpObject: MagicHelp): void {
    this._internalHelpWindow = null;
    let helpWindowType: WindowType;
    let num = new NUM_TYPE();

    // Get help object.
    let internalHelpObj: InternalHelp = <InternalHelp>hlpObject;

    // Constructing help window.
    let alreadySetParentForm: boolean = false;
    let refAlreadySetParentForm: RefParam<boolean> = new RefParam(alreadySetParentForm);
    this._internalHelpWindow = this.getTask().ConstructMgForm(refAlreadySetParentForm);
    this._internalHelpWindow.IsHelpWindow = true;
    this._internalHelpWindow.Opened = true;
    this._internalHelpWindow.ParentForm = this.getTask().getTopMostForm();

    // Creating edit box.
    let txtCtrl: MgControlBase = this._internalHelpWindow.ConstructMgControl(MgControlType.CTRL_TYPE_TEXT, this._internalHelpWindow, -1);

    // Add control to parent form control table.
    this._internalHelpWindow.CtrlTab.addControl(txtCtrl);

    // Setting the properties of internal help window.
    num.NUM_4_LONG(internalHelpObj.FactorX);
    this._internalHelpWindow.setProp(PropInterface.PROP_TYPE_HOR_FAC, num.toXMLrecord());
    num.NUM_4_LONG(internalHelpObj.FactorY);
    this._internalHelpWindow.setProp(PropInterface.PROP_TYPE_VER_FAC, num.toXMLrecord());
    num.NUM_4_LONG(internalHelpObj.FontTableIndex);
    this._internalHelpWindow.setProp(PropInterface.PROP_TYPE_FONT, num.toXMLrecord());
    num.NUM_4_LONG(<number>WindowType.Default);
    this._internalHelpWindow.setProp(PropInterface.PROP_TYPE_WINDOW_TYPE, num.toXMLrecord());

    // Instead of Deriving Window type from parent window,  Set window type for Internal help as Floating.
    // so that there should not be any focussing issues for help window if the parent window is MDI frame.
    helpWindowType = WindowType.Floating;

    // If MDI is enabled then set the parent window accordingly.
    let parentForm = (this.IsMDIChild ? Manager.GetCurrentRuntimeContext().FrameForm : this.getTask().getTopMostForm());

    // GUI commands for creating the internal help window.
    Commands.addAsync(CommandType.CREATE_FORM, parentForm, this._internalHelpWindow, helpWindowType, internalHelpObj.Name, true, false, false);

    // Before setting the bounds, change the startup position to customized.
    Commands.addAsync(CommandType.PROP_SET_STARTUP_POSITION, this._internalHelpWindow, 0, WindowPosition.Customized);
    Commands.addAsync(CommandType.PROP_SET_BOUNDS, this._internalHelpWindow, 0, this._internalHelpWindow.uom2pix(internalHelpObj.FrameX, true), this._internalHelpWindow.uom2pix(internalHelpObj.FrameY, false), this._internalHelpWindow.uom2pix(internalHelpObj.SizedX, true), this._internalHelpWindow.uom2pix(internalHelpObj.SizedY, false), false, false);


    Commands.addAsync(CommandType.PROP_SET_TEXT, this._internalHelpWindow, 0, internalHelpObj.Name, 0);
    // #932179: Set titlebar
    Commands.addAsync(CommandType.PROP_SET_TITLE_BAR, <Object>this._internalHelpWindow, internalHelpObj.TitleBar === 1);
    // Set the system menu.
    Commands.addAsync(CommandType.PROP_SET_SYSTEM_MENU, <Object>this._internalHelpWindow, internalHelpObj.SystemMenu === 1);


    Commands.addAsync(CommandType.PROP_SET_MAXBOX, <Object>this._internalHelpWindow, false);
    Commands.addAsync(CommandType.PROP_SET_MINBOX, <Object>this._internalHelpWindow, false);

    Commands.addAsync(CommandType.PROP_SET_ICON_FILE_NAME, this._internalHelpWindow, 0, "@Mgxpa", 0);

    // Open the form.
    Commands.addAsync(CommandType.INITIAL_FORM_LAYOUT, <Object>this._internalHelpWindow, false, internalHelpObj.Name);
    Commands.addAsync(CommandType.SHOW_FORM, <Object>this._internalHelpWindow, false, true, internalHelpObj.Name);

    // Creating edit control for showing help text.We are creating an edit control so that we can show large help strings with scrolling
    // and also we can set the focus on the edit control, so that user can copy\paste the help text.
    // The edit control will NOT be logical control (forceWindowControl = true) since there is only one control in help window, there is no
    // point in creating logical control.
    Commands.addAsync(CommandType.CREATE_EDIT, <Object>this._internalHelpWindow, txtCtrl, 0, 0, null, null, 0, false, true,
      0, null, 0, null, true, DockingStyle.FILL);
    Commands.addAsync(CommandType.PROP_SET_BOUNDS, txtCtrl, 0, 0, 0, this._internalHelpWindow.uom2pix(internalHelpObj.SizedX, true), this._internalHelpWindow.uom2pix(internalHelpObj.SizedY, false), false, false);
    Commands.addAsync(CommandType.PROP_SET_READ_ONLY, <Object>txtCtrl, true);
    Commands.addAsync(CommandType.PROP_SET_VISIBLE, <Object>txtCtrl, true);
    Commands.addAsync(CommandType.PROP_SET_MULTILINE, <Object>txtCtrl, true);

    // Get the font info.
    let hlpTxtFont: MgFont = Manager.GetFontsTable().getFont(internalHelpObj.FontTableIndex);
    Commands.addAsync(CommandType.PROP_SET_FONT, <Object>txtCtrl, 0, hlpTxtFont, internalHelpObj.FontTableIndex);
    Commands.addAsync(CommandType.SET_FOCUS, <Object>txtCtrl);
    Commands.addAsync(CommandType.PROP_SET_TEXT, <Object>txtCtrl, 0, internalHelpObj.val, 0);
    Commands.beginInvoke();
  }

  /// <summary> Suspend form layout </summary>
  SuspendLayout(): void {
    Commands.addAsync(CommandType.SUSPEND_LAYOUT, this.getTopMostForm());
  }

  /// <summary> Resume form layout </summary>
  ResumeLayout(): void {
    Commands.addAsync(CommandType.RESUME_LAYOUT, this.getTopMostForm());
  }

  /// <summary>
  ///   find tab control for performing CTRL+TAB && CTRL+SHIFT+TAB actions
  ///   the code original is in RT::skip_to_tab_control
  /// </summary>
  /// <param name = "ctrl">current control</param>
  /// <returns></returns>
  getTabControl(ctrl: MgControlBase): MgControlBase {
    let obj: Object;
    let result: MgControlBase = null;

    obj = ctrl;
    while (obj instanceof MgControlBase) {
      let currCtrl = <MgControlBase>obj;
      if (currCtrl.isTabControl()) {
        result = currCtrl;
        break;
      }
      obj = currCtrl.getParent();
    }

    // if ctrl is not tab and not tab's child - find first tab in the form
    if (result == null) {
      for (let i: number = 0; i < this.CtrlTab.getSize(); i++) {
        obj = this.CtrlTab.getCtrl(i);
        if ((<MgControlBase>obj).isTabControl()) {
          result = <MgControlBase>obj;
          break;
        }
      }
    }
    return result;
  }

  /// <returns> if there is browser control on the form</returns>
  hasBrowserControl(): boolean {
    let hasBrowserCtrl: boolean = false;
    let ctrl: MgControlBase;
    for (let i: number = 0; i < this.CtrlTab.getSize() && !hasBrowserCtrl; i++) {
      ctrl = this.CtrlTab.getCtrl(i);
      if (ctrl.isBrowserControl())
        hasBrowserCtrl = true;
    }

    return hasBrowserCtrl;
  }

  /// <summary> Returns the startup position </summary>
  /// <returns>WindowPosition - startup position</returns>
  GetStartupPosition(): WindowPosition {
    let startupPos: WindowPosition = WindowPosition.Customized;

    if (this._propTab != null) {
      let prop: Property = this._propTab.getPropById(PropInterface.PROP_TYPE_STARTUP_POSITION);
      if (prop != null)
        startupPos = <WindowPosition>prop.getValueInt();

      // for mdichild and WIN_POS_CENTERED_TO_PARENT it is handled in startupPosition()
      switch (startupPos) {
        case WindowPosition.DefaultBounds:
          if (this.ConcreteWindowType === WindowType.ChildWindow)
            startupPos = WindowPosition.Customized;
          break;
        case WindowPosition.CenteredToMagic:
          if (Manager.GetCurrentRuntimeContext().FrameForm == null)
            startupPos = WindowPosition.CenteredToParent;
          if (this.ParentForm === null)
            startupPos = WindowPosition.CenteredToDesktop;
          break;
        case WindowPosition.CenteredToParent:
          if (this.ParentForm === null)
            startupPos = WindowPosition.CenteredToDesktop;
          break;
      }
    }
    return startupPos;
  }

  /// <summary> Applies the placement to the specified child form, if the
  /// current form's dimensions has changed. </summary>
  /// <param name="childForm"></param>
  ApplyChildWindowPlacement(childForm: MgFormBase): void {
    if (childForm.IsChildWindow) {
      let orgRectangle: MgRectangle = Property.getOrgRect(this);
      let currentRectangle: MgRectangle = new MgRectangle();
      let parentObj: Object = this;

      if (this.isSubForm())
        parentObj = this.getSubFormCtrl();

      Commands.getClientBounds(parentObj, currentRectangle, true);

      let sizeDifference: MgPoint = currentRectangle.GetSizeDifferenceFrom(orgRectangle);

      if (sizeDifference.x !== 0 || sizeDifference.y !== 0)
        Commands.addAsync(CommandType.APPLY_CHILD_WINDOW_PLACEMENT, childForm, 0, sizeDifference.x, sizeDifference.y);
    }
  }

  /// <summary>
  /// Set the toolbar
  /// </summary>
  SetToolBar(): void {
    Debug.Assert(this.IsMDIFrame);
    if (this.ShouldCreateToolbar && this._toolbarGroupsCount.Count > 0) {
      let pullDownMenu: MgMenu = this.getPulldownMenu();
      if (pullDownMenu != null) {
        Commands.addAsync(CommandType.SET_TOOLBAR, this, pullDownMenu.createAndGetToolbar(this));
        Commands.beginInvoke();
      }
    }
  }

  /// <summary>
  /// constructs an object of MgControl
  /// </summary>
  /// <param name="addToMap"></param>
  /// <returns></returns>
  abstract ConstructMgControl(): MgControlBase;

  /// <summary>
  /// constructs an object of MgControl
  /// </summary>
  /// <param name="type"></param>
  /// <param name="task"></param>
  /// <param name="parentControl"></param>
  /// <returns></returns>
  abstract ConstructMgControl(type: MgControlType, task: TaskBase, parentControl: number): MgControlBase;

  /// <summary>
  /// constructs an object of MgControl
  /// </summary>
  /// <param name="type"></param>
  /// <param name="parentMgForm">Parent form</param>
  /// <param name="parentControl">Parent control IDX</param>
  /// <returns>mg control</returns>
  abstract ConstructMgControl(type: MgControlType, parentMgForm: MgFormBase, parentControlIdx: number): MgControlBase;
  abstract ConstructMgControl(type?: MgControlType, taskOrParentMgForm?: any, parentControlOrParentControlIdx?: number): MgControlBase;

  /// <summary>
  ///   build the controls tabbing order of this form
  /// </summary>
  buildTabbingOrder(): void {
  }

  /// <summary>
  ///
  /// </summary>
  UpdateHiddenControlsList(): void {
  }

  /// <summary>
  ///   close the wide and return the focus to the caller control FI : we can't call this from the ShellLisiner
  ///   !!!, (Due this method is send command type(text,focus, select text...) to the guiCommandQueue, the task
  ///   is close and the runnable is ger to the implements methode(Se text) on object that isn't exist any more
  ///   (it was closed) and the data MUST update the caller control.
  /// </summary>
  closeWide(): void {
    if (this.wideIsOpen()) {
      // 1. Copy the text to the parent control
      MgFormBase.matchTextData(this._wideControl, this._wideParentControl);
      this._wideControl.InControl = false;
      this._wideControl.ClipBoardDataExists = false;
      Manager.SetFocus(this._wideParentControl, -1);

      // 2. restore the the field parent control
      this._wideControl.removeRefFromField();
      this._wideParentControl.setField(this._wideControl.getField());
      this._wideParentControl.setControlToFocus();

      // 3. return the focus to the parent control
      this._wideParentControl.getForm().getTask().setLastParkedCtrl(this._wideParentControl);

      // 4. remove wide control from the form
      this.removeWideControl();

      // 7. execute the commands
      Commands.beginInvoke();
    }
  }

  /// <summary>
  ///   refresh table first time we enter the ownerTask
  ///   get rows number form gui level
  /// </summary>
  firstTableRefresh(): void {
    if (this._tableMgControl !== null) {
      this._rowsInPage = Commands.getRowsInPage(this._tableMgControl);
      this.RefreshRepeatableAllowed = true;
    }
  }

  /// <summary>
  ///   create a wide form & control
  /// </summary>
  /// <param name = "parentControl">: the control that call the wide</param>
  public openWide(parentControl: MgControlBase): void {
    // 1. init data for the wide
    this.initWideinfo(parentControl);

    // 2. calculate the wide window rect
    let wideBounds: MgRectangle = this.getWideBounds();

    // 3. create the wide control
    this.createWideControl(wideBounds);

    // 4. set the focus to the wide control
    parentControl.getForm().getTask().setLastParkedCtrl(this._wideControl);

    // 6. refresh wide control properties & wide form properties
    this._wideControl.RefreshDisplay();

    // 7. set text for the wide control from the parent control
    // we can't call wideParentControl.getValue(), because when user press chars and then wide action, the
    // data isn't saved into the field yet so we work on control
    MgFormBase.matchTextData(this._wideParentControl, this._wideControl);
    Manager.SetFocus(this._wideControl, -1);
    this._wideControl.InControl = true;

    // 8. set the wide control to be top
    Commands.addAsync(CommandType.MOVE_ABOVE, this._wideControl);

    // 9. execute the commands type
    Commands.beginInvoke();
  }

  /// <summary>
  ///   update table item's count according to parameter size
  /// </summary>
  /// <param name = "size">new size</param>
  /// <param name = "removeAll">remove all elements form the table including first and last dummy elements</param>
  SetTableItemsCount(size: number, removeAll: boolean): void {
    this.InitTableControl(size, removeAll);
  }

  InitTableControl(): void;
  InitTableControl(size: number, removeAll: boolean): void;
  InitTableControl(size?: number, removeAll?: boolean): void {
    if (arguments.length === 0) {
      this.InitTableControl_0();
      return;
    }
    this.InitTableControl_1(size, removeAll);
  }

  /// <summary>
  /// inits the table control
  /// </summary>
  private InitTableControl_0(): void {
    this.InitTableControl(1, false);
  }

  /// <summary>
  ///   update table item's count according to parameter size
  /// </summary>
  /// <param name = "size">new size</param>
  /// <param name = "removeAll">remove all elements form the table including first and last dummy elements</param>
  private InitTableControl_1(size: number, removeAll: boolean): void {
    if (this._tableMgControl != null) {
      Commands.addAsync(CommandType.SET_TABLE_ITEMS_COUNT, this._tableMgControl, 0, size);
      this._tableItemsCount = size;
      this.Rows.SetSize(size);
      this._prevTopIndex = -2;
      this._prevSelIndex = -2;
      this.UpdateTableChildrenArraysSize(size);
    }
  }

  /// <summary>
  /// update arrays of table children controls
  /// </summary>
  /// <param name="size"></param>
  UpdateTableChildrenArraysSize(size: number): void {
    let children: List<MgControlBase> = this.TableChildren;
    if (children != null) {
      for (let i: number = 0; i < children.Count; i++) {
        let control: MgControlBase = children[i];
        control.updateArrays(size);
      }
    }
    if (this._tableMgControl != null)
      this._tableMgControl.updateArrays(size);
  }

  /// <summary>
  /// saves the userstate of the form
  /// </summary>
  SaveUserState(): void {
  }

  /// <summary>
  /// Get the appropriate window type for a Default window type.
  /// </summary>
  /// <param name="windowType"></param>
  /// <returns></returns>
  static GetConcreteWindowTypeForMDIChild(isFitToMdi: boolean): WindowType {
    if (isFitToMdi)
      return WindowType.FitToMdi;
    else
      return WindowType.Default;
  }

  /// <summary>
  /// For online we need to pit 'ACT_HIT' when the form was closed from system menu
  /// if the task has only subform control on it.
  /// For RC always return false
  /// </summary>
  /// <returns></returns>
  static ShouldPutActOnFormClose(): boolean {
    return false;
  }

  /// <summary>
  /// refresh property with expression
  /// </summary>
  /// <param name="propId"></param>
  RefreshPropertyByExpression(propId: number): void {
    if (this.PropertyHasExpression(propId))
      this.getProp(propId).RefreshDisplay(true);
  }

  /// <summary>
  /// Returns the parent form.
  /// </summary>
  /// <returns></returns>
  GetParentForm(): any {
    let parentControl: MgControlBase = null;
    let parentForm: MgFormBase = this.ParentForm;

    if (parentForm != null) {
      // for a subform the parent control must be the subform control
      if (parentForm.isSubForm())
        parentControl = parentForm.getSubFormCtrl();
      // for a form frame the parent control must be its container.
      // it is important for a child window task that is opened from a form frame parent task.
      else if (parentForm.getContainerCtrl() != null)
        parentControl = parentForm.getContainerCtrl();
    }

    return (parentControl != null ? <Object>parentControl : <Object>parentForm);
  }

  static IsFormTag(tagName: string): boolean {
    return tagName === XMLConstants.MG_TAG_FORM || tagName === XMLConstants.MG_TAG_FORM_PROPERTIES;
  }

  static IsEndFormTag(tagName: string): boolean {
    return tagName === ("/" + XMLConstants.MG_TAG_FORM) || tagName === ("/" + XMLConstants.MG_TAG_FORM_PROPERTIES);
  }

  ToString(): string {
    return NString.Concat([
      "{GuiMgForm", ": Id=", this._userStateId, "}"
    ]);
  }

  private static IsControlChildOfFrameForm(control: MgControlBase): boolean {
    let isControlChildOfFrameForm: boolean = false;

    let parent: MgControlBase = <MgControlBase>(control.getParent());
    if (parent != null && parent.isContainerControl())
      isControlChildOfFrameForm = true;

    return isControlChildOfFrameForm;
  }

  /// <summary>
  /// should the control be included in the recalculation of the tab order
  /// </summary>
  /// <param name="control"></param>
  /// <returns></returns>
  IncludeControlInTabbingOrder(control: MgControlBase, includeControlChildOfFrameForm: boolean): boolean {
    if (!control.PropertyExists(PropInterface.PROP_TYPE_TAB_ORDER))
      return false;

    // if the frame does not allow parking
    if (this._frameFormCtrl !== null && this._frameFormCtrl.PropertyExists(PropInterface.PROP_TYPE_ALLOW_PARKING) &&
      this._frameFormCtrl.GetComputedBooleanProperty(PropInterface.PROP_TYPE_ALLOW_PARKING, true) === false)
      return false;

    if (!includeControlChildOfFrameForm) {
      if (MgFormBase.IsControlChildOfFrameForm(control))
        return false;
    }
    return true;
  }

  /// <summary>
  /// should the control be included in the recalculation of the tab order
  /// </summary>
  /// <param name="control"></param>
  /// <returns></returns>
  OnlyFrameFormChild(control: MgControlBase): boolean {
    if (!control.PropertyExists(PropInterface.PROP_TYPE_TAB_ORDER))
      return false;

    // if the frame does not allow parking
    if (this._frameFormCtrl != null && this._frameFormCtrl.PropertyExists(PropInterface.PROP_TYPE_ALLOW_PARKING) &&
      this._frameFormCtrl.GetComputedBooleanProperty(PropInterface.PROP_TYPE_ALLOW_PARKING, true) === false)
      return false;

    return MgFormBase.IsControlChildOfFrameForm(control);

  }

  /// <summary>
  /// force all MgControls to update the font used on the controls
  /// </summary>
  UpdateFontValues(): void {
    let control: MgControlBase;
    let prop: Property;
    for (let i: number = 0; i < this.CtrlTab.getSize(); i++) {
      control = this.CtrlTab.getCtrl(i);
      if (control.PropertyExists(PropInterface.PROP_TYPE_FONT)) {
        prop = control.getProp(PropInterface.PROP_TYPE_FONT);
        prop.RefreshDisplay(true);
      }
      if (control.Type === MgControlType.CTRL_TYPE_SUBFORM) {
        let subform: MgFormBase = control.GetSubformMgForm();
        subform.UpdateFontValues();
      }
    }
    if (this.HasTable())
      Commands.addAsync(CommandType.RECALCULATE_TABLE_FONTS, this._tableMgControl);
    prop = this.getProp(PropInterface.PROP_TYPE_FONT);
    prop.RefreshDisplay(true);
    Commands.beginInvoke();
  }

  /// <summary>
  /// force all MgControls to update the colors used on the controls
  /// </summary>
  UpdateColorValues(): void {
    let control: MgControlBase;
    let prop: Property;

    // update colors on controls
    for (let i: number = 0; i < this.CtrlTab.getSize(); i++) {
      control = this.CtrlTab.getCtrl(i);

      ColorProperties.forEach(function (propId) {
        if (control.PropertyExists(propId)) {
          prop = control.getProp(propId);
          prop.RefreshDisplay(true);
        }
      });
      if (control.Type === MgControlType.CTRL_TYPE_SUBFORM) {
        // update colors on controls on subform
        let subform: MgFormBase = control.GetSubformMgForm();
        subform.UpdateColorValues();
      }
    }
    // update colors on  table
    if (this.HasTable())
      Commands.addAsync(CommandType.RECALCULATE_TABLE_COLORS, this._tableMgControl);

    // update colors on this form
    prop = this.getProp(PropInterface.PROP_TYPE_COLOR);
    prop.RefreshDisplay(true);
    Commands.beginInvoke();
  }
}
/// <summary>
///   class describing row
/// </summary>
/// <author>rinav</author>
export class Row {
  Created: boolean = false;     // is row created on gui level
  Validated: boolean = false;   // is row Validated

  constructor();
  constructor(created: boolean, validated: boolean);
  constructor(created?: boolean, validated?: boolean) {
    if (arguments.length === 0) {
      this.constructor_0();
      return;
    }
    this.constructor_1(created, validated);
  }

  private constructor_0(): void {
    this.Validated = true;
  }

  private constructor_1(created: boolean, validated: boolean): void {
    this.Created = created;
    this.Validated = validated;
  }
}
