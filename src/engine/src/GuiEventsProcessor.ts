import {List, NNumber} from "@magic/mscorelib";
import {Logger, MgControlType, StorageAttribute, Misc, InternalInterface, CtrlButtonTypeGui, ForceExit} from "@magic/utils";
import {EventsProcessor, Events, ITask, MgControlBase, GuiMgForm, GuiMgControl, BlobType, MgTimer,
  LastFocusedVal, Modifiers, MenuEntryProgram, MenuEntryEvent, MenuEntryOSCommand, RuntimeContextBase, Manager, MgFormBase,
  PropInterface, ExpVal
} from "@magic/gui";
import {ClientManager} from "./ClientManager";
import {GUIManager} from "./GUIManager";
import {MgControl} from "./gui/MgControl";
import {RunTimeEvent} from "./event/RunTimeEvent";
import {ArgumentsList} from "./rt/ArgumentsList";
import {MgForm} from "./gui/MgForm";
import {MGData} from "./tasks/MGData";
import {RCTimer} from "./tasks/RCTimer";
import {MGDataCollection} from "./tasks/MGDataCollection";
import {Task} from "./tasks/Task";
import {MenuManager} from "./MenuManager";

export class GuiEventsProcessor extends EventsProcessor {
  RegisterSubclassHandlers(): void {
    Events.FocusEvent = GuiEventsProcessor.processFocus;
    Events.TableReorderEvent = GuiEventsProcessor.processTableReorder;
    Events.MouseUpEvent = GuiEventsProcessor.processMouseUp;
    Events.BrowserStatusTxtChangeEvent = GuiEventsProcessor.processBrowserStatusTxtChangeEvent;
    Events.BrowserExternalEvent = GuiEventsProcessor.processBrowserExternalEvent;
    Events.SelectionEvent = GuiEventsProcessor.processSelection;
    Events.WideEvent = this.processWide;
    Events.DisposeEvent = GuiEventsProcessor.processDispose;
    Events.TimerEvent = GuiEventsProcessor.ProcessTimer;
    Events.TableResizeEvent = GuiEventsProcessor.processTableResize;
    Events.GetRowsDataEvent = GuiEventsProcessor.processGetRowsData;
    Events.EnableCutCopyEvent = GuiEventsProcessor.processEnableCutCopy;
    Events.EnablePasteEvent = GuiEventsProcessor.processEnablePaste;
    Events.NonParkableLastParkedCtrlEvent = GuiEventsProcessor.OnNonParkableLastParkedCtrl;
    Events.ShowSessionStatisticsEvent = GuiEventsProcessor.ShowSessionStatistics;
    Events.RefreshTablesEvent = ClientManager.Instance.EventsManager.refreshTables;

    Events.MenuProgramSelectionEvent = GuiEventsProcessor.OnMenuProgramSelection;
    Events.MenuEventSelectionEvent = GuiEventsProcessor.OnMenuEventSelection;
    Events.MenuOSCommandSelectionEvent = GuiEventsProcessor.OnMenuOSCommandSelection;
    Events.BeforeContextMenuEvent = GuiEventsProcessor.OnBeforeContextMenu;
    Events.OnOpenContextMenuEvent = GuiEventsProcessor.AddOpenContextMenuEvent;

    Events.WriteExceptionToLogEvent = Logger.Instance.WriteExceptionToLog;
    Events.WriteErrorToLogEvent = Logger.Instance.WriteErrorToLog;
    Events.WriteWarningToLogEvent = Logger.Instance.WriteWarningToLog;
    Events.ShouldLogEvent = Logger.Instance.ShouldLog;
    Events.WriteGuiToLogEvent = Logger.Instance.WriteGuiToLog;
    Events.WriteDevToLogEvent = Logger.Instance.WriteDevToLog;

    Events.TranslateEvent = ClientManager.Instance.getLanguageData().translate;
    Events.CloseTasksOnParentActivateEvent = ClientManager.Instance.getEnvironment().CloseTasksOnParentActivate;
    Events.InIncrementalLocateEvent = ClientManager.Instance.InIncrementalLocate;
    Events.PeekEndOfWorkEvent = GuiEventsProcessor.peekEndOfWork;

    Events.TranslateLogicalNameEvent = ClientManager.Instance.getEnvParamsTable().translate;
    Events.GetMainProgramEvent = GuiEventsProcessor.getMainProgram;
    Events.GetMessageStringEvent = ClientManager.Instance.getMessageString;

    Events.CtrlFocusEvent = GuiEventsProcessor.processCtrlFocus;
    Events.GetCurrentTaskEvent = ClientManager.Instance.getCurrTask;
    Events.GetRuntimeContextEvent = GuiEventsProcessor.GetRuntimeContext;
    Events.SaveLastClickedCtrlEvent = GuiEventsProcessor.SaveLastClickedControlName;
    Events.SaveLastClickInfoEvent = GuiEventsProcessor.SaveLastClickInfo;
    Events.PressEvent = GuiEventsProcessor.ProcessPress;

    Events.OnIsLogonRTLEvent = GuiEventsProcessor.IsLogonRTL;
    Events.ShouldAddEnterAsKeyEvent = GuiEventsProcessor.ShouldAddEnterAsKeyEvent;

    // events invoked from system's default context menu.
    Events.CutEvent = GuiEventsProcessor.OnCut;
    Events.CopyEvent = GuiEventsProcessor.OnCopy;
    Events.PasteEvent = GuiEventsProcessor.OnPaste;
    Events.ClearEvent = GuiEventsProcessor.OnClear;
    Events.UndoEvent = GuiEventsProcessor.OnUndo;
  }

