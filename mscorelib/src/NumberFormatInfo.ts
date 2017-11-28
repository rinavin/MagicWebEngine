import {NObject} from "./NObject";

export class NumberFormatInfo extends NObject {
  NumberDecimalSeparator: string = ".";
  NumberGroupSeparator: string = ",";
  NegativeSign: string;
  static CurrentInfo: NumberFormatInfo;

  Clone(): NumberFormatInfo {
    // TODO : implementation
    return new NumberFormatInfo();
  }
}
