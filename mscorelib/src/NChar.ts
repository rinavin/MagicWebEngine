import {NotImplementedException} from "./NotImplementedException";

export class NChar {
  static IsWhiteSpace(ch: number): boolean {
    return ch === 32 || (ch >= 9 && ch <= 13) || ch === 133 || ch === 160;
  }

  // static IsLetter(ch: number): boolean
  // {
  //   return (65 <= ch && ch <=  90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
  // }
  static IsLetterOrDigit(ch: number): boolean {
    return (48 <= ch && ch <= 57) || (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160);
  }

  static IsDigit(str: string, index?: number): boolean {
    if (arguments.length === 1) {
      index = 0;
    }

    let ch = str.charCodeAt(index);
    return 48 <= ch && ch <= 57;
  }

  static IsLetter(ltr: any): boolean {
    if (ltr.constructor === Number) {
      return (65 <= ltr && ltr <= 90) || (97 <= ltr && ltr <= 122) || (ltr >= 128 && ltr !== 133 && ltr !== 160);
    }
    else {
      return ltr.length === 1 && ltr.match(/[a-z]/i);
    }
  }

  static IsLower(ch: string): boolean {
    let tmpChar = ch.charCodeAt(0);
    return 97 <= tmpChar && tmpChar <= 122;
  }

  static IsUpper(ch: string): boolean {
    let tmpChar = ch.charCodeAt(0);
    return 65 <= tmpChar && tmpChar <= 90;
  }

  static ToUpper(ch: string): string {
    // TODO :
    throw new NotImplementedException();
  }

  static ToLower(ch: string): string {
    // TODO :
    throw new NotImplementedException();
  }
}
