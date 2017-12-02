import {Debug, RefParam} from "@magic/mscorelib";
import {JSON_Utils, MagicSystemColor, MgArrayList, MgColor, XMLConstants} from "@magic/utils";
import {Manager} from "../Manager";

// color represented in 9 bytes: first 8 for color hex representation, and 1 byte Y/N for transparency
const COLOR_LENGTH: number = 9;

/// <summary> data for <colortable value=...></summary>
export class ColorsTable {
  // TODO : ID is not used anywhere. Consider not sending it from server
  private ID: number = 0;
  private readonly _colors: MgArrayList<string> = null;
  private readonly _bgColors: MgArrayList<MgColor> = null;
  private readonly _fgColors: MgArrayList<MgColor> = null;

  /// <summary>
  /// Get the total number if color items present in the color table.
  /// </summary>
  get Count(): number {
    return this._colors.Count;
  }

  /// <summary> CTOR </summary>
  constructor() {
    this._colors = new MgArrayList();
    this._bgColors = new MgArrayList();
    this._fgColors = new MgArrayList();
  }

  /// <summary> get BackGround color</summary>
  /// <param name="idx">index of the color</param>
  /// <returns> String BackGround color in __RRGGBB format</returns>
  private getBgStr(idx: number, isDefaultColor: RefParam<boolean>): string {
    let BGcolor: string = this.getColorStr(idx, COLOR_LENGTH);

    if (BGcolor === null) {
      let defIdx: number = Manager.Environment.GetDefaultColor();
      if (idx === defIdx)
        BGcolor = "000000000N";
      else
        BGcolor = this.getBgStr(defIdx, isDefaultColor);

      isDefaultColor.value = true;
    }
    else {
      isDefaultColor.value = false;
    }

    return BGcolor;
  }

  /// <summary> Retruns the background Color object</summary>
  /// <param name="idx">index of the color</param>
  /// <returns> MgColor object that represents the background color</returns>
  getBGColor(idx: number): MgColor {
    let mgColor: MgColor = null;

    Debug.Assert(idx > 0);

    if (idx < this._bgColors.Count)
      mgColor = this._bgColors[idx];

    if (mgColor == null) {
      let isDefaultColor: RefParam<boolean> = new RefParam<boolean>(false);
      let colorStr: string = this.getBgStr(idx, isDefaultColor);
      mgColor = new MgColor(colorStr);

      // If default color is used then no need to add it in bgColor table.
      if (!isDefaultColor.value) {
        if (idx >= this._bgColors.Count)
          this._bgColors.SetSize(idx + 1);
        this._bgColors[idx] = mgColor;
      }
    }

    return mgColor;
  }

  /// <summary> Retruns the background Color object</summary>
  /// <param name="idx">index of the color</param>
  /// <returns> MgColor object that represents the background color</returns>
  getFGColor(idx: number): MgColor {
    let mgColor: MgColor = null;

    Debug.Assert(idx > 0);

    if (idx < this._fgColors.Count)
      mgColor = this._fgColors[idx];

    if (mgColor == null)
    {
      let isDefaultColor: RefParam<boolean> = new RefParam<boolean>(false);
      let colorStr: string = this.getFgStr(idx, isDefaultColor);
      mgColor = new MgColor(colorStr);

      // If default color is used then no need to add it in bgColor table.
      if (!isDefaultColor.value)
      {
        if (idx >= this._fgColors.Count)
          this._fgColors.SetSize(idx + 1);
        this._fgColors[idx] = mgColor;
      }
    }

    return mgColor;
  }

  /// <summary>
  /// get Foreground color string
  /// </summary>
  /// <param name="idx">index of the color</param>
  /// <returns> String Foreground color in __RRGGBB format</returns>
  private getFgStr(idx: number, isDefaultColor: RefParam<boolean>): string {
    let fGcolor: string = this.getColorStr(idx, 0);
    if (fGcolor === null) {
      let defIdx: number = Manager.Environment.GetDefaultColor();
      if (idx === defIdx)
        fGcolor = "00FFFFFF  N";
      else
        fGcolor = this.getFgStr(defIdx, isDefaultColor);

      isDefaultColor.value = true;
    }
    else {
      isDefaultColor.value = false;
    }

    return fGcolor;
  }

  /// <summary>
  /// get FG or BG color
  /// </summary>
  /// <param name="start">index of the color</param>
  /// <returns> String color in RRGGBB format</returns>
  private getColorStr(index: number, start: number): string {
    let colorStr: string = null;
    let end: number = start + COLOR_LENGTH;

    if (index > 0 && index < this._colors.Count) {
      colorStr = this._colors[index].substr(start, end - start);
    }

    return colorStr;
  }

  FillFrom(colorxml: string): void {

    // Clear the color's table before filling in new values.
    this._colors.Clear();
    this._bgColors.Clear();
    this._fgColors.Clear();

    if (colorxml !== null)
      JSON_Utils.JSONFromXML(colorxml, this.FillFromJSON);
  }

  private FillFromJSON (error, result): void {

    // If there was an error in parsing the XML,
    if (error != null) {
      throw error;
    }

    let index: number = 0;
    let colorStr: string = "";

    this.ID = result.colortable['$'][XMLConstants.MG_TAG_COLORTABLE_ID];

    let colorElements = result[XMLConstants.MG_TAG_COLORTABLE][XMLConstants.MG_TAG_COLOR_ENTRY];

    this._colors.SetSize(colorElements.length);

    for (let i = 0; i < colorElements.length; i++) {
      let colorElement: {id: string, val: string} = colorElements[i]['$'];

      index = +colorElement.id;
      colorStr = colorElement.val;

      this._colors[index] = colorStr;
    }
  }

  /// <summary>
  /// change the values on the color in the specified index
  /// </summary>
  /// <param name="index"></param>
  /// <param name="foreColor"></param>
  /// <param name="backColor"></param>
  /// <returns></returns>
  SetColor(index: number, foreColor: number, backColor: number): boolean {
    if (index === 0 || index > this.Count)
      return false;

    let alpha: number = (foreColor >> 24) & 0x000000FF;
    let red: number = (foreColor >> 16) & 0x000000FF;
    let green: number = (foreColor >> 8) & 0x000000FF;
    let blue: number = foreColor & 0x000000FF;

    if (index >= this._fgColors.Count)
      this._fgColors.SetSize(index + 1);
    this._fgColors[index] = new MgColor(alpha, red, green, blue, MagicSystemColor.Undefined, false);

    alpha = (backColor >> 24) & 0x000000FF;
    red = (backColor >> 16) & 0x000000FF;
    green = (backColor >> 8) & 0x000000FF;
    blue = backColor & 0x000000FF;

    if (index >= this._bgColors.Count)
      this._bgColors.SetSize(index + 1);
    this._bgColors[index] = new MgColor(alpha, red, green, blue, MagicSystemColor.Undefined, false);

    return true;
  }
}
