/// <summary>
/// <summary>
///   Gui command queue
/// </summary>
import {ListboxSelectionMode, MgColor, MgFont, Queue, WindowType} from "@magic/utils";
import {ApplicationException, Debug, Exception, List, SystemSounds, Type} from "@magic/mscorelib";
import {GuiMenuEntry} from "../GuiMenuEntry";
import {CommandType, DockingStyle, MenuStyle} from "../../GuiEnums";
import {GuiMgForm} from "../GuiMgForm";
import {Events} from "../../Events";
import {GuiMgControl} from "../GuiMgControl";
import {GuiMgMenu} from "../GuiMgMenu";
import {MenuReference} from "./MenuReference";
import {ContextIDGuard, Manager} from "../../Manager";
import {GuiConstants} from "../../GuiConstants";

export class GuiCommandQueue {
  private static _instance: GuiCommandQueue = null;

  private _commandsQueue: Queue<GuiCommand>

  /// <summary>
  ///   basis Constructor
  /// </summary>
  constructor() {
    this.init();
  }

  /// <summary>
  ///   end inner class GuiCommand
  /// </summary>
  /// <summary>singleton</summary>
  /// <returns> reference to GuiCommandQueue object</returns>
  static getInstance(): GuiCommandQueue {
    if (GuiCommandQueue._instance === null)
      GuiCommandQueue._instance = new GuiCommandQueue();
    return GuiCommandQueue._instance;
  }

/// <summary>do not allow to clone singleton</summary>
  Clone(): any {
    throw new Exception("CloneNotSupportedException");
  }


  get QueueSize(): number {
    return this._commandsQueue.Size();
  }

  // private _modalShowFormCommandPresentInQueue: boolean = false;

  /// <summary>Constructor</summary>
  init(): void {
    this._commandsQueue = new Queue<GuiCommand>();
  }

  createMenu(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("createMenu - Not Implemented Yet");
  }

  /// <summary>
  ///   CommandType.CREATE_MENU_ITEM Translate the passed gui command to a call to the next method.
  /// </summary>
  createMenuItem(guiCommand: GuiCommand): void;
  createMenuItem(menuEntry: GuiMenuEntry, parentMenu: any, menuStyle: MenuStyle, parentIsMenu: boolean, index: number, form: GuiMgForm): void;
  createMenuItem(guiCommandOrMenuEntry: any, parentMenu?: any, menuStyle?: MenuStyle, parentIsMenu?: boolean, index?: number, form?: GuiMgForm): void {
    if (arguments.length === 1 && (guiCommandOrMenuEntry === null || guiCommandOrMenuEntry instanceof GuiCommand)) {
      this.createMenuItem_0(guiCommandOrMenuEntry);
      return;
    }
    this.createMenuItem_1(guiCommandOrMenuEntry, parentMenu, menuStyle, parentIsMenu, index, form);
  }

  private createMenuItem_0(guiCommand: GuiCommand): void {
  }

  private createMenuItem_1(menuEntry: GuiMenuEntry, parentMenu: any, menuStyle: MenuStyle, parentIsMenu: boolean, index: number, form: GuiMgForm): void {
    Events.WriteExceptionToLog("createMenuItem - Not Implemented Yet");
  }

  SetAllowDrop(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setAllowDrop - Not Implemented Yet");
  }

  SetAllowDrag(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setAllowDrag - Not Implemented Yet");
  }

  SetDataForDrag(guiCommand: GuiCommand): void {
    // We won't get guiCommand.obj when it is called from Expression.
    Events.WriteExceptionToLog("setDataForDrag - Not Implemented Yet");
  }

  PerformDragDrop(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("performDragDrop - Not Implemented Yet");
  }

  RegisterDNControlValueChangedEvent(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("RegisterDNControlValueChangedEvent - Not Implemented Yet");
  }

  /// <summary>
  /// Adds a command to the queue. If there are already enough commands in the queue then
  /// it will wait till the queue is emptied bu Gui thread.
  /// </summary>
  /// <param name="guiCommand"></param>
  private put(guiCommand: GuiCommand): void {
    // const QUEUE_SIZE_THRESHOLD: number = 1200; // a threshold above which commands will not be inserted to the queue until the queue will be empty.
    // const MAX_SLEEP_DURATION: number = 4;// duration, in ms, between checking that the queue is empty.
    //
    // // If worker thread wants to add a command and there are too many commands in the queue pending
    // // to be processed by Gui thread then suspend current thread till the commands are over. If we keep
    // // on adding commands to the queue and Gui thread enters Run(), then sometimes (specially in cases of
    // // batch tasks) Gui thread remains in Run() for a long time and hence it is unable to process user
    // // interactions (as described in QCR#722145)
    // // Before entering the loop confirm that the command is NOT being added by Gui thread itself and Gui
    // // thread is already processing the commands. This is to ensure that the commands will be processed by
    // // Gui thread. If Gui thread is not processing commands, then it will never process it again as it is
    // // the worker thread that invokes Gui thread for processing commands
    // // Also, suspend worker thread from adding new commands to the queue till SHOW_FORM for modal window
    // // is processed. Problem occurs if SHOW_FORM is followed by few more commands and then a call to
    // // GuiInteractive  that depends on the earlier commands. In such cases, GuiInteractive will not process
    // // commands between SHOW_FORM and interactive command because GuiThreadIsAvailableToProcessCommands
    // // was set to false before opening the dialog.
    // if (((this._commandsQueue.Size() > QUEUE_SIZE_THRESHOLD ) || this._modalShowFormCommandPresentInQueue)) {
    //   let sleepDuration: number = MAX_SLEEP_DURATION;
    //   do {
    //     // get current size of the queue and wait for some time
    //     const size: number = this._commandsQueue.Size();
    //     //System.Threading.Thread.Sleep(sleepDuration);
    //     const newSize: number = this._commandsQueue.Size();
    //
    //     // while current thread was sleeping, gui thread should have processed some commands.
    //     // get average duration required by gui thread for processing a command and estimate new duration for remaining commands.
    //     if (size > newSize) {
    //       let averageDurationPerCommand: number = sleepDuration / (size - newSize);
    //       let newSleepDuration: number = <number>(newSize * averageDurationPerCommand);
    //       if (newSleepDuration > 0)
    //         sleepDuration = Math.min(MAX_SLEEP_DURATION, newSleepDuration);
    //     }
    //   }
    //   while (this._commandsQueue.Size() > 0);
    this._commandsQueue.put(guiCommand);

    // if (guiCommand.CommandType === CommandType.REFRESH_TABLE && guiCommand.Bool3) {
    //   let mgControl: MgControlBase = <MgControlBase>(guiCommand.obj);
    //   mgControl.refreshTableCommandCount++;
    // }
    // else if (guiCommand.IsModalShowFormCommand())
    //   this._modalShowFormCommandPresentInQueue = true;
  }


