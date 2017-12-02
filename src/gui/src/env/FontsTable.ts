import {FontAttributes, JSON_Utils, MgFont, XMLConstants} from "@magic/utils";
import {List} from "@magic/mscorelib";

/// <summary>
///   data for <fonttable value = ...>
/// </summary>
export class FontsTable {
  private _defaultFont: MgFont = null;
  private _fontTable: List<MgFont> = null;

  /// <summary>
  ///   CTOR
  /// </summary>
  constructor() {
    this._fontTable = new List<MgFont>();
    this._defaultFont = new MgFont(0, "MS Sans Serif", 8, <FontAttributes>0, 0, 0);
  }

  /// <summary>
  ///   get font
  /// </summary>
  /// <param name = "idx">index of the font</param>
  getFont(idx: number): MgFont {

    let mgFont: MgFont;

    if (idx < 1 || idx > this._fontTable.Count)
      mgFont = this._defaultFont;
    else
      mgFont = this._fontTable[idx - 1];

    return mgFont;
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="fontxml"></param>
  FillFrom(fontxml: string): void {

    // Clear the font's table before filling in new values.
    this._fontTable.Clear();

    if (fontxml !== null) {
      JSON_Utils.JSONFromXML(fontxml, this.FillFromJSON);
    }

  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="error"></param>
  /// <param name="result"></param>
  private FillFromJSON (error, result): void {

    // If there was an error in parsing the XML,
    if (error != null) {
      throw(error);
    }

    let styleName: string;
    let index: number = 0;
    let height: number = 0;
    let style: FontAttributes = 0;
    let typeFace: string = null;
    let charSet: number = 0;
    let orientation: number = 0;

    let fontElements = result[XMLConstants.MG_TAG_FONTTABLE][XMLConstants.MG_TAG_FONT_ENTRY];


    for (let i = 0; i < fontElements.length; i++) {
      let fontElement: { id: string, typeFace: string, height: string, style: string, orientation: string, charSet: string } = fontElements[i]['$'];

      index = +fontElement.id;
      height = +fontElement.height;
      typeFace = fontElement.typeFace;
      charSet = +fontElement.charSet;

      styleName = fontElement.style;
      if (styleName.indexOf('B') > -1) // Check if styleName contains "B"
        style |= FontAttributes.FontAttributeBold;
      if (styleName.indexOf('I') > -1) // Check if styleName contains "I"
        style |= FontAttributes.FontAttributeItalic;
      if (styleName.indexOf('U') > -1) // Check if styleName contains "U"
        style |= FontAttributes.FontAttributeUnderline;
      if (styleName.indexOf('S') > -1) // Check if styleName contains "S"
        style |= FontAttributes.FontAttributeStrikethrough;

      orientation = +fontElement.orientation;

      let font: MgFont = new MgFont(index, typeFace, height, style, orientation, charSet);

      this._fontTable.Add(font);
    }
  }

  /// <summary>
  /// change the values on the font in the specified index
  /// </summary>
  /// <param name="index"></param>
  /// <param name="fontName"></param>
  /// <param name="size"></param>
  /// <param name="scriptCode"></param>
  /// <param name="orientation"></param>
  /// <param name="bold"></param>
  /// <param name="italic"></param>
  /// <param name="strike"></param>
  /// <param name="underline"></param>
  /// <returns></returns>
  SetFont(index: number, fontName: string, size: number, scriptCode: number, orientation: number, bold: boolean, italic: boolean, strike: boolean, underline: boolean): boolean {
    if (index === 0 || index > this._fontTable.Count)
      return false;

    let fontAttributes: FontAttributes = 0;
    if (bold)
      fontAttributes |= FontAttributes.FontAttributeBold;

    if (italic)
      fontAttributes |= FontAttributes.FontAttributeItalic;

    if (strike)
      fontAttributes |= FontAttributes.FontAttributeStrikethrough;

    if (underline)
      fontAttributes |= FontAttributes.FontAttributeUnderline;

    this._fontTable[index - 1].SetValues(fontName, size, fontAttributes, orientation, scriptCode);

    return true;
  }
}
