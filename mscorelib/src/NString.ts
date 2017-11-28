import {NotImplementedException} from "./NotImplementedException";

export enum StringComparison {
  CurrentCulture,
  CurrentCultureIgnoreCase,
  InvariantCulture,
  InvariantCultureIgnoreCase,
  Ordinal,
  OrdinalIgnoreCase
}

export class NString {
  static Empty = "";

  constructor(string: string[], startIndex?: number, len?: number)
  constructor(string: string[]) {
    throw new NotImplementedException();
  }

  // TODO : TS string has indexOf(). Use it.
  // TODO : implement for parameter "count"
  static IndexOf(str: string, ch: number): number
  static IndexOf(str: string, ch: number, startIndex: number): number
  static IndexOf(str: string, ch: number, startIndex: number, count: number): number
  static IndexOf(str: string, sub: string): number
  static IndexOf(str: string, sub: string, startIndex: number): number
  static IndexOf(str: string, sub: string, startIndex: number, count: number): number
  static IndexOf(str: string, chOrSub: any, startIndex?: number, count?: number): number {
    var sub: string;
    if (chOrSub.constructor == Number) {
      sub = String.fromCharCode(chOrSub);
    }
    else {
      sub = chOrSub;
    }
    return str.indexOf(sub);
  }

  static IndexOfAny(str: string, subs: string[], startIndex: number, count: number): number {
    for (var i = startIndex; i < count; ++i) {
      var c = str.charAt(i);
      for (var j = 0; j < subs.length; ++j) {
        if (c === subs[j])
          return i;
      }
    }
    return -1;
  }

  static CopyTo(str: string, sourceIndex: number, destination: string[], destinationIndex: number, count: number) {
    throw new NotImplementedException();
  }

  static Compare(strA: string, strB: string, ignoreCase: boolean): number;
  static Compare(strA: string, strB: string, ignoreCase: boolean, indexA: number, indexB: number, length: number): number;
  static Compare(strA: string, strB: string, ignoreCase: boolean, indexA?: number, indexB?: number, length?: number): number {
    if (arguments.length === 3)
      return NString.Compare_0(strA, strB, ignoreCase);
    else
      return NString.Compare_1(strA, strB, ignoreCase, indexA, indexB, length);
  }

  static Compare_0(strA: string, strB: string, ignoreCase: boolean): number {
    throw new NotImplementedException();
  }

  static Compare_1(strA: string, strB: string, ignoreCase: boolean, indexA: number, indexB: number, length: number): number {
    throw new NotImplementedException();
  }