  add(commandType: CommandType): void;
  add(commandType: CommandType, obj: any): void;
  add(commandType: CommandType, obj: any, boolVal: boolean, formName: string): void;
  add(commandType: CommandType, obj: any, boolVal: boolean, isHelpWindow: boolean, formName: string): void;
  add(commandType: CommandType, obj: any, boolVal: boolean): void;
  add(commandType: CommandType, obj: any, obj1: any): void;
  add(commandType: CommandType, parentObject: any, obj: any, layer: number, line: number, style: number): void;
  add(commandType: CommandType, obj: any, line: number, num1: number, num2: number, num3: number): void;
  add(commandType: CommandType, parentObject: any, obj: any, windowType: WindowType, formName: string, isHelpWindow: boolean, createInternalFormForMDI: boolean, shouldBlock: boolean): void;
  add(commandType: CommandType, parentObject: any, obj: any, line: number, style: number, stringList: List<string>, ctrlList: List<GuiMgControl>, columnCount: number, boolVal: boolean, boolVal1: boolean, number1: number, type: Type, number2: number, obj1: any, isParentHelpWindow: boolean, dockingStyle: DockingStyle): void;
  add(commandType: CommandType, parentObject: any, obj: any, line: number, style: number, stringList: List<string>, ctrlList: List<GuiMgControl>, columnCount: number, boolVal: boolean, boolVal1: boolean, number1: number, type: Type, number2: number, obj1: any): void;
  add(commandType: CommandType, obj: any, number: number, boolVal: boolean): void;
  add(commandType: CommandType, obj: any, number: number, boolVal: boolean, executeParentLayout: boolean): void;
  add(commandType: CommandType, obj: any, line: number, x: number, y: number, width: number, height: number, boolVal: boolean, bool1: boolean): void;
  add(commandType: CommandType, obj: any, eventName: string): void;
  add(commandType: CommandType, obj: any, line: number, number: number, prevNumber: number): void;
  add(commandType: CommandType, obj: any, line: number, number: number): GuiCommand;
  add(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any): void;
  add(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any, bool1: boolean): void;
  add(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any, number: number): void;
  add(commandType: CommandType, obj: any, line: number, objectValue: any): void;
  add(commandType: CommandType, obj: any, line: number, str: string, style: number): void;
  add(commandType: CommandType, obj: any, line: number, str: string, userDropFormat: string, style: number): void;
  add(commandType: CommandType, obj: any, line: number, displayList: string[], bool1: boolean): void;
  add(commandType: CommandType, parentObj: any, containerForm: GuiMgForm, menuStyle: MenuStyle, guiMgMenu: GuiMgMenu, parentTypeForm: boolean): void;
  add(commandType: CommandType, parentObj: any, containerForm: GuiMgForm, menuStyle: MenuStyle, guiMgMenu: GuiMgMenu, parentTypeForm: boolean, shouldShowPulldownMenu: boolean): void;
  add(commandType: CommandType, parentObj: any, menuStyle: MenuStyle, menuEntry: GuiMenuEntry, guiMgForm: GuiMgForm, index: number): void;
  add(commandType: CommandType, parentObj: any, menuStyle: MenuStyle, menuEntry: GuiMenuEntry): void;
  add(commandType: CommandType, mnuRef: MenuReference, menuEntry: GuiMenuEntry, val: any): void;
  add(commandType: CommandType, form: GuiMgForm, newToolbar: any): void;
  add(commandType: CommandType, toolbar: any, form: GuiMgForm, menuEntry: GuiMenuEntry, index: number): void;
  add(commandType: CommandType, objOrParentObjectOrMnuRefOrFormOrToolbar?: any, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm?: any,
      formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal?: any,
      formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex?: any, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex?: any, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu?: any,
      shouldBlockOrColumnCountOrBoolVal?: any, boolValOrBool1?: boolean, boolVal1OrNumber1?: any, number1OrNumber2?: any,
      type?: Type, number2?: number, obj1?: any, isParentHelpWindow?: boolean, dockingStyle?: DockingStyle): GuiCommand | void {
    if (arguments.length === 1 && (commandType === null || commandType.constructor === Number)) {
      this.add_0(commandType);
      return;
    }
    if (arguments.length === 2 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object)) {
      this.add_1(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Boolean) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === String)) {
      this.add_2(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Boolean) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Boolean) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === String)) {
      this.add_3(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 3 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Boolean)) {
      this.add_4(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm);
      return;
    }
    if (arguments.length === 3 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object)) {
      this.add_5(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number)) {
      this.add_6(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number)) {
      this.add_7(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 8 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === String) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Boolean) && (createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu === null || createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu.constructor === Boolean) && (shouldBlockOrColumnCountOrBoolVal === null || shouldBlockOrColumnCountOrBoolVal.constructor === Boolean)) {
      this.add_8(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu, shouldBlockOrColumnCountOrBoolVal);
      return;
    }
    if (arguments.length === 16 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex instanceof List) && (createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu === null || createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu instanceof List) && (shouldBlockOrColumnCountOrBoolVal === null || shouldBlockOrColumnCountOrBoolVal.constructor === Number) && (boolValOrBool1 === null || boolValOrBool1.constructor === Boolean) && (boolVal1OrNumber1 === null || boolVal1OrNumber1.constructor === Boolean) && (number1OrNumber2 === null || number1OrNumber2.constructor === Number) && (type === null || type instanceof Type) && (number2 === null || number2.constructor === Number) && (obj1 === null || obj1.constructor === Object) && (isParentHelpWindow === null || isParentHelpWindow.constructor === Boolean) && (dockingStyle === null || dockingStyle.constructor === Number)) {
      this.add_9(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu, shouldBlockOrColumnCountOrBoolVal, boolValOrBool1, boolVal1OrNumber1, number1OrNumber2, type, number2, obj1, isParentHelpWindow, dockingStyle);
      return;
    }
    if (arguments.length === 14 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex instanceof List) && (createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu === null || createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu instanceof List) && (shouldBlockOrColumnCountOrBoolVal === null || shouldBlockOrColumnCountOrBoolVal.constructor === Number) && (boolValOrBool1 === null || boolValOrBool1.constructor === Boolean) && (boolVal1OrNumber1 === null || boolVal1OrNumber1.constructor === Boolean) && (number1OrNumber2 === null || number1OrNumber2.constructor === Number) && (type === null || type instanceof Type) && (number2 === null || number2.constructor === Number) && (obj1 === null || obj1.constructor === Object)) {
      this.add_10(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu, shouldBlockOrColumnCountOrBoolVal, boolValOrBool1, boolVal1OrNumber1, number1OrNumber2, type, number2, obj1);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Boolean)) {
      this.add_11(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Boolean) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Boolean)) {
      this.add_12(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 9 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number) && (createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu === null || createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu.constructor === Number) && (shouldBlockOrColumnCountOrBoolVal === null || shouldBlockOrColumnCountOrBoolVal.constructor === Boolean) && (boolValOrBool1 === null || boolValOrBool1.constructor === Boolean)) {
      this.add_13(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu, shouldBlockOrColumnCountOrBoolVal, boolValOrBool1);
      return;
    }
    if (arguments.length === 3 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === String)) {
      this.add_15(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm);
      return;
    }
    if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number)) {
      this.add_16(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number)) {
      this.add_17(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Object) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Object)) {
      this.add_18(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Object) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Object) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Boolean)) {
      this.add_19(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Object) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Object) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number)) {
      this.add_20(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Object)) {
      this.add_21(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === String) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Number)) {
      this.add_22(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === String) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === String) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number)) {
      this.add_23(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
     if (arguments.length === 5 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal instanceof Array) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex.constructor === Boolean)) {
      this.add_25(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm instanceof GuiMgForm) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex instanceof GuiMgMenu) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Boolean)) {
      this.add_26(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 7 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm instanceof GuiMgForm) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Number) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex instanceof GuiMgMenu) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Boolean) && (createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu === null || createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu.constructor === Boolean)) {
      this.add_27(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex, createInternalFormForMDIOrCtrlListOrHeightOrShouldShowPulldownMenu);
      return;
    }
    if (arguments.length === 6 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal instanceof GuiMenuEntry) && (formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex === null || formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex instanceof GuiMgForm) && (styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex === null || styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex.constructor === Number)) {
      this.add_28(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex, styleOrNum3OrIsHelpWindowOrStringListOrWidthOrBool1OrNumberOrParentTypeFormOrIndex);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar.constructor === Object) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Number) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal instanceof GuiMenuEntry)) {
      this.add_29(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 4 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar instanceof MenuReference) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm instanceof GuiMenuEntry) && (formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal === null || formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal.constructor === Object)) {
      this.add_30(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal);
      return;
    }
    if (arguments.length === 3 && (commandType === null || commandType.constructor === Number) && (objOrParentObjectOrMnuRefOrFormOrToolbar === null || objOrParentObjectOrMnuRefOrFormOrToolbar instanceof GuiMgForm) && (boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm === null || boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm.constructor === Object)) {
      this.add_31(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm);
      return;
    }
    this.add_32(commandType, objOrParentObjectOrMnuRefOrFormOrToolbar, boolValOrObj1OrLineOrNumberOrEventNameOrContainerFormOrMenuStyleOrMenuEntryOrNewToolbarOrForm, formNameOrIsHelpWindowOrLayerOrNum1OrWindowTypeOrLineOrBoolValOrXOrNumberOrObjectValue1OrStrOrByteArrayOrDisplayListOrMenuStyleOrMenuEntryOrVal, formNameOrLineOrNum2OrStyleOrExecuteParentLayoutOrYOrPrevNumberOrObjectValue2OrUserDropFormatOrBool1OrGuiMgMenuOrGuiMgFormOrIndex);
  }

  /// <summary>
  ///   BEEP,
  /// </summary>
  private add_0(commandType: CommandType): void {
    let guiCommand: GuiCommand = new GuiCommand(commandType);
    this.put(guiCommand);
  }

  /// <summary>
  ///   DISPOSE_OBJECT REMOVE_CONTROLS EXECUTE_LAYOUT CLOSE_SHELL, REMOVE_ALL_TABLE_ITEMS,
  ///   REMOVE_CONTROLS, INVALIDATE_TABLE, SET_SB_LAYOUT_DATA, SET_WINDOW_ACTIVE
  ///   SET_FRAMESET_LAYOUT_DATA, RESUME_LAYOUT, UPDATE_MENU_VISIBILITY
  ///   ORDER_MG_SPLITTER_CONTAINER_CHILDREN, CLEAR_TABLE_COLUMNS_SORT_MARK, MOVE_ABOVE, START_TIMER
  /// </summary>
  private add_1(commandType: CommandType, obj: any): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    this.put(guiCommand);
  }

  /// <summary>
  ///   OPEN_FORM, OPEN HELP FORM.
  /// </summary>
  private add_2(commandType: CommandType, obj: any, boolVal: boolean, formName: string): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.Bool3 = boolVal;
    guiCommand.str = formName;
    this.put(guiCommand);
  }

  /// <summary>
  /// SHOW_FORM
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="boolVal"></param>
  /// <param name="isHelpWindow"></param>
  /// <param name="formName"></param>
  private add_3(commandType: CommandType, obj: any, boolVal: boolean, isHelpWindow: boolean, formName: string): void {
    this.checkObject(obj);
    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.Bool3 = boolVal;
    guiCommand.Bool1 = isHelpWindow;
    guiCommand.str = formName;
    this.put(guiCommand);
  }

  /// <summary>
  ///   EXECUTE_LAYOUT, REORDER_FRAME, PROP_SET_SHOW_ICON, SET_FORMSTATE_APPLIED, PROP_SET_FILL_WIDTH
  /// </summary>
  private add_4(commandType: CommandType, obj: any, boolVal: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.Bool3 = boolVal;
    this.put(guiCommand);
  }

  /// <summary>
  ///   ADD_DVCONTROL_HANDLER, REMOVE_DVCONTROL_HANDLER
  /// </summary>
  private add_5(commandType: CommandType, obj: any, obj1: any): void {
    this.checkObject(obj);
    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.obj1 = obj1;
    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_DEFAULT_BUTTON style : not relevant PROP_SET_SORT_COLUMN
  /// </summary>
  /// <param name = "line">TODO CREATE_RADIO_BUTTON PROP_SET_SORT_COLUMN layer, line,style isn't relevant parentObject:
  ///   must to be the table control object: must to be the Column control
  /// </param>
  private add_6(commandType: CommandType, parentObject: any, obj: any, layer: number, line: number, style: number): void {
    this.checkObject(obj);

    if (!((parentObject instanceof GuiMgForm) || (parentObject instanceof GuiMgControl)))
      throw new ApplicationException("in GuiCommandQueue.add(): parent object is not GuiMgForm or GuiMgControl");

    let guiCommand: GuiCommand = new GuiCommand(parentObject, obj, commandType);
    guiCommand.line = line;
    switch (commandType) {
      case CommandType.PROP_SET_DEFAULT_BUTTON:
        guiCommand.parentObject = parentObject;
        guiCommand.obj = obj;
        break;


      default:
        guiCommand.layer = layer;
        guiCommand.style = style;
        break;

    }
    this.put(guiCommand);
  }

  /// <summary>
  ///   SELECT_TEXT
  /// </summary>
  private add_7(commandType: CommandType, obj: any, line: number, num1: number, num2: number, num3: number): void {
    this.checkObject(obj);
    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;
    switch (commandType) {
      case CommandType.SELECT_TEXT:
        guiCommand.number = num1; // (0) -unmark all text, (1)- mark all text, (-1)-mark from pos until pos
        // for unmark\mark(0,1) all text, num1 & num 2 are not relevants
        guiCommand.layer = num2; // mark from text pos
        guiCommand.number1 = num3; // mark until text pos
        break;


      default:
        Debug.Assert(false);
        break;

    }
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_FORM, CREATE_HELP_FORM
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "parentObject"></param>
  /// <param name = "obj"></param>
  /// <param name = "windowType"></param>
  /// <param name = "formName"></param>
  /// <param name = "isHelpWindow"></param>
  private add_8(commandType: CommandType, parentObject: any, obj: any, windowType: WindowType, formName: string, isHelpWindow: boolean, createInternalFormForMDI: boolean, shouldBlock: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(parentObject, obj, commandType);
    guiCommand.windowType = windowType;
    guiCommand.str = formName;
    guiCommand.isHelpWindow = isHelpWindow;
    guiCommand.createInternalFormForMDI = createInternalFormForMDI;
    guiCommand.Bool1 = shouldBlock;
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_LABEL, CREATE_EDIT, CREATE_BUTTON, CREATE_COMBO_BOX, CREATE_LIST_BOX,
  ///   CREATE_RADIO_BOX, CREATE_IMAGE, CREATE_CHECK_BOX, CREATE_TAB, CREATE_TABLE, CREATE_SUB_FORM,
  ///   CREATE_BROWSER, CREATE_GROUP, CREATE_STATUS_BAR, CREATE_FRAME,
  /// </summary>
  /// <param name = "line">TODO
  ///   PROP_SET_SORT_COLUMN layer, line,style isn't relevant parentObject: must to be the table control object:
  ///   must to be the Column control- not support.
  /// </param>
  /// <param name = "bool">TODO</param>
  private add_9(commandType: CommandType, parentObject: any, obj: any, line: number, style: number, stringList: List<string>, ctrlList: List<GuiMgControl>, columnCount: number, boolVal: boolean, boolVal1: boolean, number1: number, type: Type, number2: number, obj1: any, isParentHelpWindow: boolean, dockingStyle: DockingStyle): void {
    this.checkObject(obj);

    if (!((parentObject instanceof GuiMgForm) || (parentObject instanceof GuiMgControl)))
      throw new ApplicationException("in GuiCommandQueue.add(): parent object is not GuiMgForm or GuiMgControl");

    let guiCommand: GuiCommand = new GuiCommand(parentObject, obj, commandType);
    guiCommand.line = line;
    guiCommand.style = style;
    guiCommand.stringList = stringList;
    guiCommand.CtrlsList = ctrlList;
    guiCommand.number = columnCount;
    guiCommand.Bool3 = boolVal;
    guiCommand.Bool1 = boolVal1;
    guiCommand.type = type;
    guiCommand.number1 = number1;
    guiCommand.number2 = number2;
    guiCommand.obj1 = obj1;
    guiCommand.isParentHelpWindow = isParentHelpWindow;
    guiCommand.dockingStyle = dockingStyle;

    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_LABEL, CREATE_EDIT, CREATE_BUTTON, CREATE_COMBO_BOX, CREATE_LIST_BOX,
  ///   CREATE_RADIO_BOX, CREATE_IMAGE, CREATE_CHECK_BOX, CREATE_TAB, CREATE_TABLE, CREATE_SUB_FORM,
  ///   CREATE_BROWSER, CREATE_GROUP, CREATE_STATUS_BAR, CREATE_FRAME,
  /// </summary>
  /// <param name = "line">TODO
  ///   PROP_SET_SORT_COLUMN layer, line,style isn't relevant parentObject: must to be the table control object:
  ///   must to be the Column control- not support.
  /// </param>
  /// <param name = "bool">TODO</param>
  private add_10(commandType: CommandType, parentObject: any, obj: any, line: number, style: number, stringList: List<string>, ctrlList: List<GuiMgControl>, columnCount: number, boolVal: boolean, boolVal1: boolean, number1: number, type: Type, number2: number, obj1: any): void {
    this.checkObject(obj);

    if (!((parentObject instanceof GuiMgForm) || (parentObject instanceof GuiMgControl)))
      throw new ApplicationException("in GuiCommandQueue.add(): parent object is not GuiMgForm or GuiMgControl");

    let guiCommand: GuiCommand = new GuiCommand(parentObject, obj, commandType);
    guiCommand.line = line;
    guiCommand.style = style;
    guiCommand.stringList = stringList;
    guiCommand.CtrlsList = ctrlList;
    guiCommand.number = columnCount;
    guiCommand.Bool3 = boolVal;
    guiCommand.Bool1 = boolVal1;
    guiCommand.type = type;
    guiCommand.number1 = number1;
    guiCommand.number2 = number2;
    guiCommand.obj1 = obj1;

    this.put(guiCommand);
  }

  /// <summary>
  ///   Applies for: REFRESH_TABLE, SELECT_TEXT, PROP_SET_READ_ONLY, PROP_SET_MODIFIABLE, PROP_SET_ENABLE,
  ///   PROP_SET_CHECKED (Table): PROP_SET_LINE_VISIBLE, PROP_SET_RESIZABLE, SET_FOCUS, PROP_SET_MOVEABLE
  ///   SET_VERIFY_IGNORE_AUTO_WIDE, PROP_SET_AUTO_WIDE, PROP_SET_SORTABLE_COLUMN
  ///   PROP_SET_MENU_DISPLAY, PROP_SET_TOOLBAR_DISPLAY PROP_HORIZONTAL_PLACEMENT, PROP_VERTICAL_PLACEMENT
  ///   PROP_SET_MULTILINE, PROP_SET_PASSWORD_EDIT, PROP_SET_MULTILINE_VERTICAL_SCROLL, PROP_SET_BORDER,
  ///   CHANGE_COLUMN_SORT_MARK.
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "obj"></param>
  /// <param name = "number">
  ///   If command type is <code>CHANGE_COLUMN_SORT_MARK</code> then number means direction.
  ///   Otherwise it means line.
  /// </param>
  /// <param name = "boolVal">
  ///   If command type is <code>CHANGE_COLUMN_SORT_MARK</code> this value is ignored.
  /// </param>
  private add_11(commandType: CommandType, obj: any, number: number, boolVal: boolean): void {
    this.add(commandType, obj, number, boolVal, false);
  }

  /// <summary>
  ///   PROP_SET_VISIBLE, SET_ACTIVETE_KEYBOARD_LAYOUT
  /// </summary>

  private add_12(commandType: CommandType, obj: any, number: number, boolVal: boolean, executeParentLayout: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.Bool3 = boolVal;
    guiCommand.Bool1 = executeParentLayout;

    // for SET_ACTIVETE_KEYBOARD_LAYOUT guiCommand.bool1 is define if it restore or not

    switch (commandType) {
      case CommandType.CHANGE_COLUMN_SORT_MARK:
      case CommandType.START_TIMER:
      case CommandType.STOP_TIMER:
        guiCommand.number = number;
        break;

      default:
        guiCommand.line = number;
        break;

    }

    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_BOUNDS, PROP_SET_COLUMN_WIDTH, PROP_SET_SB_PANE_WIDTH, PROP_SET_PLACEMENT
  ///   subformAsControl isn't relevant, need to be false
  /// </summary>
  private add_13(commandType: CommandType, obj: any, line: number, x: number, y: number, width: number, height: number, boolVal: boolean, bool1: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;
    guiCommand.Bool3 = boolVal;
    guiCommand.Bool1 = bool1;
    guiCommand.x = x;
    guiCommand.y = y;
    guiCommand.width = width;
    guiCommand.height = height;

    this.put(guiCommand);
  }

  /// <summary>
  /// REGISTER_DN_CTRL_VALUE_CHANGED_EVENT
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="eventName"></param>
  private add_15(commandType: CommandType, obj: any, eventName: string): void {
    this.checkObject(obj);
    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.str = eventName;
    this.put(guiCommand);
  }

  /// <summary>
  /// PROP_SET_SELECTION
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="line"></param>
  /// <param name="number"></param>
  /// <param name="prevNumber"></param>
  private add_16(commandType: CommandType, obj: any, line: number, number: number, prevNumber: number): void {
    let guiCommand: GuiCommand = this.add(commandType, obj, line, number);
    guiCommand.number1 = prevNumber;
  }

  /// <summary>
  ///   PROP_SET_TEXT_SIZE_LIMIT, PROP_SET_VISIBLE_LINES, PROP_SET_MIN_WIDTH, PROP_SET_MIN_HEIGHT,
  ///   SET_WINDOW_STATE, VALIDATE_TABLE_ROW, SET_ORG_COLUMN_WIDTH, PROP_SET_COLOR_BY,
  ///   PROP_SET_TRANSLATOR, PROP_SET_HORIZANTAL_ALIGNMENT, PROP_SET_MULTILINE_WORDWRAP_SCROLL
  /// </summary>
  private add_17(commandType: CommandType, obj: any, line: number, number: number): GuiCommand {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;

    switch (commandType) {
      case CommandType.PROP_SET_GRADIENT_STYLE:
      case CommandType.SET_WINDOW_STATE:
        guiCommand.style = number;
        break;

      case CommandType.PROP_SET_MIN_WIDTH:
        guiCommand.width = number;
        break;

      case CommandType.PROP_SET_MIN_HEIGHT:
        guiCommand.height = number;
        break;

      case CommandType.PROP_SET_SELECTION_MODE:
        guiCommand.listboxSelectionMode = <ListboxSelectionMode>number;
        break;

      default:
        guiCommand.number = number;
        break;

    }
    this.put(guiCommand);
    return guiCommand;
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="line"></param>
  /// <param name="objectValue1"></param>
  /// <param name="objectValue2"></param>
  private add_18(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any): void {
    this.add(commandType, obj, line, objectValue1, objectValue2, false);
  }

  /// <summary>
  ///   PROP_SET_GRADIENT_COLOR, SET_DVCONTROL_DATASOURCE, PROP_SET_BACKGOUND_COLOR, PROP_SET_FONT
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "obj"></param>
  /// <param name = "line"></param>
  /// <param name = "objectValue1"></param>
  /// <param name = "objectValue2"></param>
  private add_19(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any, bool1: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;

    switch (commandType) {
      case CommandType.PROP_SET_GRADIENT_COLOR:
        guiCommand.mgColor = <MgColor>objectValue1;
        guiCommand.mgColor1 = <MgColor>objectValue2;
        break;


      case CommandType.INSERT_ROWS:
      case CommandType.REMOVE_ROWS:
        guiCommand.number = <number>objectValue1;
        guiCommand.number1 = <number>objectValue2;
        guiCommand.Bool1 = bool1;
        break;


      case CommandType.PROP_SET_CHECKED:
        guiCommand.line = line;
        guiCommand.number = <number>objectValue1;
        guiCommand.Bool3 = <boolean>objectValue2;
        break;


      case CommandType.PROP_SET_SELECTION:
        guiCommand.str = objectValue1.ToString();
        guiCommand.intArray = <number[]>objectValue2;
        guiCommand.Bool1 = bool1;
        break;


      case CommandType.APPLY_CHILD_WINDOW_PLACEMENT:
        guiCommand.width = <number>objectValue1;
        guiCommand.height = <number>objectValue2;
        break;


      case CommandType.UPDATE_DVCONTROL_COLUMN:
      case CommandType.REJECT_DVCONTROL_COLUMN_CHANGES:
        guiCommand.line = <number>line;
        guiCommand.number = <number>objectValue1;
        guiCommand.obj1 = objectValue2;
        break;


      case CommandType.PROP_SET_BACKGOUND_COLOR:
        guiCommand.mgColor = <MgColor>objectValue1;
        guiCommand.number = <number>objectValue2;
        break;


      case CommandType.PROP_SET_FONT:
        guiCommand.mgFont = <MgFont>objectValue1;
        guiCommand.number = <number>objectValue2;
        break;

      default:
        throw new ApplicationException("in GuiCommandQueue.add(): command type not handled: " + commandType);
    }
    this.put(guiCommand);
  }

  /// <summary>
  /// PROP_SET_FOCUS_COLOR, PROP_SET_HOVERING_COLOR, PROP_SET_VISITED_COLOR
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="line"></param>
  /// <param name="objectValue1"></param>
  /// <param name="objectValue2"></param>
  /// <param name="number"></param>
  private add_20(commandType: CommandType, obj: any, line: number, objectValue1: any, objectValue2: any, number: number): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;
    guiCommand.mgColor = <MgColor>objectValue1;
    guiCommand.mgColor1 = <MgColor>objectValue2;
    guiCommand.number = number;

    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_BACKGOUND_COLOR, PROP_SET_FOREGROUND_COLOR, PROP_SET_ALTENATING_COLOR
  ///   PROP_SET_STARTUP_POSITION
  /// </summary>
  /// <param name = "line">TODO PROP_SET_ROW_HIGHLIGHT_COLOR, PROP_SET_ROW_HIGHLIGHT_FGCOLOR : line not relevant
  ///   PROP_SET_FORM_BORDER_STYLE,SET_ALIGNMENT, SET_FRAMES_WIDTH, SET_FRAMES_HEIGHT, REORDER_COLUMNS
  /// </param>
  private add_21(commandType: CommandType, obj: any, line: number, objectValue: any): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;

    switch (commandType) {
      case CommandType.SET_ALIGNMENT:
      case CommandType.PROP_SET_CHECK_BOX_CHECKED:
      case CommandType.PROP_SET_STARTUP_POSITION:
        guiCommand.number = <number>objectValue;
        break;

      case CommandType.PROP_SET_FORM_BORDER_STYLE:
        guiCommand.style = <number>objectValue;
        break;

      case CommandType.PROP_SET_ROW_HIGHLIGHT_FGCOLOR:
      case CommandType.PROP_SET_ROW_HIGHLIGHT_BGCOLOR:
      case CommandType.PROP_SET_INACTIVE_ROW_HIGHLIGHT_BGCOLOR:
      case CommandType.PROP_SET_INACTIVE_ROW_HIGHLIGHT_FGCOLOR:
      case CommandType.PROP_SET_FOREGROUND_COLOR:
      case CommandType.PROP_SET_BORDER_COLOR:
      case CommandType.PROP_SET_ALTENATING_COLOR:
      case CommandType.PROP_SET_TITLE_COLOR:
      case CommandType.PROP_SET_DIVIDER_COLOR:
      case CommandType.PROP_SET_TITLE_FGCOLOR:
      case CommandType.PROP_SET_HOT_TRACK_COLOR:
      case CommandType.PROP_SET_HOT_TRACK_FGCOLOR:
      case CommandType.PROP_SET_SELECTED_TAB_COLOR:
      case CommandType.PROP_SET_SELECTED_TAB_FGCOLOR:
      case CommandType.PROP_SET_EDIT_HINT_COLOR:
      case CommandType.PROP_SET_ROW_BG_COLOR:
        guiCommand.mgColor = <MgColor>objectValue;
        break;

      case CommandType.PROP_SET_IMAGE_LIST_INDEXES:
        guiCommand.intArray = <number[]>objectValue;
        break;

      case CommandType.SET_FRAMES_WIDTH:
      case CommandType.SET_FRAMES_HEIGHT:
      case CommandType.RESTORE_COLUMNS:
        guiCommand.intList = <List<number>>objectValue;
        break;

      case CommandType.REORDER_COLUMNS:
        guiCommand.intArrayList = <List<number[]>>objectValue;
        break;

      case CommandType.CREATE_ENTRY_IN_CONTROLS_MAP:
        guiCommand.obj1 = objectValue;
        break;

      case CommandType.PERFORM_DRAGDROP:
      case CommandType.UPDATE_DVCONTROL_ROW:
      case CommandType.ADD_DVCONTROL_HANDLER:
      case CommandType.CREATE_ROW_IN_DVCONTROL:
      case CommandType.DELETE_DVCONTROL_ROW:
      case CommandType.SET_DVCONTROL_ROW_POSITION:
        guiCommand.obj1 = objectValue;
        break;

      case CommandType.PROP_SET_EDIT_HINT:
        guiCommand.str = <string>objectValue;
        break;

      default:
        throw new ApplicationException("in GuiCommandQueue.add(): command type not handled: " + commandType);
    }
    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_TOOLTIP, PROP_SET_TEXT style: not relevant PROP_SET_WALLPAPER PROP_SET_IMAGE_FILE_NAME
  ///   PROP_SET_URL, PROP_SET_ICON_FILE_NAME : style isn't relevant
  ///   PROP_SET_CONTROL_NAME : style isn't relevant
  /// </summary>
  private add_22(commandType: CommandType, obj: any, line: number, str: string, style: number): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);

    guiCommand.line = line;

    switch (commandType) {
      case CommandType.PROP_SET_ICON_FILE_NAME:
      case CommandType.PROP_SET_WALLPAPER:
      case CommandType.PROP_SET_IMAGE_FILE_NAME:
      case CommandType.PROP_SET_IMAGE_LIST:
        guiCommand.fileName = str;
        guiCommand.style = style;
        break;


      case CommandType.SETDATA_FOR_DRAG:
      case CommandType.PROP_SET_IMAGE_DATA:
        guiCommand.str = str;
        guiCommand.style = style;
        break;


      default:
        guiCommand.str = str;
        break;

    }
    this.put(guiCommand);
  }

  /// <summary>
  /// SETDATA_FOR_DRAG
  /// </summary>
  /// <param name="commandType"></param>
  /// <param name="obj"></param>
  /// <param name="line">line no</param>
  /// <param name="str">string</param>
  /// <param name="userDropFormat">user defined format, if any.</param>
  /// <param name="style"></param>
  private add_23(commandType: CommandType, obj: any, line: number, str: string, userDropFormat: string, style: number): void {
    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.line = line;
    guiCommand.str = str;
    guiCommand.userDropFormat = userDropFormat;
    guiCommand.style = style;

    this.put(guiCommand);
  }


  /// <summary>
  ///   PROP_SET_ITEMS_LIST,
  /// </summary>
  /// <param name = "line">TODO
  /// </param>
  private add_25(commandType: CommandType, obj: any, line: number, displayList: string[], bool1: boolean): void {
    this.checkObject(obj);

    let guiCommand: GuiCommand = new GuiCommand(obj, commandType);
    guiCommand.itemsList = displayList;
    guiCommand.line = line;
    guiCommand.Bool1 = bool1;
    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_MENU, REFRESH_MENU_ACTIONS
  /// </summary>
  private add_26(commandType: CommandType, parentObj: any, containerForm: GuiMgForm, menuStyle: MenuStyle,
                 guiMgMenu: GuiMgMenu, parentTypeForm: boolean): void {
    let guiCommand: GuiCommand = new GuiCommand(parentObj, containerForm, commandType);
    guiCommand.menu = guiMgMenu;
    guiCommand.menuStyle = menuStyle;
    guiCommand.Bool3 = parentTypeForm;
    guiCommand.line = GuiConstants.ALL_LINES;
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_MENU
  /// </summary>
  private add_27(commandType: CommandType, parentObj: any, containerForm: GuiMgForm, menuStyle: MenuStyle,
                 guiMgMenu: GuiMgMenu, parentTypeForm: boolean, shouldShowPulldownMenu: boolean): void {
    let guiCommand: GuiCommand = new GuiCommand(parentObj, containerForm, commandType);
    guiCommand.menu = guiMgMenu;
    guiCommand.menuStyle = menuStyle;
    guiCommand.Bool3 = parentTypeForm;
    guiCommand.line = GuiConstants.ALL_LINES;
    guiCommand.Bool1 = shouldShowPulldownMenu;
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_MENU_ITEM
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "parentObj"></param>
  /// <param name = "menuStyle"></param>
  /// <param name = "menuEntry"></param>
  /// <param name = "form"></param>
  /// <param name = "index"></param>
  private add_28(commandType: CommandType, parentObj: any, menuStyle: MenuStyle, menuEntry: GuiMenuEntry,
                 guiMgForm: GuiMgForm, index: number): void {
    let guiCommand: GuiCommand = new GuiCommand(parentObj, guiMgForm, commandType);
    guiCommand.menuEntry = menuEntry;
    guiCommand.menuStyle = menuStyle;
    guiCommand.line = index;
    this.put(guiCommand);
  }

  /// <summary>
  ///   DELETE_MENU_ITEM
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "parentObj"></param>
  /// <param name = "menuStyle"></param>
  /// <param name = "menuEntry"></param>
  /// <param name = "menuItemReference"></param>
  private add_29(commandType: CommandType, parentObj: any, menuStyle: MenuStyle, menuEntry: GuiMenuEntry): void {
    let guiCommand: GuiCommand = new GuiCommand(parentObj, commandType);
    guiCommand.menuEntry = menuEntry;
    guiCommand.menuStyle = menuStyle;
    this.put(guiCommand);
  }

  /// <summary>
  ///   PROP_SET_CHECKED PROP_SET_ENABLE PROP_SET_VISIBLE PROP_SET_MENU_ENABLE PROP_SET_MENU_VISIBLE Above
  ///   properties for menu entry
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "menuEntry">TODO</param>
  /// <param name = "menuEntry"></param>
  /// <param name = "value"></param>
  private add_30(commandType: CommandType, mnuRef: MenuReference, menuEntry: GuiMenuEntry, val: any): void {
    let guiCommand: GuiCommand = new GuiCommand(mnuRef, commandType);

    guiCommand.menuEntry = menuEntry;

    if (val.constructor === Boolean) { // todo - check this
      guiCommand.Bool3 = <boolean>val;
    }
    else {
      guiCommand.str = <string>val;
    }
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_TOOLBAR
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "form"></param>
  /// <param name = "newToolbar"></param>
  private add_31(commandType: CommandType, form: GuiMgForm, newToolbar: any): void {
    let guiCommand: GuiCommand = new GuiCommand(form, newToolbar, commandType);
    this.put(guiCommand);
  }

  /// <summary>
  ///   CREATE_TOOLBAR_ITEM, DELETE_TOOLBAR_ITEM
  /// </summary>
  /// <param name = "commandType"></param>
  /// <param name = "toolbar">is the ToolBar to which we add a new item (placed in parentObject)</param>
  /// <param name = "menuEntry">is the menuEntry for which we create this toolitem</param>
  /// <param name = "index">is the index of the new object in the toolbar (placed in line)</param>
  private add_32(commandType: CommandType, toolbar: any, form: GuiMgForm, menuEntry: GuiMenuEntry, index: number): void {
    let guiCommand: GuiCommand = new GuiCommand(toolbar, form, commandType);
    guiCommand.menuEntry = menuEntry;
    guiCommand.line = index;
    this.put(guiCommand);
  }

  /// <summary>
  ///   Verifies that the object is either MgForm or MgControl and throws Error if not.
  /// </summary>
  /// <param name = "object">the object to check</param>
  checkObject(obj: any): void {
  }

  /// <summary>
  ///   Function returns true if control is supported.///
  /// </summary>
  /// <param name = "obj"> MgControl object</param>
  /// <returns> whether supported or not</returns>
  isSupportedControl(guiCommand: GuiCommand): boolean {
    return true;
  }

/// <summary>
  ///   execute the command type
  /// </summary>
  public Run(): void {

    let guiCommand: GuiCommand = null;
    let contextIDGuard: ContextIDGuard = new ContextIDGuard();

    try {
      while (!this._commandsQueue.isEmpty()) {

        guiCommand = <GuiCommand>this._commandsQueue.get();
        // when command belongs to already closed window we should not execute it
        if (this.isDisposedObjects(guiCommand) || !this.isSupportedControl(guiCommand))
          continue;
        try {
          contextIDGuard.SetCurrent(guiCommand.contextID);
          switch (guiCommand.CommandType) {
            /**
             * create form
             */
            case CommandType.CREATE_FORM:
              this.createForm(guiCommand);
              break;


            case CommandType.INITIAL_FORM_LAYOUT:
              this.InitialFormLayout(guiCommand);
              break;


            case CommandType.SHOW_FORM:
              this.ShowForm(guiCommand);
              break;


            case CommandType.CREATE_PLACEMENT_LAYOUT:
              this.createLayout(guiCommand);
              break;


            case CommandType.SUSPEND_LAYOUT:
              this.SuspendLayout(guiCommand);
              break;


            case CommandType.RESUME_LAYOUT:
              this.ResumeLayout(guiCommand);
              break;


            case CommandType.SUSPEND_PAINT:
              this.SuspendPaint(guiCommand);
              break;


            case CommandType.RESUME_PAINT:
              this.ResumePaint(guiCommand);
              break;


            case CommandType.EXECUTE_LAYOUT:
              this.executeLayout(guiCommand);
              break;


            /**
             * dispose object
             */
            case CommandType.DISPOSE_OBJECT:
              this.disposeObject(guiCommand);
              break;


            case CommandType.MOVE_ABOVE:
              this.moveAbove(guiCommand);
              break;


            /**
             * update properties
             */
            case CommandType.PROP_SET_ENABLE:
              this.setEnable(guiCommand);
              break;


            case CommandType.PROP_SET_TEXT_SIZE_LIMIT:
              this.setTextSizeLimit(guiCommand);
              break;


            case CommandType.PROP_SET_CONTROL_NAME:
              this.SetControlName(guiCommand);
              break;


            case CommandType.PROP_SET_TEXT:
              this.setText(guiCommand);
              break;


            case CommandType.PROP_SET_READ_ONLY:
              this.setReadonly(guiCommand);
              break;


            case CommandType.PROP_SET_ITEMS_LIST:
              this.setItemsList(guiCommand);
              break;


            case CommandType.PROP_SET_VISIBLE_LINES:
              this.setVisibleLines(guiCommand);
              break;


            case CommandType.PROP_SET_TOOLTIP:
              this.setTooltip(guiCommand);
              break;


            case CommandType.PROP_SET_DEFAULT_BUTTON:
              this.setDefaultButton(guiCommand);
              break;


            case CommandType.PROP_SET_STARTUP_POSITION:
              this.setStartupPosition(guiCommand);
              break;


            case CommandType.PROP_SET_BOUNDS:
              this.setBounds(guiCommand);
              break;


            case CommandType.PROP_SET_PLACEMENT:
              this.setPlacementData(guiCommand);
              break;


            case CommandType.PROP_SET_BORDER_COLOR:
              this.setBorderColor(guiCommand);
              break;


            case CommandType.PROP_SET_BACKGOUND_COLOR:
              this.setBackgroundColor(guiCommand);
              break;


            case CommandType.PROP_SET_FOREGROUND_COLOR:
              this.setForegroundColor(guiCommand);
              break;


            case CommandType.PROP_SET_FOCUS_COLOR:
              this.setFocusColor(guiCommand);
              break;


            case CommandType.PROP_SET_HOVERING_COLOR:
              this.setHoveringColor(guiCommand);
              break;


            case CommandType.SET_TAG_DATA_LINK_VISITED:
              this.SetLinkVisited(guiCommand);
              break;


            case CommandType.PROP_SET_VISITED_COLOR:
              this.setVisitedColor(guiCommand);
              break;


            case CommandType.PROP_SET_ALTENATING_COLOR:
              this.setAlternatedColor(guiCommand);
              break;


            case CommandType.PROP_SET_TITLE_COLOR:
              this.setTitleColor(guiCommand);
              break;


            case CommandType.PROP_SET_TITLE_FGCOLOR:
              this.setTitleFgColor(guiCommand);
              break;


            case CommandType.PROP_SET_HOT_TRACK_COLOR:
              this.setHotTrackColor(guiCommand);
              break;


            case CommandType.PROP_SET_HOT_TRACK_FGCOLOR:
              this.setHotTrackFgColor(guiCommand);
              break;


            case CommandType.PROP_SET_SELECTED_TAB_COLOR:
              this.setSelectedTabColor(guiCommand);
              break;


            case CommandType.PROP_SET_SELECTED_TAB_FGCOLOR:
              this.setSelectedTabFgColor(guiCommand);
              break;


            case CommandType.PROP_SET_DIVIDER_COLOR:
              this.setDividerColor(guiCommand);
              break;


            case CommandType.PROP_SET_COLOR_BY:
              this.setColorBy(guiCommand);
              break;


            case CommandType.PROP_SET_VISIBLE:
              this.setVisible(guiCommand);
              break;


            case CommandType.PROP_SET_MIN_WIDTH:
              this.setMinWidth(guiCommand);
              break;


            case CommandType.PROP_SET_MIN_HEIGHT:
              this.setMinHeight(guiCommand);
              break;


            case CommandType.PROP_SET_WALLPAPER:
            case CommandType.PROP_SET_IMAGE_FILE_NAME:
              this.setImageFileName(guiCommand);
              break;


            case CommandType.PROP_SET_GRADIENT_COLOR:
              this.setGradientColor(guiCommand);
              break;


            case CommandType.PROP_SET_GRADIENT_STYLE:
              this.setGradientStyle(guiCommand);
              break;


            case CommandType.PROP_SET_IMAGE_DATA:
              this.setImageData(guiCommand);
              break;


            case CommandType.PROP_SET_IMAGE_LIST:
              this.setImageList(guiCommand);
              break;


            case CommandType.PROP_SET_ICON_FILE_NAME:
              this.setIconFileName(guiCommand);
              break;


            case CommandType.PROP_SET_FONT:
              this.setFont(guiCommand);
              break;


            case CommandType.SET_FOCUS:
              this.setFocus(guiCommand);
              break;


            case CommandType.UPDATE_TMP_EDITOR_INDEX:
              this.updateTmpEditorIndex(guiCommand);
              break;


            case CommandType.PROP_SET_RIGHT_TO_LEFT:
              this.setRightToLeft(guiCommand);
              break;


            case CommandType.START_TIMER:
              this.startTimer(guiCommand);
              break;


            case CommandType.STOP_TIMER:
              this.stopTimer(guiCommand);
              break;


            case CommandType.PROP_SET_EDIT_HINT:
              this.setEditHint(guiCommand);
              break;


            case CommandType.PROP_SET_EDIT_HINT_COLOR:
              this.setEditHintColor(guiCommand);
              break;


            case CommandType.CLOSE_FORM: {
              if (this.closeForm(guiCommand))
                return
            }
              break;


            case CommandType.ACTIVATE_FORM:
              this.activateForm(guiCommand);
              break;


            case CommandType.SET_LAST_IN_CONTEXT:
              this.setLastInContext(guiCommand);
              break;


            case CommandType.REMOVE_SUBFORM_CONTROLS:
              this.removeCompositeControls(guiCommand);
              break;

            case CommandType.BEEP:
              this.beep();
              break;

            case CommandType.PROP_SET_CHECK_BOX_CHECKED:
              this.setCheckBoxCheckState(guiCommand);
              break;

            case CommandType.PROP_SET_CHECKED:
              this.setChecked(guiCommand);
              break;

            case CommandType.PROP_SET_SELECTION:
              this.setSelection(guiCommand);
              break;

            case CommandType.PROP_SET_LAYOUT_NUM_COLUMN:
              this.setLayoutNumColumns(guiCommand);
              break;

            case CommandType.PROP_SET_LINE_VISIBLE:
              this.setLinesVisible(guiCommand);
              break;

            case CommandType.PROP_SET_RESIZABLE:
              this.setResizable(guiCommand);
              break;

            case CommandType.PROP_SET_ROW_HEIGHT:
              this.setRowHeight(guiCommand);
              break;

            case CommandType.PROP_SET_TITLE_HEIGHT:
              this.setTitleHeight(guiCommand);
              break;

            case CommandType.PROP_SET_BOTTOM_POSITION_INTERVAL:
              this.setBottomPositionInterval(guiCommand);
              break;

            case CommandType.PROP_SET_ALLOW_REORDER:
              this.setAllowReorder(guiCommand);
              break;

            case CommandType.PROP_SET_SORTABLE_COLUMN:
              this.setSortableColumn(guiCommand);
              break;

            case CommandType.PROP_SET_COLUMN_FILTER:
              this.setFilterableColumn(guiCommand);
              break;

            case CommandType.PROP_SET_RIGHT_BORDER:
              this.setColumnRightBorder(guiCommand);
              break;

            case CommandType.PROP_SET_TOP_BORDER:
              this.setColumnTopBorder(guiCommand);
              break;

            case CommandType.PROP_SET_COLUMN_PLACMENT:
              this.setPlacement(guiCommand);
              break;

            case CommandType.SET_COLUMN_ORG_WIDTH:
              this.setOrgWidth(guiCommand);
              break;

            case CommandType.SET_COLUMN_START_POS:
              this.setStartPos(guiCommand);
              break;

            case CommandType.SET_TABLE_ITEMS_COUNT:
              this.SetTableItemsCount(guiCommand);
              break;

            case CommandType.SET_TABLE_VIRTUAL_ITEMS_COUNT:
              this.SetTableVirtualItemsCount(guiCommand);
              break;

            case CommandType.SET_TABLE_VSCROLL_THUMB_POS:
              this.SetVScrollThumbPos(guiCommand);
              break;

            case CommandType.SET_TABLE_VSCROLL_PAGE_SIZE:
              this.SetVScrollPageSize(guiCommand);
              break;

            case CommandType.SET_RECORDS_BEFORE_CURRENT_VIEW:
              this.SetRecordsBeforeCurrentView(guiCommand);
              break;

            case CommandType.INSERT_ROWS:
              this.InsertRows(guiCommand);
              break;

            case CommandType.REMOVE_ROWS:
              this.RemoveRows(guiCommand);
              break;

            case CommandType.TOGGLE_ALTERNATE_COLOR_FOR_FIRST_ROW:
              this.ToggleAlternateColorForFirstRow(guiCommand);
              break;

            case CommandType.SET_TABLE_INCLUDES_FIRST:
              this.SetTableIncludesFirst(guiCommand);
              break;

            case CommandType.SET_TABLE_INCLUDES_LAST:
              this.SetTableIncludesLast(guiCommand);
              break;

            case CommandType.SET_TABLE_TOP_INDEX:
              this.SetTableTopIndex(guiCommand);
              break;

            case CommandType.SET_SELECTION_INDEX:
              this.SetSelectionIndex(guiCommand);
              break;

            case CommandType.REFRESH_TABLE:
              this.refreshTable(guiCommand);
              break;

            case CommandType.INVALIDATE_TABLE:
              this.invalidateTable(guiCommand);
              break;

            case CommandType.CREATE_TABLE_ROW:
              this.createTableRow(guiCommand);
              break;

            case CommandType.UNDO_CREATE_TABLE_ROW:
              this.undoCreateTableRow(guiCommand);
              break;

            case CommandType.SET_TABLE_ROW_VISIBILITY:
              this.SetTableRowVisibility(guiCommand);
              break;

            case CommandType.VALIDATE_TABLE_ROW:
              this.validateTableRow(guiCommand);
              break;

            case CommandType.CLEAR_TABLE_COLUMNS_SORT_MARK:
              this.clearTableColumnsSortMark(guiCommand);
              break;

            case CommandType.REFRESH_TMP_EDITOR:
              this.refreshTmpEditor(guiCommand);
              break;

            case CommandType.PROP_SET_URL:
              this.setUrl(guiCommand);
              break;

            case CommandType.PROP_SET_ROW_HIGHLIGHT_BGCOLOR:
              this.setRowHighlightBgColor(guiCommand);
              break;

            case CommandType.PROP_SET_ROW_HIGHLIGHT_FGCOLOR:
              this.setRowHighlightFgColor(guiCommand);
              break;

            case CommandType.PROP_SET_INACTIVE_ROW_HIGHLIGHT_BGCOLOR:
              this.setInactiveRowHighlightBgColor(guiCommand);
              break;

            case CommandType.PROP_SET_ACTIVE_ROW_HIGHLIGHT_STATE:
              this.setActiveRowHighlightState(guiCommand);
              break;

            case CommandType.PROP_SET_INACTIVE_ROW_HIGHLIGHT_FGCOLOR:
              this.setInactiveRowHighlightFgColor(guiCommand);
              break;

            case CommandType.SELECT_TEXT:
              this.selectText(guiCommand);
              break;

            case CommandType.PROP_SET_MENU:
              this.setMenu(guiCommand);
              break;

            case CommandType.PROP_RESET_MENU:
              this.resetMenu(guiCommand);
              break;

            case CommandType.CREATE_MENU:
              this.createMenu(guiCommand);
              break;

            case CommandType.REFRESH_MENU_ACTIONS:
              this.RefreshMenuActions(guiCommand);
              break;

            case CommandType.CREATE_MENU_ITEM:
              this.createMenuItem(guiCommand);
              break;

            case CommandType.DELETE_MENU_ITEM:
              this.deleteMenuItem(guiCommand);
              break;

            case CommandType.UPDATE_MENU_VISIBILITY:
              this.updateMenuVisibility(guiCommand);
              break;

            case CommandType.DELETE_MENU:
              this.deleteMenu(guiCommand);
              break;

            case CommandType.CREATE_TOOLBAR:
              this.createToolbar(guiCommand);
              break;

            case CommandType.SET_TOOLBAR:
              this.setToolBar(guiCommand);
              break;

            case CommandType.DELETE_TOOLBAR:
              this.deleteToolbar(guiCommand);
              break;

            case CommandType.CREATE_TOOLBAR_ITEM:
              this.createToolbarItem(guiCommand);
              break;

            case CommandType.DELETE_TOOLBAR_ITEM:
              this.deleteToolbarItem(guiCommand);
              break;

            case CommandType.SET_WINDOW_STATE:
              this.setWindowState(guiCommand);
              break;

            case CommandType.PROP_SET_SB_PANE_WIDTH:
              this.setSBPaneWidth(guiCommand);
              break;

            case CommandType.CREATE_SB_IMAGE:
            case CommandType.CREATE_SB_LABEL:
              this.createSBPane(guiCommand);
              break;

            case CommandType.PROP_SET_MENU_ENABLE:
              this.setMenuEnable(guiCommand);
              break;

            case CommandType.PROP_SET_AUTO_WIDE:
              this.setAutoWide(guiCommand);
              break;

            case CommandType.SET_EXPANDED:
              this.setExpanded(guiCommand);
              break;

            case CommandType.SET_CHILDREN_RETRIEVED:
              this.setChildrenRetrieved(guiCommand);
              break;

            case CommandType.PROP_HORIZONTAL_PLACEMENT:
              this.setHorizontalPlacement(guiCommand);
              break;

            case CommandType.PROP_VERTICAL_PLACEMENT:
              this.setVerticalPlacement(guiCommand);
              break;

            case CommandType.SHOW_TMP_EDITOR:
              this.showTmpEditor(guiCommand);
              break;

            case CommandType.PROP_SET_TRANSLATOR:
              this.setImeMode(guiCommand);
              break;

            case CommandType.PROP_SET_HORIZANTAL_ALIGNMENT:
              this.setHorizontalAlignment(guiCommand);
              break;

            case CommandType.PROP_SET_VERTICAL_ALIGNMENT:
              this.setVerticalAlignment(guiCommand);
              break;

            case CommandType.PROP_SET_RADIO_BUTTON_APPEARANCE:
              this.setRadioButtonAppearance(guiCommand);
              break;

            case CommandType.PROP_SET_THREE_STATE:
              this.setThreeState(guiCommand);
              break;

            case CommandType.PROP_SET_MULTILINE:
              this.setMultiLine(guiCommand);
              break;

            case CommandType.PROP_SET_PASSWORD_EDIT:
              this.setPasswordEdit(guiCommand);
              break;

            case CommandType.PROP_SET_MULTILINE_WORDWRAP_SCROLL:
              this.setMultilineWordWrapScroll(guiCommand);
              break;

            case CommandType.PROP_SET_MULTILINE_VERTICAL_SCROLL:
              this.setMultilineVerticalScroll(guiCommand);
              break;

            case CommandType.PROP_SET_MULTILINE_ALLOW_CR:
              this.setMultilineAllowCR(guiCommand);
              break;

            case CommandType.PROP_SET_BORDER_STYLE:
              this.setBorderStyle(guiCommand);
              break;

            case CommandType.PROP_SET_STYLE_3D:
              this.setStyle3D(guiCommand);
              break;

            case CommandType.PROP_SET_CHECKBOX_MAIN_STYLE:
              this.setCheckboxMainStyle(guiCommand);
              break;

            case CommandType.PROP_SET_BORDER:
              this.setBorder(guiCommand);
              break;

            case CommandType.PROP_SET_FORM_BORDER_STYLE:
              this.setFormBorderStyle(guiCommand);
              break;

            case CommandType.PROP_SET_MINBOX:
              this.setMinBox(guiCommand);
              break;

            case CommandType.PROP_SET_MAXBOX:
              this.setMaxBox(guiCommand);
              break;

            case CommandType.PROP_SET_SYSTEM_MENU:
              this.setSystemMenu(guiCommand);
              break;

            case CommandType.PROP_SET_TITLE_BAR:
              this.setTitleBar(guiCommand);
              break;

            case CommandType.PROP_SHOW_FULL_ROW:
              this.showFullRow(guiCommand);
              break;

            case CommandType.ORDER_MG_SPLITTER_CONTAINER_CHILDREN:
              this.orderMgSplitterContainerChildren(guiCommand);
              break;

            case CommandType.PROP_SHOW_BUTTONS:
              this.showButtons(guiCommand);
              break;

            case CommandType.PROP_HOT_TRACK:
              this.hotTrack(guiCommand);
              break;

            case CommandType.PROP_LINES_AT_ROOT:
              this.linesAtRoot(guiCommand);
              break;

            case CommandType.PROP_SHOW_SCROLLBAR:
              this.showScrollbar(guiCommand);
              break;

            case CommandType.PROP_LINE_DIVIDER:
              this.showLineDividers(guiCommand);
              break;

            case CommandType.PROP_COLUMN_DIVIDER:
              this.showColumnDividers(guiCommand);
              break;

            case CommandType.PROP_ROW_HIGHLITING_STYLE:
              this.rowHighlitingStyle(guiCommand);
              break;

            case CommandType.SET_ENV_ACCESS_TEST:
              this.setEnvAccessTest(guiCommand);
              break;

            case CommandType.SET_ENV_LAMGUAGE:
              this.setLanguage(guiCommand);
              break;

            case CommandType.SET_ENV_SPECIAL_TEXT_SIZE_FACTORING:
              this.setSpecialTextSizeFactoring(guiCommand);
              break;

            case CommandType.SET_ENV_SPECIAL_FLAT_EDIT_ON_CLASSIC_THEME:
              this.setSpecialFlatEditOnClassicTheme(guiCommand);
              break;

            case CommandType.SET_ENV_TOOLTIP_TIMEOUT:
              this.setEnvTooltipTimeout(guiCommand);
              break;

            case CommandType.PROP_SET_LINE_STYLE:
              this.setLineStyle(guiCommand);
              break;

            case CommandType.PROP_SET_LINE_WIDTH:
              this.setLineWidth(guiCommand);
              break;

            case CommandType.PROP_SET_LINE_DIRECTION:
              this.setLineDirection(guiCommand);
              break;

            case CommandType.PROP_TAB_CONTROL_SIDE:
              this.setTabControlSide(guiCommand);
              break;

            case CommandType.PROP_SET_TAB_SIZE_MODE:
              this.setTabSizeMode(guiCommand);
              break;

            case CommandType.PROP_SET_EXPANDED_IMAGEIDX:
              this.setExpandedImageIdx(guiCommand);
              break;

            case CommandType.PROP_SET_COLLAPSED_IMAGEIDX:
              this.setCollapsedImageIdx(guiCommand);
              break;

            case CommandType.PROP_SET_PARKED_IMAGEIDX:
              this.setParkedExpandedImageIdx(guiCommand);
              break;

            case CommandType.PROP_SET_PARKED_COLLAPSED_IMAGEIDX:
              this.setParkedCollapsedImageIdx(guiCommand);
              break;

            case CommandType.PROP_SET_IMAGE_LIST_INDEXES:
              this.setImageListIndexes(guiCommand);
              break;

            case CommandType.COMBO_DROP_DOWN:
              this.comboDropDown(guiCommand);
              break;

            case CommandType.SET_ACTIVETE_KEYBOARD_LAYOUT:
              this.activateKeyboardLayout(guiCommand);
              break;

            case CommandType.ALLOW_UPDATE:
              this.allowUpdate(guiCommand);
              break;

            case CommandType.SET_ALIGNMENT:
              this.setAlignment(guiCommand);
              break;

            case CommandType.BULLET:
              this.setBullet(guiCommand);
              break;

            case CommandType.INDENT:
              this.setIndent(guiCommand);
              break;

            case CommandType.UNINDENT:
              this.setUnindent(guiCommand);
              break;

            case CommandType.CHANGE_COLOR:
              this.ChangeColor(guiCommand);
              break;

            case CommandType.CHANGE_FONT:
              this.ChangeFont(guiCommand);
              break;

            case CommandType.CHANGE_COLUMN_SORT_MARK:
              this.ChangeColumnSortMark(guiCommand);
              break;

            case CommandType.SET_CURRENT_CURSOR:
              this.setCurrentCursor(guiCommand);
              break;

            case CommandType.SET_FRAMES_WIDTH:
              this.setFramesWidth(guiCommand);
              break;

            case CommandType.SET_FRAMES_HEIGHT:
              this.setFramesHeight(guiCommand);
              break;

            case CommandType.SET_WINDOWSTATE:
              this.setFormMaximized(guiCommand);
              break;

            case CommandType.REORDER_COLUMNS:
              this.reorderColumns(guiCommand);
              break;

            case CommandType.RESTORE_COLUMNS:
              this.restoreColumns(guiCommand);
              break;

            case CommandType.PROP_SET_ALLOW_DRAG:
              this.SetAllowDrag(guiCommand);
              break;

            case CommandType.PROP_SET_ALLOW_DROP:
              this.SetAllowDrop(guiCommand);
              break;

            case CommandType.SETDATA_FOR_DRAG:
              this.SetDataForDrag(guiCommand);
              break;

            case CommandType.PERFORM_DRAGDROP:
              this.PerformDragDrop(guiCommand);
              break;

            case CommandType.PROP_SET_SELECTION_MODE:
              this.SetSelectionMode(guiCommand);
              break;

            case CommandType.ENABLE_XPTHEMES:
              this.EnableXPThemes(guiCommand);
              break;

            case CommandType.APPLY_CHILD_WINDOW_PLACEMENT:
              this.ApplyChildWindowPlacement(guiCommand);
              break;

            case CommandType.REGISTER_DN_CTRL_VALUE_CHANGED_EVENT:
              this.RegisterDNControlValueChangedEvent(guiCommand);
              break;

            case CommandType.PROP_SET_ROW_PLACEMENT:
              this.SetRowPlacement(guiCommand);
              break;

            case CommandType.SET_TABLE_ORG_ROW_HEIGHT:
              this.SetTableOrgRowHeight(guiCommand);
              break;

            case CommandType.PROCESS_PRESS_EVENT:
              this.ProcessPressEvent(guiCommand);
              break;

            case CommandType.SET_MARKED_ITEM_STATE:
              this.SetMarkedItemState(guiCommand);
              break;

            case CommandType.PROP_SET_TOP_BORDER_MARGIN:
              this.SetTopBorderMargin(guiCommand);
              break;

            case CommandType.PROP_SET_FILL_WIDTH:
              this.SetFillWidth(guiCommand);
              break;

            case CommandType.PROP_SET_MULTI_COLUMN_DISPLAY:
              this.SetMultiColumnDisplay(guiCommand);
              break;

            case CommandType.PROP_SET_SHOW_ELLIPSIS:
              this.SetShowEllipsis(guiCommand);
              break;

            case CommandType.PROP_SET_TITLE_PADDING:
              this.SetTitlePadding(guiCommand);
              break;

            case CommandType.RECALCULATE_TABLE_COLORS:
              this.OnRecalculateTableColors(guiCommand);
              break;

            case CommandType.RECALCULATE_TABLE_FONTS:
              this.OnRecalculateTableFonts(guiCommand);
              break;

            case CommandType.SET_SHOULD_APPLY_PLACEMENT_TO_HIDDEN_COLUMNS:
              this.OnSetShouldApplyPlacementToHiddenColumns(guiCommand);
              break;

            case CommandType.PROP_SET_ROW_BG_COLOR:
              this.OnSetRowBGColor(guiCommand);
              break;

            case CommandType.SET_CARET:
              this.SetCaret(guiCommand);
              break;

            default:
              throw new ApplicationException("in GuiCommandQueue.run(): command type not handled: " +
                guiCommand.CommandType);
          }
        }
        catch (ex) {
          Events.WriteExceptionToLog(ex);
        }

      }
    }

    finally {
      contextIDGuard.Dispose();
      // this.GuiThreadIsAvailableToProcessCommands = false; //TODo
    }
  }

  /// <summary>
  ///   execute all pending commands, asynchronously
  /// </summary>
  beginInvoke(): void {
  }

  /// <summary>
  ///   execute all pending commands, synchronously
  /// </summary>
  invoke(): void {
    // GUIMain.getInstance().invoke(new GuiCommandsDelegate(Run));
  }

  /// <summary>
  ///   checks if command belongs to disposed window This method performs the check
  /// </summary>
  /// <param name = "guiCommand">guiCommand</param>
  /// <returns> true if object for operation is disposed</returns>
  isDisposedObjects(guiCommand: GuiCommand): boolean {
    if (guiCommand.CommandType === CommandType.CREATE_FORM && guiCommand.parentObject === null)
      return false; // open shell without parent
    if (guiCommand.parentObject != null)
      return this.objectDisposed(guiCommand.parentObject);
    else if (guiCommand.obj != null)
      return this.objectDisposed(guiCommand.obj);
    return false;
  }

  /// <summary>
  ///   check if object is null or disposed
  /// </summary>
  /// <param name = "object"></param>
  /// <returns></returns>
  objectDisposed(obj: any): boolean {
    return false;
  }


  createSBPane(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("createSBPane - Not Implemented Yet");
  }

  deleteMenu(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("deleteMenu - Not Implemented Yet");
  }

  updateMenuVisibility(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("updateMenuVisibility - Not Implemented Yet");
  }

  deleteMenuItem(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("deleteMenuItem - Not Implemented Yet");
  }

  deleteToolbar(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("deleteToolbar - Not Implemented Yet");
  }

  deleteToolbarItem(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("deleteToolbarItem - Not Implemented Yet");
  }

  executeLayout(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("executeLayout - Not Implemented Yet");
  }

  hotTrack(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("hotTrack - Not Implemented Yet");
  }

  linesAtRoot(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("linesAtRoot - Not Implemented Yet");
  }

  orderMgSplitterContainerChildren(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("orderMgSplitterContainerChildren - Not Implemented Yet");
  }

  resetMenu(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("resetMenu - Not Implemented Yet");
  }

  setChildrenRetrieved(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setChildrenRetrieved - Not Implemented Yet");
  }

  setCollapsedImageIdx(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setCollapsedImageIdx - Not Implemented Yet");
  }

  setDefaultButton(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setDefaultButton - Not supported in the CF");
  }

  setExpanded(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setExpanded - Not Implemented Yet");
  }

  setExpandedImageIdx(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setExpandedImageIdx - Not Implemented Yet");
  }

  setHorizontalPlacement(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setHorizontalPlacement - Not Implemented Yet");
  }

  setIconFileName(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setIconFileName - Not Implemented Yet");
  }

  setImageListIndexes(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setImageListIndexes - Not Implemented Yet");
  }

  setLinesVisible(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setLinesVisible - Not Implemented Yet");
  }

  setMenu(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setMenu - Not Implemented Yet");
  }

  setMenuEnable(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setMenuEnable - Not Implemented Yet");
  }

  setParkedCollapsedImageIdx(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setParkedCollapsedImageIdx - Not Implemented Yet");
  }

  setParkedExpandedImageIdx(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setParkedExpandedImageIdx - Not Implemented Yet");
  }

  allowUpdate(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("allowUpdate - Not Implemented Yet");
  }

  setSBPaneWidth(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setSBPaneWidth - Not Implemented Yet");
  }

  setShowIcon(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setShowIcon - Not supported in the CF");
  }

  setStartupPosition(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setStartupPosition - Not supported in the CF");
  }

  setVisibleLines(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setVisibleLines - Not supported in the CF");
  }

  /// <summary>
  ///   set setSystemMenu
  /// </summary>
  /// <param name = "guiCommand"></param>
  setSystemMenu(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set setTitleBar
  /// </summary>
  /// <param name = "guiCommand"></param>
  setTitleBar(guiCommand: GuiCommand): void {
  }

  setTabSizeMode(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setTabSizeMode - Not supported in the CF");
  }

  setEnvTooltipTimeout(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setEnvTooltipTimeout - Not Implemented Yet");
  }

  setTooltip(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setTooltip - Not Implemented Yet");
  }

  setVerticalPlacement(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setVerticalPlacement - Not Implemented Yet");
  }

  showButtons(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("showButtons - Not Implemented Yet");
  }

  showFullRow(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("showFullRow - Not Implemented Yet");
  }

  showTmpEditor(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("showTmpEditor - Not Implemented Yet");
  }

  activateKeyboardLayout(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("activateKeyboardLayout - Not Implemented Yet");
  }

  createToolbar(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("createToolbar - Not Implemented Yet");
  }

  setToolBar(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setToolBar - Not Implemented Yet");
  }

  createToolbarItem(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("createToolbarItem - Not Implemented Yet");
  }

  setAlignment(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setAlignment - Not Implemented Yet");
  }

  setBullet(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setBullet - Not Implemented Yet");
  }

  setIndent(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setIndent - Not Implemented Yet");
  }

  setUnindent(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setUnindent - Not Implemented Yet");
  }

  ChangeColor(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setChangeColor - Not Implemented Yet");
  }

  ChangeFont(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("setChangeFont - Not Implemented Yet");
  }

  SetTopBorderMargin(guiCommand: GuiCommand): void {
    Events.WriteDevToLog("SetTopBorderMargin - Not Implemented Yet");
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  ChangeColumnSortMark(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   beep
  /// </summary>
  beep(): void {
    SystemSounds.Beep.Play();
  }

  private closeForm(guiCommand: GuiCommand): boolean {
    return false;
  }

  /// <summary>
  /// set as last window context
  /// </summary>
  /// <param name="guiCommand"></param>
  private setLastInContext(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// activate the form
  /// </summary>
  /// <param name = "guiCommand"></param>
  private activateForm(guiCommand: GuiCommand): void {
  }

  ///

  /// <summary>
  ///   Sets the bounds of controls. If the control is a Shell then the requested width and height will be
  ///   considered as if they are the size of the client area.
  /// </summary>
  private setBounds(guiCommand: GuiCommand): void {
  }

  /// <param name = "guiCommand"></param>
  private setPlacementData(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetControlName(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  private setText(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  private setFont(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// set focus color
  /// </summary>
  /// <param name="guiCommand"></param>
  private setFocusColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  private setBackgroundColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set the Border color of the control.
  /// </summary>
  /// <param name="guiCommand"></param>
  private setBorderColor(guiCommand: GuiCommand): void {
  }

/// <summary>
  /// </summary>
  private setForegroundColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  private SetLinkVisited(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  private setVisitedColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  private setGradientColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set gradientStyle into TagData
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  setGradientStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  private setHoveringColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set the push button image list number on the button (4 or 6)
  /// </summary>
  /// <param name = "guiCommand"></param>
  private setPBImagesNumber(key: any, line: number, PBImagesNumber: number): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setImageFileName(guiCommand: GuiCommand): void {
    //Image image = GuiUtils.getImageFromFile(guiCommand.fileName);

    //setImageInfo(guiCommand, image);

  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setImageList(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set the selection on the list\combo
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  setSelection(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   create the items list for choice controls
  /// </summary>
  setItemsList(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Open subform, sets minimum size for the form or subform
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  createLayout(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set true\false\null for check box
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  setCheckBoxCheckState(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set Style 3D
  /// </summary>
  /// <param name = "guiCommand"></param>
  setCheckboxMainStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   will be seen as grey and the user will not park on it
  /// </summary>
  setEnable(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setFormBorderStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set Multiline WordWrap Scroll
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMultilineWordWrapScroll(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   set vertical alignment
  /// </summary>
  /// <param name = "guiCommand"></param>
  setVerticalAlignment(guiCommand: GuiCommand): void {
  }

  setVisible(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set Multiline Vertical Scroll
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMultilineVerticalScroll(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set Multiline
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMultiLine(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set the browser control to a new URI
  /// </summary>
  setUrl(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setFocus(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set LineStyle
  /// </summary>
  /// <param name = "guiCommand"></param>
  setLineStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set LineWidth
  /// </summary>
  /// <param name = "guiCommand"></param>
  setLineWidth(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set LineDirection
  /// </summary>
  /// <param name = "guiCommand"></param>
  setLineDirection(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  setBorderStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set Style 3D
  /// </summary>
  /// <param name = "guiCommand"></param>
  setStyle3D(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Change the Z-Order of the controls by moving one control on the top of another
  /// </summary>
  moveAbove(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   select text in text control
  /// </summary>
  /// <param name = "guiCommand"></param>
  selectText(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  setMinHeight(guiCommand: GuiCommand): void {
  }

/// <summary>
  /// </summary>
  setMinWidth(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set parameter is read only
  /// </summary>
  /// <param name = "guiCommand"></param>
  setReadonly(guiCommand: GuiCommand): void {
  }

  /// <summary></summary>
  setTextSizeLimit(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set IME control mode (JPN: IME support)
  /// </summary>
  /// <param name = "guiCommand"></param>
  setImeMode(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   Sets AcceptsReturn property of Multi Line Text Box according to AllowCR prop
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMultilineAllowCR(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set the border
  /// </summary>
  /// <param name = "guiCommand"></param>
  setBorder(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setHorizontalAlignment(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setImageData(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set password edit
  /// </summary>
  /// <param name = "guiCommand"></param>
  setPasswordEdit(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setRightToLeft(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set setRadioButtonAppearance
  /// </summary>
  /// <param name = "guiCommand"></param>
  setThreeState(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Add controls to a tab control
  /// </summary>
  /// <param name = "guiCommand"></param>
  AddControlsToTab(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   set side property of a tab control
  /// </summary>
  /// <param name = "guiCommand"></param>
  setTabControlSide(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set setMaxBox
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMaxBox(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set setMinBox
  /// </summary>
  /// <param name = "guiCommand"></param>
  setMinBox(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  createForm(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Opens form and sets it's minimum size
  /// </summary>
  /// <param name = "guiCommand"></param>
  InitialFormLayout(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// show form
  /// </summary>
  /// <param name="guiCommand"></param>
  private ShowForm(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  private refreshTmpEditor(guiCommand: GuiCommand): void {
  }

  /// <summary>Calls the start timer function.</summary>
  /// <param name = "guiCommand"></param>
  private startTimer(guiCommand: GuiCommand): void {
  }

  /// <summary>Calls the stop timer function.</summary>
  /// <param name="guiCommand"></param>
  private stopTimer(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Sets hint text
  /// </summary>
  /// <param name="guiCommand"></param>
  private setEditHint(guiCommand: GuiCommand): void {
  }

/// <summary>
  /// Sets hint text color
  /// </summary>
  /// <param name="guiCommand"></param>
  private setEditHintColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   create table's row
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  createTableRow(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   create table's row
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  undoCreateTableRow(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// set visibility of the row
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  SetTableRowVisibility(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set highlighted row background color
  /// </summary
  setRowHighlightBgColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Set highlighted row foreground color
  /// </summary>
  setRowHighlightFgColor(guiCommand: GuiCommand): void {
  }

  setInactiveRowHighlightBgColor(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   Set highlighted row foreground color
  /// </summary>
  setInactiveRowHighlightFgColor(guiCommand: GuiCommand): void {
  }

  setActiveRowHighlightState(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets table's alternating color
  /// </summary>
  setAlternatedColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets table's alternating color
  /// </summary>
  setTitleColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// set title foreground color
  /// </summary>
  /// <param name="guiCommand"></param>
  setTitleFgColor(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setTitleFgColor - Not Implemented Yet");
  }

  /// <summary>
  /// set HottrackColor
  /// </summary>
  /// <param name="guiCommand"></param>
  setHotTrackColor(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setHotTrackColor - Not Implemented Yet");
  }

  /// <summary>
  /// set HottrackFgColor
  /// </summary>
  /// <param name="guiCommand"></param>
  setHotTrackFgColor(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setHotTrackFgColor - Not Implemented Yet");
  }

  /// <summary>
  /// set selected tab color
  /// </summary>
  /// <param name="guiCommand"></param>
  setSelectedTabColor(guiCommand: GuiCommand): void {
    Events.WriteExceptionToLog("setSelectedTabColor - Not Implemented Yet");
  }

  /// <summary>
  /// set selected tab Fg color
  /// </summary>
  /// <param name="guiCommand"></param>
  setSelectedTabFgColor(guiCommand: GuiCommand): void {
    //Events.WriteExceptionToLog("setSelectedTabFgColor - Not Implemented Yet");
  }

  /// <summary>
  /// Sets table column divider color
  /// </summary>
  /// <param name="guiCommand"></param>
  setDividerColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets table's color by property
  /// </summary>
  setColorBy(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   update index of temporary editor due to adding rows in the begining of the table
  /// </summary>
  /// <param name = "guiCommand"></param>
  updateTmpEditorIndex(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the allow resizeable
  /// </summary>
  setResizable(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets row height
  /// </summary>
  /// <param name = "guiCommand"></param>
  setRowHeight(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets title height
  /// </summary>
  /// <param name = "guiCommand"></param>
  setTitleHeight(guiCommand: GuiCommand): void {
  }

  /// <summary> set the bottom position interval of the table </summary>
  /// <param name = "guiCommand"></param>
  setBottomPositionInterval(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the allow moveable
  /// </summary>
  setAllowReorder(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set Table's item's count
  /// </summary>
  /// <param name = "guiCommand"></param>
  private SetTableItemsCount(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set Table's virtual items count
  /// </summary>
  /// <param name = "guiCommand"></param>
  private SetTableVirtualItemsCount(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// set the table vertical scroll's thumb position
  /// </summary>
  /// <param name = "guiCommand"></param>
  private SetVScrollThumbPos(guiCommand: GuiCommand): void {
  }

/// <summary>
  /// set the page size for table's vertical scrollbar
  /// </summary>
  /// <param name = "guiCommand"></param>
  private SetVScrollPageSize(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// set the records before current view
  /// </summary>
  /// <param name = "guiCommand"></param>
  private SetRecordsBeforeCurrentView(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// insert rows into table control
  /// </summary>
  /// <param name="guiCommand"></param>
  private InsertRows(guiCommand: GuiCommand): void {
  }

/// <summary>
  /// remove rows from table control
  /// </summary>
  /// <param name="guiCommand"></param>
  private RemoveRows(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Toggles color for first row when a table has alternate color. Needed while scrolling tables with
  /// limited items
  /// </summary>
  /// <param name="guiCommand"></param>
  private ToggleAlternateColorForFirstRow(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set's table's include first
  /// </summary>
  /// <param name = "guiCommand"></param>
  SetTableIncludesFirst(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets Table Include Last
  /// </summary>
  /// <param name = "guiCommand"></param>
  SetTableIncludesLast(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets table's top index
  /// </summary>
  /// <param name = "guiCommand"></param>
  SetTableTopIndex(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   refresh table
  /// </summary>
  /// <param name = "guiCommand"></param>
  refreshTable(guiCommand: GuiCommand): void {
  }

  /// </summary>
  /// <param name = "guiCommand"></param>
  invalidateTable(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  validateTableRow(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   clear the Sort Mark from all the columns of the table
  /// </summary>
  /// <param name = "guiCommand"></param>
  clearTableColumnsSortMark(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   showScrollbar
  /// </summary>
  /// <param name = "guiCommand"></param>
  showScrollbar(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   showColumnDividers
  /// </summary>
  /// <param name = "guiCommand"></param>
  showColumnDividers(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   showLineDividers
  /// </summary>
  /// <param name = "guiCommand"></param>
  showLineDividers(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   rowHighlitingStyle
  /// </summary>
  /// <param name = "guiCommand"></param>
  rowHighlitingStyle(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the allow moveable
  /// </summary>
  setSortableColumn(guiCommand: GuiCommand): void {
  }

  setFilterableColumn(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the Right border
  /// </summary>
  setColumnRightBorder(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the Top border
  /// </summary>
  setColumnTopBorder(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for column set true\false for the allow moveable
  /// </summary>
  setPlacement(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set original width for column
  /// </summary>
  setOrgWidth(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set start pos for column
  /// </summary>
  setStartPos(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set AccessTest property
  /// </summary>
  /// <param name = "guiCommand"></param>
  setEnvAccessTest(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// save the language
  /// </summary>
  /// <param name="guiCommand"></param>
  setLanguage(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set SpecialTextSizeFactoring property
  /// </summary>
  /// <param name = "guiCommand"></param>
  setSpecialTextSizeFactoring(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set SpecialFlatEditOnClassicTheme property
  /// </summary>
  /// <param name = "guiCommand"></param>
  setSpecialFlatEditOnClassicTheme(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets table seletcion index
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  SetSelectionIndex(guiCommand: GuiCommand): void {
  }

  comboDropDown(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   dispose an object
  /// </summary>
  disposeObject(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set data autowide
  /// </summary>
  /// <param name = "guiCommand">
  /// </param>
  setAutoWide(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   remove the composie controls of the sub form control
  /// </summary>
  /// <param name = "guiCommand"></param>
  removeCompositeControls(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   set true\false on the check box \ radio button
  /// </summary>
  /// <param name = "guiCommand"></param>
  setChecked(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// </summary>
  /// <param name = "guiCommand"></param>
  setWindowState(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   for radio button set number columns in the control
  /// </summary>
  /// <param name = "guiCommand"></param>
  setLayoutNumColumns(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set setRadioButtonAppearance
  /// </summary>
  /// <param name = "guiCommand"></param>
  setRadioButtonAppearance(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  SuspendLayout(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  ResumeLayout(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// suspend paint of the control
  /// </summary>
  /// <param name="guiCommand"></param>
  SuspendPaint(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// resume paint of the control
  /// </summary>
  /// <param name="guiCommand"></param>
  ResumePaint(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set current cursor
  /// </summary>
  private setCurrentCursor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   sets the width of the frames
  /// </summary>
  /// <param name = "guiCommand"></param>
  private setFramesWidth(guiCommand: GuiCommand): void {
  }

/// <summary>
  ///   sets the height of the frames
  /// </summary>
  /// <param name = "guiCommand"></param>
  private setFramesHeight(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   set form property maximized
  /// </summary>
  /// <param name = "guiCommand"></param>
  private setFormMaximized(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   reorder columns
  /// </summary>
  /// <param name = "guiCommand"></param>
  private reorderColumns(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   restore columns
  /// </summary>
  /// <param name = "guiCommand"></param>
  private restoreColumns(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Sets the selection mode of the list box.
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetSelectionMode(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// enable/disable XP themes
  /// </summary>
  /// <param name="guiCommand"></param>
  private EnableXPThemes(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// mark/unmark items in multimark
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetMarkedItemState(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///   Refresh menu actions of a specific form
  /// </summary>
  /// <param name = "guiCommand"></param>
  RefreshMenuActions(guiCommand: GuiCommand): void {
  }

/// <summary> Applies the placement to the specified form. </summary>
  /// <param name="guiCommand"></param>
  private ApplyChildWindowPlacement(guiCommand: GuiCommand): void {
  }

  /// <summary> Set row placement for the table </summary>
  /// <param name="guiCommand"></param>
  private SetRowPlacement(guiCommand: GuiCommand): void {
  }

  /// <summary> Set table's original row height </summary>
  /// <param name="guiCommand"></param>
  private SetTableOrgRowHeight(guiCommand: GuiCommand): void {
  }

  ProcessPressEvent(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set FillTable on TableManager
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetFillWidth(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set Multi Display Column property on Table Manager
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetMultiColumnDisplay(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set Multi Display Column property on Table Manager
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetShowEllipsis(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set TitlePadding on Tab Control
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetTitlePadding(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Set ShouldApplyPlacementToHiddenColumns on TablePlacementManager.
  /// </summary>
  /// <param name="guiCommand"></param>
  private OnSetShouldApplyPlacementToHiddenColumns(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  private OnRecalculateTableColors(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  private OnRecalculateTableFonts(guiCommand: GuiCommand): void {
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="guiCommand"></param>
  private OnSetRowBGColor(guiCommand: GuiCommand): void {
  }

  /// <summary>
  /// Hide or show caret
  /// </summary>
  /// <param name="guiCommand"></param>
  private SetCaret(guiCommand: GuiCommand): void {
  }
}

/// <summary>inner class for the gui command</summary>
export class GuiCommand {
  CommandType: CommandType = 0;
  Bool1: boolean = false;
  Bool3: boolean = false;
  CtrlsList: List<GuiMgControl> = null;
  fileName: string = null;
  height: number = 0;
  intArray: number[] = null;
  intArrayList: List<number[]> = null;
  intList: List<number> = null;
  itemsList: string[] = null;
  layer: number = 0;
  line: number = 0;
  menu: GuiMgMenu = null;
  menuEntry: GuiMenuEntry = null;
  menuStyle: MenuStyle = 0;
  mgColor: MgColor = null;
  mgColor1: MgColor = null;
  mgFont: MgFont = null;
  number: number = 0;
  number1: number = 0;
  number2: number = 0;
  obj: any = null;
  parentObject: any = null;
  obj1: any = null;
  str: string = null;
  stringList: List<string> = null;
  style: number = 0;
  type: Type = null;
  width: number = 0;
  windowType: WindowType = 0;
  x: number = 0;
  y: number = 0;
  userDropFormat: string = null;
  isHelpWindow: boolean = false;
  isParentHelpWindow: boolean = false;
  dockingStyle: DockingStyle = 0;
  listboxSelectionMode: ListboxSelectionMode = 0;
  contextID: string = '\0';
  createInternalFormForMDI: boolean = false;

  constructor(commandType: CommandType);
  constructor(commandType: CommandType, str: string);
  constructor(obj: any, commandType: CommandType);
  constructor(parentObject: any, obj: any, cmmandType: CommandType);
  constructor(commandTypeOrObjOrParentObject: any, strOrCommandTypeOrObj?: any, cmmandType?: CommandType) {
    if (arguments.length === 1 && (commandTypeOrObjOrParentObject === null || commandTypeOrObjOrParentObject.constructor === Number)) {
      this.constructor_0(commandTypeOrObjOrParentObject);
      return;
    }
    if (arguments.length === 2 && (commandTypeOrObjOrParentObject === null || commandTypeOrObjOrParentObject.constructor === Number) && (strOrCommandTypeOrObj === null || strOrCommandTypeOrObj.constructor === String)) {
      this.constructor_1(commandTypeOrObjOrParentObject, strOrCommandTypeOrObj);
      return;
    }
    if (arguments.length === 2 && (commandTypeOrObjOrParentObject === null || commandTypeOrObjOrParentObject.constructor === Object) && (strOrCommandTypeOrObj === null || strOrCommandTypeOrObj.constructor === Number)) {
      this.constructor_2(commandTypeOrObjOrParentObject, strOrCommandTypeOrObj);
      return;
    }
    this.constructor_3(commandTypeOrObjOrParentObject, strOrCommandTypeOrObj, cmmandType);
  }

  /// <summary>
  /// </summary>
  private constructor_0(commandType: CommandType): void {
    this.CommandType = commandType;
    this.contextID = Manager.GetCurrentContextID();
  }

  /// <summary></summary>
  /// <param name = "commandType"></param>
  /// <param name = "str"></param>
  private constructor_1(commandType: CommandType, str: string): void {
    this.constructor_0(commandType);
    this.str = str;
  }

  /// <summary></summary>
  private constructor_2(obj: any, commandType: CommandType): void {
    this.constructor_0(commandType);
    this.obj = obj;
  }

  /// <summary>
  ///   this is my comment
  /// </summary>
  /// <param name = "parentObject">the parent object of the object</param>
  private constructor_3(parentObject: any, obj: any, cmmandType: CommandType): void {
    this.constructor_2(obj, cmmandType);
    this.parentObject = parentObject;
  }

/// <summary>
  /// return true if the command is for showing a modal form
  /// </summary>
  /// <returns></returns>
  IsModalShowFormCommand(): boolean {
    return this.CommandType === CommandType.SHOW_FORM && this.Bool3;
  }

  ToString(): string {
    return "{" + this.CommandType + "}";
  }
}
