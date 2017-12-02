import {GuiInteractive} from "./GuiInteractive";
import {Type} from "@magic/mscorelib";

/// <summary>
///   Creates dialog for passed type of object by calling objects constructor matching the parameters
/// </summary>
/// <param name = "objType">type of object whose constructor to be invoked</param>
/// <param name = "parameters">parameters to be passed to objects constructor</param>
export class DialogHandler {
  createDialog(objType: Type, parameters: any[]): void {
    // always execute dialog creation code in GUI thread
    let guiInteractive: GuiInteractive = new GuiInteractive();
    guiInteractive.createDialog(this, objType, parameters);
  }

  /// <summary>
  ///   dispose(and close) the dialog
  /// </summary>
  closeDialog(): void {
  }

  constructor() {
  }
}