  static GetHashCode(str: string): number {
    var hash = 0, i, l, ch;
    if (str.length === 0) return hash;
    for (i = 0, l = str.length; i < l; i++) {
      ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  static Replace(str: string, pattern: number, replacement: number): string
  static Replace(str: string, pattern: string, replacement: string): string
  static Replace(str: string, pattern: any, replacement: any): string {
    var ps = (pattern.constructor === Number) ? String.fromCharCode(pattern) : pattern;
    var rs = (replacement.constructor === Number) ? String.fromCharCode(replacement) : replacement;
    return str.replace(ps, rs);
  }

  static Substring(str: string, startIndex: number): string
  static Substring(str: string, startIndex: number, length: number): string
  static Substring(str: string, startIndex: number, length: number = -1): string {
    return length < 0 ? str.substr(startIndex) : str.substr(startIndex, length);
  }

  /*static Remove(str: string, startIndex: number): string*/
  static Remove(str: string, startIndex: number, length: number): string {
    if (typeof Number === undefined) {
      return str.substring(startIndex);
    }
    else {
      return str.substring(0, startIndex - 1) + str.substring(startIndex + length);
    }
  }

  /*static Remove(str: string, startIndex: number, length?: number): string
   {
   throw new NotImplementedException(); // do we care that ts->js compiler will get rid of this syntactic sugar?
   }*/
  static Trim(str: string): string
  static Trim(str: string, trimChars: string[]): string
  static Trim(str: string, trimChars?: string[]): string {
    return str.trim();
  }

  static TrimStart(str: string, trimChars: number[] | string): string {
    throw new NotImplementedException();
  }

  static TrimEnd(str: string, trimChars?: string): string
  static TrimEnd(str: string, trimChars: number[]): string
  static TrimEnd(str: string, trimChars: string[]): string
  static TrimEnd(str: string, trimChars: any): string {
    throw new NotImplementedException();
  }

  static ToUpperInvariant(str: string): string {
    return str.toUpperCase();
  }

  static ToLowerInvariant(str: string): string {
    return str.toLowerCase();
  }

  static ToLower(str: string): string {
    return str.toLowerCase();
  }

  static ToUpper(str: string): string {
    return str.toLowerCase();
  }

  static Contains(str: string, sub: string): boolean {
    return str.indexOf(sub) >= 0;
  }

  static StartsWith(str: string, sub: string): boolean
  static StartsWith(str: string, sub: string, comp: StringComparison): boolean
  static StartsWith(str: string, sub: string, comp?: StringComparison): boolean {
    return str.indexOf(sub) === 0;
  }

  static EndsWith(str: string, sub: string): boolean
  static EndsWith(str: string, sub: string, comp: StringComparison): boolean
  static EndsWith(str: string, sub: string, comp?: StringComparison): boolean {
    return str.indexOf(sub) === str.length - sub.length;
  }

  static Format(format: string, arg0: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any): string {
    if (arg0.constructor === Array) {
      var s = format,
        i = arg0.length;
      while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arg0[i]);
      }
      return s;
    }
    else {
      var args = [arg0, arg1, arg2, arg3, arg4, arg5];
      return NString.Format(format, arg0, arg1, arg2, arg3, arg4, arg5);
    }
  }

  static CompareTo(source: string, destination: string): number {
    throw new NotImplementedException;
  }

  static Equals(source: string, destination: string, comparisionType: StringComparison) {
    throw new NotImplementedException;
  }

  static IsNullOrEmpty(str1: string | NString): boolean {
    return !str1;
  }

  static Concat(parts: any[]): string {
    throw new NotImplementedException();
  }

  static FromChars(chars: string[]): string
  static FromChars(ch: string[], count: number, len: number): string
  static FromChars(ch: number, count: number): string
  static FromChars(chars: number[]): string
  static FromChars(chars: string[]): string
  static FromChars(chOrChars: any, count: number = 1): string {
    if (chOrChars.constructor === Number) {
      var r = String.fromCharCode(chOrChars);
      for (var i = 2; i < count; i++) {
        r += String.fromCharCode(chOrChars);
      }
      return r;
    }
    throw new NotImplementedException();
  }

  // TODO : implement
  static CompareOrdinal(strA: string, strB: string): number {
    return 0;
  }

  static Split(text: string, ...params: any[]): any[]
  static Split(text: string, ...params: any[]): NString[] | string[] {
    throw new NotImplementedException();
  }

  // TODO : implement
  static ToCharArray(str: string): string[]
  static ToCharArray(str: string): number[]
  static ToCharArray(str: string): any[] {
    throw new NotImplementedException();
  }

  static PadRight(source: string, length: number, filler: string): string
  static PadRight(source: string, length: number): string
  static PadRight(source: string, length: number, filler?: string): string {
    throw new NotImplementedException();
  }

  // static Set(str: string, index: number, ch: string): string {
  //   if (index >= str.length)
  //     throw new IndexOutOfRangeException();
  //
  //   return (NString.Substring(str, 0, index) + ch + NString.Substring(str, index + 1, str.length - (index + 1)));
  // }

  static Insert(str: string, index: number, ch: string): string {
      return (NString.Substring(str, 0, index) + ch + NString.Substring(str, index, str.length - index));
  }
}
