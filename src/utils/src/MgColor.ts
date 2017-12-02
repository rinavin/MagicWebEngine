import {MagicSystemColor} from "../index";
import {NString, NNumber, Debug, NumberStyles} from "@magic/mscorelib";


export class MgColor {
  Alpha: number = 0;
  Blue: number = 0;
  Green: number = 0;
  Red: number = 0;
  IsTransparent: boolean = false;
  IsSystemColor: boolean = false;
  SystemColor: MagicSystemColor = 0;

  constructor();
  constructor(alpha: number, red: number, green: number, blue: number, magicSystemColor: MagicSystemColor, isTransparent: boolean);
  constructor(colorStr: string);
  constructor(alphaOrColorStr?: any, red?: number, green?: number, blue?: number, magicSystemColor?: MagicSystemColor, isTransparent?: boolean) {

    if (arguments.length === 0) {
      this.constructor_0();
      return;
    }
    if (arguments.length === 6 && (alphaOrColorStr === null || alphaOrColorStr.constructor === Number) && (red === null || red.constructor === Number) && (green === null || green.constructor === Number) && (blue === null || blue.constructor === Number) && (magicSystemColor === null || magicSystemColor.constructor === Number) && (isTransparent === null || isTransparent.constructor === Boolean)) {
      this.constructor_1(alphaOrColorStr, red, green, blue, magicSystemColor, isTransparent);
      return;
    }
    this.constructor_2(alphaOrColorStr);
  }

  private constructor_0(): void {
    this.Alpha = 255;
    this.Blue = 0;
    this.Green = 0;
    this.Red = 0;
    this.IsTransparent = false;
    this.IsSystemColor = false;
    this.SystemColor = MagicSystemColor.Undefined;
  }

  private constructor_1(alpha: number, red: number, green: number, blue: number, magicSystemColor: MagicSystemColor, isTransparent: boolean): void {
    this.Alpha = alpha;
    this.Red = red;
    this.Green = green;
    this.Blue = blue;
    this.SystemColor = magicSystemColor;
    this.IsTransparent = isTransparent;
    this.IsSystemColor = (this.SystemColor !== MagicSystemColor.Undefined);
  }

  private constructor_2(colorStr: string): void {
    this.SystemColor = MagicSystemColor.Undefined;

    // check if it is a system color
    if (NString.StartsWith(colorStr, "FF")) {
      let hex: string = NString.Substring(colorStr, 0, 8);
      let num: number = -this.hexToInt(hex);


      // sometimes values of colors in magic color table are corrupted
      if (num in MagicSystemColor) {
        this.SystemColor = <MagicSystemColor>num;
      }
      this.IsSystemColor = (this.SystemColor !== MagicSystemColor.Undefined);

      // initialize the rest of the final members
      this.Red = 0;
      this.Green = 0;
      this.Blue = 0;
      this.Alpha = 255;
    }
    else {
      this.Alpha = 255 - NNumber.Parse(NString.Substring(colorStr, 0, 2), NumberStyles.HexNumber);
      this.Blue = NNumber.Parse(NString.Substring(colorStr, 2, 2), NumberStyles.HexNumber);
      this.Green = NNumber.Parse(NString.Substring(colorStr, 4, 2), NumberStyles.HexNumber);
      this.Red = NNumber.Parse(NString.Substring(colorStr, 6, 2), NumberStyles.HexNumber);

      // initialize the rest of the final members
      this.IsSystemColor = false;
    }
    this.IsTransparent = (colorStr.charCodeAt(8) === 89/*'Y'*/);
  }

  /// <summary> As opposed to Integer.parseInt() this method may recieve negative numbers in their two's complement
  /// representation. For example Integer.parseInt() will convert FF to 255 whereas this method will convert
  /// it to -1.
  /// </summary>
  /// <param name="hex">hex number in two's complment representation</param>
  /// <returns> int</returns>

  private hexToInt(hex: string): number {
    Debug.Assert(hex.length <= 8);
    return NNumber.Parse(hex, NumberStyles.HexNumber);
  }
}