  /// <summary> CTOR </summary>
  constructor() {
    super();
  }

  /// <summary> </summary>
  /// <param name="iTask"></param>
  /// <param name="mgControl"></param>
  private static processCtrlFocus(iTask: ITask, mgControl: MgControlBase): void {
    GUIManager.setLastFocusedControl(<Task>iTask, mgControl);
  }

  /// <summary>Put ACT_CTRL_FOCUS, ACT_CTRL_HIT and MG_ACT_BEGIN_DROP to Runtime thread.</summary>
  processBeginDrop(guiMgForm: GuiMgForm, guiMgCtrl: GuiMgControl, line: number): void {
    let mgControl: MgControl = <MgControl>guiMgCtrl;

    if (mgControl !== null && mgControl.Type === MgControlType.CTRL_TYPE_TEXT) {
      ClientManager.Instance.EventsManager.addGuiTriggeredEvent(mgControl, line, 2001, false);
    }

    super.processBeginDrop(guiMgForm, guiMgCtrl, line);
  }

  /// <summary>process "focus" event</summary>
  /// <param name = "value">the value of the control</param>
  /// <param name = "line">the line of multiline control</param>
  /// <returns> TRUE if Magic internal rules allow us to perform the focus.
  ///   sometimes, Magic forces us to return to the original control thus FALSE will be returned.
  /// </returns>
  private static processFocus(guiMgCtrl: GuiMgControl, line: number, isProduceClick: boolean, onMultiMark: boolean): void {
    let mgControl: MgControl = <MgControl>guiMgCtrl;
    ClientManager.Instance.EventsManager.addGuiTriggeredEvent(mgControl, line, InternalInterface.MG_ACT_CTRL_FOCUS, isProduceClick);
  }

  /// <summary>process table reorder event</summary>
  ///<param name = "guiMgCtrl"> table control</param>
  /// <param name = "tabOrderList">list of table children ordered by automatic tab order</param>
  private static processTableReorder(guiMgCtrl: GuiMgControl, guiTabOrderList: List<GuiMgControl>): void {
    let mgControl: MgControl = <MgControl>guiMgCtrl;
    let tabOrderList: List<MgControlBase> = new List<MgControlBase>();

    guiTabOrderList.forEach(guiCtrl => {
      tabOrderList.Add(<MgControl>guiCtrl);
    });

    ClientManager.Instance.EventsManager.addGuiTriggeredEvent(mgControl, InternalInterface.MG_ACT_TBL_REORDER, tabOrderList);
  }

