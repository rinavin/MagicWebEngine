import {Hashtable, NObject} from "@magic/mscorelib";
import {GuiMgForm} from "./GuiMgForm";
import {MenuStyle} from "../GuiEnums";
import {MenuReference} from "./low/MenuReference";

export class GuiMgMenu extends NObject {
  instantiatedContext: Hashtable<GuiMgForm, MenuReference> = null;
  instantiatedPullDown: Hashtable<GuiMgForm, MenuReference> = null;

  constructor() {
    super();
    this.init();
  }

  init(): void {
    this.instantiatedPullDown = new Hashtable<GuiMgForm, MenuReference>();
    this.instantiatedContext = new Hashtable<GuiMgForm, MenuReference>();
  }

  /// <summary> This method updates a menu as instantiated for a specific form and style. It returns a reference to a
  /// menu object - to be used in order to retrieve this menu object, if it is needed. The returned object
  /// should be placed in the controlsMap, with the created menu for future use
  ///
  /// </summary>
  /// <param name="form">the form for which the menus is instantiated</param>
  /// <param name="menuStyle">the menu style (pulldown, context)</param>
  /// <returns> menu reference object</returns>
  setMenuIsInstantiated(form: GuiMgForm, menuStyle: MenuStyle): MenuReference {
    let menuReference: MenuReference = new MenuReference(form);
    if (menuStyle === MenuStyle.MENU_STYLE_PULLDOWN) {
      this.instantiatedPullDown.set_Item(form, menuReference);
    }
    else {
      this.instantiatedContext.set_Item(form, menuReference);
    }
    return menuReference;
  }

  /// <summary> This method returns a menu object reference for a specific form and menu style (pulldown, context). The
  /// returned reference should be used in order to retrieve the specific instantiated menu object from the
  /// controls map.</summary>
  /// <param name="form">the form for which the menus is instatiated</param>
  /// <param name="menuStyle">the menu style (pulldown, context)</param>
  /// <returns> a menu object reference. In case the menu was not yet instantiated for the specfic form and
  /// style, null is returned.
  /// </returns>
  getInstantiatedMenu(form: GuiMgForm, menuStyle: MenuStyle): MenuReference {
    let menuReference: MenuReference;
    if (menuStyle === MenuStyle.MENU_STYLE_PULLDOWN) {
      menuReference = <MenuReference>this.instantiatedPullDown.get_Item(form);
    }
    else {
      menuReference = <MenuReference>this.instantiatedContext.get_Item(form);
    }
    return menuReference;
  }

  /// <summary> This method removes an instantiated menu from the list</summary>
  /// <param name="form">the form for which the menus is instantiated</param>
  /// <param name="menuStyle">the menu style (pulldown, context)</param>
  /// <returns> menu reference object</returns>
  removeInstantiatedMenu(form: GuiMgForm, menuStyle: MenuStyle): void {
    if (menuStyle === MenuStyle.MENU_STYLE_PULLDOWN) {
      this.instantiatedPullDown.Remove(form);
    }
    else {
      this.instantiatedContext.Remove(form);
    }
  }
}
