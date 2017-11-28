import {FontAttributes} from "../index";
import {NObject, NString} from "@magic/mscorelib";

export class MgFont extends NObject{
  private static PRIME_NUMBER: number = 37;
  private static SEED: number = 23;
  Index: number = 0;
  TypeFace: string = null;
  Height: number = 0;
  Style: FontAttributes = 0;
  Orientation: number = 0;
  CharSet: number = 0;

  /// <summary>
  /// Return if font style is bold.
  /// </summary>
  get Bold(): boolean {
    return (this.Style & FontAttributes.FontAttributeBold) > <FontAttributes>0;
  }

  /// <summary>
  /// Return if font style is italic.
  /// </summary>
  get Italic(): boolean {
    return (this.Style & FontAttributes.FontAttributeItalic) > <FontAttributes>0;
  }

  /// <summary>
  /// Return if font style is strike through.
  /// </summary>
  get Strikethrough(): boolean {
    return (this.Style & FontAttributes.FontAttributeStrikethrough) > <FontAttributes>0;
  }

  /// <summary>
  /// Return if font style is underline.
  /// </summary>
  get Underline(): boolean {
    return (this.Style & FontAttributes.FontAttributeUnderline) > <FontAttributes>0;
  }

  constructor(index: number, typeFace: string, height: number, style: FontAttributes, orientation: number, charSet: number);
  constructor(fromMgFont: MgFont);
  constructor(indexOrFromMgFont: any, typeFace?: string, height?: number, style?: FontAttributes, orientation?: number, charSet?: number) {
    super();
    if (arguments.length === 6 && (indexOrFromMgFont === null || indexOrFromMgFont.constructor === Number) && (typeFace === null || typeFace.constructor === String) && (height === null || height.constructor === Number) && (style === null || style.constructor === Number) && (orientation === null || orientation.constructor === Number) && (charSet === null || charSet.constructor === Number)) {
      this.constructor_0(indexOrFromMgFont, typeFace, height, style, orientation, charSet);
      return;
    }
    this.constructor_1(indexOrFromMgFont);
  }

  private constructor_0(index: number, typeFace: string, height: number, style: FontAttributes, orientation: number, charSet: number): void {
    this.Index = index;
    this.TypeFace = typeFace;
    this.Height = height;
    this.Style = style;
    this.Orientation = orientation;
    this.CharSet = charSet;
  }

  /// <summary>
  /// copy constructor
  /// </summary>
  /// <param name="fromMgFont"></param>
  private constructor_1(fromMgFont: MgFont): void {
    this.Index = fromMgFont.Index;
    this.Height = fromMgFont.Height;
    this.Style = fromMgFont.Style;
    this.TypeFace = fromMgFont.TypeFace;
    this.Orientation = fromMgFont.Orientation;
    this.CharSet = fromMgFont.CharSet;
  }

  /// <summary>
  /// add style to font
  /// </summary>
  /// <param name="fontStyle"></param>
  addStyle(fontStyle: FontAttributes): void {
    this.Style = (this.Style | fontStyle);
  }

  /// <summary>
  /// change the values of this font
  /// </summary>
  /// <param name="typeFace"></param>
  /// <param name="height"></param>
  /// <param name="style"></param>
  /// <param name="orientation"></param>
  SetValues(typeFace: string, height: number, style: FontAttributes, orientation: number, charSet: number): void {
    let text: string = NString.Trim(typeFace);

    if (!NString.IsNullOrEmpty(text)) {
      this.TypeFace = text;
    }
    this.Height = height;
    this.Style = style;
    this.Orientation = orientation;
    this.CharSet = charSet;
  }

  /// <summary>
  /// </summary>
  /// <returns></returns>
  GetHashCode(): number {
    let num: number = 23;
    num = 37 * num + ((this.TypeFace !== null) ? NString.GetHashCode(this.TypeFace) : 0);
    num = 37 * num + this.Height;
    num = <number>(37 * num + this.Style);
    num = 37 * num + this.Orientation;
    return 37 * num + this.CharSet;
  }

  /// <summary>
  /// </summary>
  /// <param name="obj"></param>
  /// <returns></returns>
  Equals(obj: any): boolean {
    let result: boolean;
    if (obj !== null && obj instanceof MgFont) {
      let mgFont: MgFont = <MgFont>obj;

      if (this === mgFont) {
        result = true;
        return result;
      }
      if (this.Height === mgFont.Height && this.Style === mgFont.Style && this.Orientation === mgFont.Orientation &&
          ((this.TypeFace === null && mgFont.TypeFace === null) || this.TypeFace === mgFont.TypeFace) && this.CharSet === mgFont.CharSet) {
        result = true;
        return result;
      }
    }
    result = false;
    return result;
  }
}