  /// <summary>process "click" event</summary>
  ///<param name = "guiMgCtrl">the control</param>
  /// <param name = "line"> the line of the multiline control</param>
  /// <param name = "value">the value of the control</param>
  private static processMouseUp(guiMgCtrl: GuiMgControl, line: number): void {
    let mgControl = <MgControl>guiMgCtrl;
    let rtEvt = new RunTimeEvent(mgControl, line, true);
    let produceClick: boolean = true;

    if (mgControl.Type === MgControlType.CTRL_TYPE_BUTTON && (<CtrlButtonTypeGui>mgControl.getProp(PropInterface.PROP_TYPE_BUTTON_STYLE).getValueInt()) === CtrlButtonTypeGui.Hypertext)
      produceClick = false;

    rtEvt.setProduceClick(produceClick);
    rtEvt.setInternal(InternalInterface.MG_ACT_CTRL_MOUSEUP);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>process browser events</summary>
  /// <param name = "guiMgCtrl">browser control</param>
  /// <param name = "evt">the event code from InternalInterface</param>
  /// <param name = "text">the text of the event</param>
  private static processBrowserEvent(guiMgCtrl: GuiMgControl, evt: number, text: string): void {
    let browserCtrl = <MgControl>guiMgCtrl;
    let rtEvt = new RunTimeEvent(browserCtrl, browserCtrl.getDisplayLine(false), true);
    rtEvt.setInternal(evt);

    let argsList = new Array(1);
    let blobString: string = BlobType.createFromString(text, BlobType.CONTENT_TYPE_UNICODE);
    argsList[0] = new ExpVal(StorageAttribute.BLOB, false, blobString);

    let args = new ArgumentsList(argsList);
    rtEvt.setArgList(args);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  private static processBrowserStatusTxtChangeEvent(guiMgCtrl: GuiMgControl, text: string): void {
    GuiEventsProcessor.processBrowserEvent(guiMgCtrl, InternalInterface.MG_ACT_BROWSER_STS_TEXT_CHANGE, text);
  }

  private static processBrowserExternalEvent(guiMgCtrl: GuiMgControl, text: string): void {
    GuiEventsProcessor.processBrowserEvent(guiMgCtrl, InternalInterface.MG_ACT_EXT_EVENT, text);
  }

  /// <summary>
  ///   Release references to mgData and to the task in order to let the gc to free the memory.
  ///   This code was moved from processClose in order to clean also when the "open window = NO" (non interactive tasks).
  /// </summary>
  /// <param name = "form"></param>
  private static processDispose(guiMgForm: GuiMgForm): void {
    let form = <MgForm>guiMgForm;
    let task = <Task>form.getTask();
    let mgd: MGData = task.getMGData();

    RCTimer.StopAll(mgd);

    if (mgd.IsAborting)
      MGDataCollection.Instance.deleteMGDataTree(mgd.GetId());
  }

  /// <summary>process "timer" event</summary>
  /// <param name = "mgTimer">object of 'MgTimer' class</param>
  private static ProcessTimer(mgTimer: MgTimer): void {
    let mgd: MGData = (<RCTimer>mgTimer).GetMgdata();
    let task = mgd.getFirstTask();

    // MgTimer/RCTimer uses interval in milliseconds but RuntimeEvent uses interval in seconds
    // so convert it to seconds.
    let seconds: number = ((<RCTimer>mgTimer).TimerIntervalMiliSeconds) / 1000;
    let isIdle: boolean = (<RCTimer>mgTimer).IsIdleTimer;

    if (mgd.IsAborting)
      return

    let rtEvt = new RunTimeEvent(task, true);
    rtEvt.setTimer(seconds, mgd.GetId(), isIdle);
    rtEvt.setMainPrgCreator(rtEvt.getTask());

    if (!isIdle)
      rtEvt.setCtrl(<MgControl>task.getLastParkedCtrl());

    rtEvt.setInternal(InternalInterface.MG_ACT_TIMER);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>process Resize of the page, for table controls only</summary>
  /// <param name = "guiMgCtrl"></param>
  /// <param name = "newRowsInPage"></param>
  private static processTableResize(guiMgCtrl: GuiMgControl, newRowsInPage: number): void {
    let mgControl = <MgControl>guiMgCtrl;
    if (mgControl != null) {
      let rtEvt = new RunTimeEvent(mgControl, newRowsInPage, true);
      rtEvt.setInternal(InternalInterface.MG_ACT_RESIZE);
      ClientManager.Instance.EventsManager.addToTail(rtEvt);
    }
  }

    /// <summary>process set data for row</summary>
    ///<param name = "guiMgCtrl">table control</param>
    /// <param name = "sendAll">if true , always send all records</param>
  private static processGetRowsData(guiMgCtrl: GuiMgControl, desiredTopIndex: number, sendAll: boolean, lastFocusedVal: LastFocusedVal): void {
    let mgControl = <MgControl>guiMgCtrl;

    if (mgControl != null && mgControl.Type === MgControlType.CTRL_TYPE_TABLE) {
      let rtEvt = new RunTimeEvent(mgControl, desiredTopIndex, true);
      rtEvt.setInternal(InternalInterface.MG_ACT_ROW_DATA_CURR_PAGE);
      rtEvt.setSendAll(sendAll);
      rtEvt.LastFocusedVal = lastFocusedVal;
      ClientManager.Instance.EventsManager.addToTail(rtEvt);
    }
  }

  /// <summary>triggered by gui. enable/disable a given act list.</summary>
  /// <param name = "guiMgCtrl"></param>
  /// <param name = "actList"></param>
  /// <param name = "enable"></param>
  private static processEnableActs(guiMgCtrl: GuiMgControl, actList: number[], enable: boolean): void {
    let mgControl = <MgControl>guiMgCtrl;
    let rtEvt = new RunTimeEvent(mgControl, true);
    rtEvt.setInternal(enable ? InternalInterface.MG_ACT_ENABLE_EVENTS : InternalInterface.MG_ACT_DISABLE_EVENTS);
    rtEvt.setActEnableList(actList);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>Enable/Disable cut/copy</summary>
  /// <param name = "guiMgCtrl"></param>
  /// <param name = "enable"></param>
  private static processEnableCutCopy(guiMgCtrl: GuiMgControl, enable: boolean): void {
    let mgControl = <MgControl>guiMgCtrl;
    let actCutCopy = new Array(InternalInterface.MG_ACT_CUT, InternalInterface.MG_ACT_CLIP_COPY);
    GuiEventsProcessor.processEnableActs(guiMgCtrl, actCutCopy, enable);
    Manager.MenuManager.refreshMenuActionForTask(mgControl.getForm().getTask());
  }

  /// <summary>Enable/Disable paste.</summary>
  /// <param name = "guiMgCtrl"></param>
  /// <param name = "enable"></param>
  private static processEnablePaste(guiMgCtrl: GuiMgControl, enable: boolean): void {
    let mgControl = <MgControl>guiMgCtrl;

    if (mgControl != null && mgControl.isTextControl() && mgControl.isModifiable()) {
      let actPaste = new Array(InternalInterface.MG_ACT_CLIP_PASTE);
      GuiEventsProcessor.processEnableActs(guiMgCtrl, actPaste, enable);
      Manager.MenuManager.refreshMenuActionForTask(mgControl.getForm().getTask());
    }
  }

  /// <summary>
  /// If current control becomes invisible/disabled/non parkable, then put MG_ACT_TBL_NXTFLD into queue.
  /// </summary>
  /// <param name="ctrl">control whose property is changed.</param>
  private static OnNonParkableLastParkedCtrl(ctrl: GuiMgControl): void {
    let mgControl: MgControlBase = <MgControlBase>ctrl;

    // If task is already in exiting edit state, do not add MG_ACT_TBL_NXTFLD. (Defect 67647)
    if (ClientManager.Instance.EventsManager.getForceExit() !== ForceExit.Editing) {
      let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>mgControl, mgControl.getDisplayLine(false), false);
      rtEvt.setInternal(InternalInterface.MG_ACT_TBL_NXTFLD);

      ClientManager.Instance.EventsManager.addToTail(rtEvt);
    }
  }

  /// <summary>process "selection" event</summary>
  /// <param name = "val">the value of the control </param>
  /// <param name = "guiMgCtrl">the control </param>
  /// <param name = "line"> the line of the multiline control </param>
  /// <param name = "produceClick">TODO </param>
  private static processSelection(val: string, guiMgCtrl: GuiMgControl, line: number, produceClick: boolean): void {
    let mgControl = <MgControl>guiMgCtrl;
    if (mgControl.Type === MgControlType.CTRL_TYPE_BUTTON && mgControl.getForm().getTask().getLastParkedCtrl() !== mgControl)
      produceClick = true;

    let rtEvt = new RunTimeEvent(mgControl, line, true);
    rtEvt.setInternal(InternalInterface.MG_ACT_SELECTION);
    rtEvt.setValue(val);
    rtEvt.setProduceClick(produceClick);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary></summary>
  /// <param name = "guiMgForm"></param>
  /// <param name = "guiMgCtrl"></param>
  /// <param name = "modifier"></param>
  /// <param name = "keyCode"></param>
  /// <param name = "start"></param>
  /// <param name = "end"></param>
  /// <param name = "text"></param>
  /// <param name = "im"></param>
  /// <param name = "isActChar"></param>
  /// <param name = "suggestedValue"></param>
  /// <param name = "dotNetArgs"></param>
  /// <param name = "comboIsDropDown"></param>
  /// <param name="handled">boolean variable event is handled or not.</param>
  /// <returns> true only if we have handled the KeyDown event (otherwise the CLR should handle). If true magic will handle else CLR will handle.</returns>
  processKeyDown(guiMgForm: GuiMgForm, guiMgCtrl: GuiMgControl, modifier: Modifiers,
                 keyCode: number, start: number, end: number, text: string,
                 isActChar: boolean, suggestedValue: string, comboIsDropDown: boolean,
                 handled: boolean): boolean {
    // time of last user action for IDLE function
    ClientManager.Instance.LastActionTime = Misc.getSystemMilliseconds();

    // DOWN or UP invoked on a SELECT/RADIO control
    return super.processKeyDown(guiMgForm, guiMgCtrl, modifier, keyCode, start, end, text, isActChar, suggestedValue, comboIsDropDown, handled);
  }

  processWide(guiMgCtrl: GuiMgControl): void;
  processWide(ctrl: MgControl): void;
  processWide(guiMgCtrlOrCtrl: any): void {
    if (arguments.length === 1 && (guiMgCtrlOrCtrl === null || guiMgCtrlOrCtrl instanceof GuiMgControl)) {
      this.processWide_0(guiMgCtrlOrCtrl);
      return;
    }
    GuiEventsProcessor.processWide_1(guiMgCtrlOrCtrl);
  }

  /// <summary>send wide action to the control</summary>
  /// <param name = "guiMgCtrl"></param>
  private processWide_0(guiMgCtrl: GuiMgControl): void {
    let mgControl: MgControl = <MgControl>guiMgCtrl;
    if (mgControl !== null && !mgControl.isWideControl() && !mgControl.getForm().wideIsOpen())
      this.processWide(mgControl);
  }

  /// <summary>send wide action to the control</summary>
  ///<param name = "guiMgCtrl"></param>
  private static processWide_1(ctrl: MgControl): void {
    ClientManager.Instance.EventsManager.addGuiTriggeredEvent(ctrl, 35, 0);
  }

  /// <summary>
  /// Handles menu selection
  /// </summary>
  /// <param name="contextID">active/target context (irelevant for RC)</param>
  /// <param name="menuEntry"></param>
  /// <param name="activeForm"></param>
  /// <param name="activatedFromMDIFrame"></param>
  private static OnMenuProgramSelection(contextID: number, menuEntryProgram: MenuEntryProgram, activeForm: GuiMgForm, activatedFromMdiFrame: boolean): void {
    MenuManager.onProgramMenuSelection(contextID, menuEntryProgram, <MgForm>activeForm, activatedFromMdiFrame);
  }

  /// <summary>
  /// Handles menu selection
  /// </summary>
  /// <param name="contextID">active/target context (irelevant for RC)</param>
  /// <param name = "menuEntry"></param>
  /// <param name = "activeForm"></param>
  /// <param name = "activatedFromMDIFrame"></param>
  private static OnMenuOSCommandSelection(contextID: number, osCommandMenuEntry: MenuEntryOSCommand, activeForm: GuiMgForm): void {
    MenuManager.onOSMenuSelection(contextID, osCommandMenuEntry, <MgForm>activeForm);
  }

  /// <summary>
  /// Handles menu selection
  /// </summary>
  /// <param name="contextID">active/target context (irelevant for RC)</param>
  /// <param name = "menuEntry"></param>
  /// <param name = "activeForm"></param>
  /// <param name = "activatedFromMDIFrame"></param>
  private static OnMenuEventSelection(contextID: number, menuEntryEvent: MenuEntryEvent, activeForm: GuiMgForm, ctlIdx: number): void {
    MenuManager.onEventMenuSelection(menuEntryEvent, <MgForm>activeForm, ctlIdx);
  }

  /// <summary> This function is called when right click is pressed before opening the context menu. </summary>
  /// <param name = "guiMgControl"></param>
  /// <param name="line"></param>
  /// <returns></returns>
  private static OnBeforeContextMenu(guiMgControl: GuiMgControl, line: number, onMultiMark: boolean): boolean {
    // When right click is pressed on any control, we might need to move focus to that control
    // properly, I mean, we should also execute its CP, etc.
    let focusChanged: boolean = false;

    if (guiMgControl instanceof MgControl) {
      let mgControl = <MgControl>guiMgControl;

      // Click on a subform control is as a click on a form without control
      if (!guiMgControl.isSubform()) {
        ClientManager.Instance.RuntimeCtx.CurrentClickedCtrl = mgControl;
        GuiEventsProcessor.processFocus(guiMgControl, line, false, onMultiMark);
        focusChanged = true;
      }
    }

    return focusChanged;
  }

  /// <summary> Add Open Context Menu event on right click on form.</summary>
  /// <param name = "guiMgControl">control </param>
  /// <param name = "guiMgForm">code of internal event </param>
  /// <param name = "left">code of internal event </param>
  /// <param name = "top">code of internal event </param>
  /// <param name = "line">code of internal event </param>
  private static AddOpenContextMenuEvent(guiMgControl: GuiMgControl, guiMgForm: GuiMgForm, left: number, top: number, line: number): void {
    let ctrl: MgControl = null;
    let task: Task = null;

    if (guiMgControl != null) {
      if (guiMgControl instanceof MgControl) {
        ctrl = <MgControl>guiMgControl;
        if (ctrl.Type === MgControlType.CTRL_TYPE_SUBFORM)
          task = <Task>ctrl.GetSubformMgForm().getTask();
        else task = <Task>(<MgControlBase>guiMgControl).getForm().getTask();
      }
    }
    else
      task = <Task>(<MgFormBase>guiMgForm).getTask();

    // Prepare event for MG_ACT_CONTEXT_MENU to open context menu.
    let rtEvt = new RunTimeEvent(task);
    rtEvt.setInternal(InternalInterface.MG_ACT_CONTEXT_MENU);

    rtEvt.setCtrl(ctrl);
    // Prepare an argument list for left and top co-ordinate.
    let argsList = new Array(3);
    argsList[0] = new ExpVal(StorageAttribute.ALPHA, false, left.toString());
    argsList[1] = new ExpVal(StorageAttribute.ALPHA, false, top.toString());
    argsList[2] = new ExpVal(StorageAttribute.ALPHA, false, line.toString());
    let args = new ArgumentsList(argsList);
    rtEvt.setArgList(args);

    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>peek the value of the "end of work" flag.</summary>
  private static peekEndOfWork(): boolean {
    return ClientManager.Instance.EventsManager.getEndOfWork();
  }

  /// <summary>This method returns Main program for a ctl</summary>
  /// <param name="contextID">active/target context (irelevant for RC)</param>
  /// <param name="ctlIdx"></param>
  /// <returns></returns>
  private static getMainProgram(contextID: number, ctlIdx: number): Task {
    return <Task>MGDataCollection.Instance.GetMainProgByCtlIdx(contextID, ctlIdx);
  }

  /// <summary>
  /// Get the RuntimeContext of ClientManager.
  /// </summary>
  /// <returns></returns>
  private static GetRuntimeContext(contextID: string): RuntimeContextBase {
    return ClientManager.Instance.RuntimeCtx;
  }

  /// <summary>
  /// Saves the last clicked control in a respective RuntimeContextBase.
  /// </summary>
  /// <param name="guiMgControl"></param>
  /// <param name="ctrlName"></param>
  private static SaveLastClickedControlName(guiMgControl: GuiMgControl, ctrlName: string): void {
    ClientManager.Instance.RuntimeCtx.LastClickedCtrlName = ctrlName;
  }

  /// <summary>
  /// Saves the last clicked information.
  /// </summary>
  /// <param name="guiMgForm"></param>
  /// <param name="controlName"></param>
  /// <param name="X"></param>
  /// <param name="Y"></param>
  /// <param name="offsetX"></param>
  /// <param name="offsetY"></param>
  /// <param name="LastClickCoordinatesAreInPixels"></param>
  private static SaveLastClickInfo(guiMgForm: GuiMgForm, controlName: string, X: number, Y: number, offsetX: number, offsetY: number, LastClickCoordinatesAreInPixels: boolean): void {
    ClientManager.Instance.RuntimeCtx.SaveLastClickInfo(controlName, X, Y, offsetX, offsetY, LastClickCoordinatesAreInPixels);
  }

  /// <summary>
  /// Process press event. Move Focus and raise internal press event
  /// </summary>
  /// <param name="guiMgForm"></param>
  /// <param name="guiMgCtrl"></param>
  /// <param name="line"></param>
  private static ProcessPress(guiMgForm: GuiMgForm, guiMgCtrl: GuiMgControl, line: number): void {
    let mgControl: MgControlBase = <MgControlBase>guiMgCtrl;

    // The internal press event is fired if press event is fired on form or subform
    if (mgControl == null)
      Manager.EventsManager.addGuiTriggeredEvent((<MgFormBase>guiMgForm).getTask(), InternalInterface.MG_ACT_HIT);
    else if (mgControl.isSubform())
      mgControl.OnSubformClick();
    else
      Manager.EventsManager.addGuiTriggeredEvent(mgControl, InternalInterface.MG_ACT_CTRL_HIT, line);

    Manager.EventsManager.addGuiTriggeredEvent(mgControl, InternalInterface.MG_ACT_PRESS, line);
  }

  /// <summary>
  /// Should we show logon window RTL or not.
  /// </summary>
  /// <returns></returns>
  private static IsLogonRTL(): boolean {
    return ClientManager.Instance.IsLogonRTL();
  }

  /// <summary>
  /// </summary>
  private static ShowSessionStatistics(): void {
  }

  /// <summary>
  /// In RIA, enter will cause a keyboard event according to the OS.
  /// This is mostly important for default button, where ENTER on any control triggers click event on the button.
  /// </summary>
  /// <returns></returns>
  private static ShouldAddEnterAsKeyEvent(): boolean {
    return false;
  }

  /// <summary>
  /// Handles external event recieved via WM_CUT
  /// </summary>
  /// <param name="guiMgCtrl">ctrl to which this message is received</param>
  private static OnCut(guiMgCtrl: GuiMgControl): void {
    let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>guiMgCtrl, (<MgControl>guiMgCtrl).getDisplayLine(false), true);
    rtEvt.setInternal(InternalInterface.MG_ACT_CUT);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>
  /// Handles external event recieved via WM_COPY
  /// </summary>
  /// <param name="guiMgCtrl">ctrl to which this message is received</param>
  private static OnCopy(guiMgCtrl: GuiMgControl): void {
    let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>guiMgCtrl, (<MgControl>guiMgCtrl).getDisplayLine(false), true);
    rtEvt.setInternal(InternalInterface.MG_ACT_CLIP_COPY);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>
  /// Handles external event recieved via WM_PASTE
  /// </summary>
  /// <param name="guiMgCtrl">ctrl to which this message is received</param>
  private static OnPaste(guiMgCtrl: GuiMgControl): void {
    let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>guiMgCtrl, (<MgControl>guiMgCtrl).getDisplayLine(false), true);
    rtEvt.setInternal(InternalInterface.MG_ACT_CLIP_PASTE);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>
  /// Handles external event recieved via WM_CLEAR
  /// </summary>
  /// <param name="guiMgCtrl">ctrl to which this message is received</param>
  private static OnClear(guiMgCtrl: GuiMgControl): void {
    let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>guiMgCtrl, (<MgControl>guiMgCtrl).getDisplayLine(false), true);
    rtEvt.setInternal(InternalInterface.MG_ACT_EDT_DELCURCH);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }

  /// <summary>
  /// Handles external event recieved via WM_UNDO
  /// </summary>
  /// <param name="guiMgCtrl">ctrl to which this message is received</param>
  private static OnUndo(guiMgCtrl: GuiMgControl): void {
    let rtEvt: RunTimeEvent = new RunTimeEvent(<MgControl>guiMgCtrl, (<MgControl>guiMgCtrl).getDisplayLine(false), true);
    rtEvt.setInternal(InternalInterface.MG_ACT_EDT_UNDO);
    ClientManager.Instance.EventsManager.addToTail(rtEvt);
  }
}
