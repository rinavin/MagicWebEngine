import {List, NString, RefParam, StringBuilder} from "@magic/mscorelib";
import {UtilStrByteMode} from "./UtilStrByteMode";
import {Rtf} from "./Rtf";

const HTML_BACKSLASH: string = "&#092;";
const HTML_COMMA: string = "&#044;";
const HTML_HYPHEN: string = "&#045;";
const STR_2_HTML: number = 1;
export const SEQ_2_HTML: number = 2;
export const HTML_2_STR: number = 3;
const HTML_2_SEQ: number = 4;
export const SEQ_2_STR: number = 5;

export class StrUtil {
  private static _paddingSpaces: string = null;

  /// <summary> trim the end of the string</summary>
  static mem_trim(str: string, len: number): number {
    let result: number;
    if (len > 0) {
      if (len > str.length) {
        result = -1;
        return result;
      }
      while (len > 0 && str[len - 1] === ' ') {
        len = len - 1;
      }
    }
    result = len;
    return result;
  }

  static memmove(dest: string, destCount: number, src: string, srcCount: number, len: number): string {
    let stringBuilder: StringBuilder = new StringBuilder(dest.length + len);
    if (UtilStrByteMode.isLocaleDefLangJPN() && dest.length < destCount) {
      stringBuilder.Append(NString.FromChars(32, destCount));
    }
    else {
      stringBuilder.Append(NString.Substring(dest, 0, destCount));
    }
    stringBuilder.Append(NString.Substring(src, srcCount, len));

    if (stringBuilder.Length < dest.length) {
        stringBuilder.Append(dest.substr(stringBuilder.Length));
    }
    return stringBuilder.ToString();
  }

  static memcpy(dest: string, destCount: number, src: string, scrCount: number, count: number): string;
  static memcpy(dest: string[], destCount: number, src: string[], srcCount: number, count: number): void;
  static memcpy(dest: any, destCount: number, src: any, scrCountOrSrcCount: number, count: number): string {
    if (arguments.length === 5 && (dest === null || dest.constructor === String) && (destCount === null || destCount.constructor === Number) && (src === null || src.constructor === String) && (scrCountOrSrcCount === null || scrCountOrSrcCount.constructor === Number) && (count === null || count.constructor === Number)) {
      return StrUtil.memcpy_0(dest, destCount, src, scrCountOrSrcCount, count);
    }
    StrUtil.memcpy_1(dest, destCount, src, scrCountOrSrcCount, count);
  }

  /// <summary>
  ///   copy part of string into another string, like memcpy of C, but 4 string only
  /// </summary>
  /// <param name = "dest">string</param>
  /// <param name = "destCount">of counter start from in destignation string</param>
  /// <param name = "src">string</param>
  /// <param name = "scrCount">of counter start from in source string</param>
  /// <param name = "count"></param>
  /// <returns> new value of destignation string</returns>
  private static memcpy_0(dest: string, destCount: number, src: string, scrCount: number, count: number): string {
    let stringBuilder: StringBuilder = new StringBuilder(NString.Substring(dest, 0, destCount));

    if (scrCount + count < src.length) {
      stringBuilder.Append(NString.Substring(src, scrCount, count - scrCount));
    }
    else {
      stringBuilder.Append(NString.Substring(src, scrCount));
    }
    let size: number = dest.length - destCount - count;
    if (size > 0) {
      stringBuilder.Append(NString.Substring(dest, destCount + count));
    }
    return stringBuilder.ToString();
  }

  private static memcpy_1(dest: string[], destCount: number, src: string[], srcCount: number, count: number): void {
    while (count > 0 && destCount < dest.length && srcCount < src.length) {
      dest[destCount++] = src[srcCount++];
      count = count - 1;
    }
  }

  static memset(dest: string, destCount: number, inVal: string, counter: number): string;
  static memset(dest: string[], destCount: number, inVal: string, counter: number): void;
  static memset(dest: any, destCount: number, inVal: string, counter: number): string {
    if (arguments.length === 4 && (dest === null || dest.constructor === String) && (destCount === null || destCount.constructor === Number) && (inVal === null || inVal.constructor === Number) && (counter === null || counter.constructor === Number)) {
      return StrUtil.memset_0(dest, destCount, inVal, counter);
    }
    StrUtil.memset_1(dest, destCount, inVal, counter);
  }

  /// <summary>
  ///   insert to string chars n times
  /// </summary>
  /// <param name = "dest">string</param>
  /// <param name = "destCount">of counter start from in destignation string to start insertion of char from</param>
  /// <param name = "inVal">2 insert</param>
  /// <param name = "counter">- number of times to insert the char</param>
  /// <returns> new value of destignation string</returns>
  private static memset_0(dest: string, destCount: number, inVal: string, counter: number): string {
    let first: StringBuilder = new StringBuilder(NString.Substring(dest, 0, destCount));
    while (counter > 0) {
      first.Append(inVal);
      counter = counter - 1;
    }

    if (first.Length < dest.length) {
      first.Append(NString.Substring(dest, first.Length));
    }
    return first.ToString();
  }

  private static memset_1(dest: string[], destCount: number, inVal: string, counter: number): void {
    while (counter > 0 && destCount < dest.length) {
      dest[destCount++] = inVal;
      counter = counter - 1;
    }
  }

  static strstr(str: string, substr: string): string {
    let from: number = NString.IndexOf(str, substr);
    let result: string;
    if (from < 0) {
      result = null;
    }
    else {
      result = NString.Substring(str, from);
    }
    return result;
  }

  /*******************************/
  /// <summary>
  /// Reverses string values.
  /// </summary>
  /// <param name="text">The StringBuilder object containing the string to be reversed.</param>
  /// <returns>The reversed string contained in a StringBuilder object.</returns>
  static ReverseString(text: StringBuilder): StringBuilder {
    // TODO: use string.Reverse()
    let array: string[] = NString.ToCharArray(text.ToString());
    array.reverse();
    return new StringBuilder(NString.FromChars(array));
  }

  /// <summary> remove spaces from the right side of string</summary>
  /// <param name="str">the string to trim
  /// </param>
  static rtrim(str: string): string {
    return StrUtil.rtrimWithNull(str, false);
  }

  /// <summary> remove spaces and/or Null chars from the right side of string</summary>
  /// <param name="str">the string to trim
  /// </param>
  /// <param name="trimNullChars">Whether to remove NULL characters or not
  /// </param>
  static rtrimWithNull(str: string, trimNullChars: boolean): string {
    let result: string;
    if (str === null || str.length === 0) {
      result = str;
    }
    else {
      let idx: number = str.length - 1;
      if (trimNullChars) {

        while (idx >= 0 && (str[idx] === ' ' || str[idx] === String.fromCharCode(0)/*' '*/)) {
          idx = idx - 1;
        }
      }
      else {
        while (idx >= 0 && str[idx] === ' ') {
          idx = idx - 1;
        }
      }
      idx = idx + 1;

      if (idx < str.length) {
        result = NString.Substring(str, 0, idx);
      }
      else {
        result = str;
      }
    }
    return result;
  }

  /// <summary> remove spaces from the left side of string</summary>
  /// <param name="str">the string to trim
  /// </param>
  static ltrim(str: string): string {
    let length: number = str.length;
    let i: number = 0;
    let result: string;
    if (str === null || length === 0) {
      result = str;
    }
    else {
      while (i < length && str[i] === ' '/*' '*/) {
        i = i + 1;
      }

      if (i > 0) {
        str = NString.Substring(str, i);
      }
      result = str;
    }
    return result;
  }

  /// <summary>This function for Deleting String from end & start of input
  /// String
  /// </summary>
  /// <param name="str">String , which can include strToDelete spaces on input
  /// </param>
  /// <param name="strToDelete">need delete this String from start/end of str.
  /// </param>
  /// <returns> String without strToDelete on end & start,
  /// or 'null' if Sting hasn't not  characters inside
  /// </returns>
  static DeleteStringsFromEnds(str: string, strToDelete: string): string {
    if (NString.StartsWith(str, strToDelete)) {
      str = NString.Substring(str, strToDelete.length);
    }
    if (NString.EndsWith(str, strToDelete)) {
      str = NString.Substring(str, 0, str.length - strToDelete.length);
    }
    let result: string;
    if (str.length === 0) {
      result = null;
    }
    else {
      result = str;
    }
    return result;
  }

  /// <summary> pad a string with trailing spaces up to the given length</summary>
  /// <param name="str">the string to pad
  /// </param>
  /// <param name="len">the expected length after padding
  /// </param>
  static padStr(str: string, len: number): string {
    let padLen: number = len - str.length;

    if (padLen > 0) {
      if (StrUtil._paddingSpaces === null || StrUtil._paddingSpaces.length < padLen) {
        StrUtil._paddingSpaces = NString.FromChars(32, padLen);
      }
      let stringBuilder: StringBuilder = new StringBuilder(len);
      stringBuilder.Append(str);
      stringBuilder.Append(StrUtil._paddingSpaces, 0, padLen);
      str = stringBuilder.ToString();
    }
    return str;
  }

  /// <summary> this method will serve as a string tokenizer instead of using the c# split method
  /// since there are diffrences btween java tokenizer and c# split
  /// the implimentation given by the conversion tool is not Sufficient
  /// </summary>
  /// <param name="source">- the source string to be converted
  /// </param>
  /// <param name="delim">- the string of delimiters used to split the string (each character in the String is a delimiter
  /// </param>
  /// <returns> array of token according which is the same as string tokenizer in java
  /// </returns>
  static tokenize(source: string, delim: string): string[] {
    // It is mentioned in the comment that we should not use String.Split()
    // because its behavior is different than Java's tokenizer.
    // So, we were suppose to use our own implementation (the commented code below).
    // But all these years, we were calling XmlParser.getToken() which was actually
    // using String.Split(). And we didn't face any problem.
    // So, it seems that we do not have problem in using String.Split().
    // But now, we can improve the performance here...
    // XmlParser.getTokens() was getting a String[] using String.Split().
    // It was then creating a List<String> from this String[] and was returning it to
    // tokenize().
    // tokenize() was again converting this List<String> back to String[].
    // So why not call String.Split() directly?
    return NString.Split(source, NString.ToCharArray(delim));
    /*
String [] tokens = null;

char [] delimArry = delim.toCharArray();

//since java discards delimiters from the start and end of the string and c# does not
//we need to remove them manually
//       source = source.TrimEnd(delimArry);
//     source = source.TrimStart(delimArry);
source = source.trim();

//now that we have remove starting and ending delimiters we can split
tokens = source.Split(delimArry);

/*
* only one problem: if we have two Subsequent delimiters for example :
* the delimiter is ';' and the string is: "first;;second;third"
* then in java String tokenizer will give us only 3 tokens :first,second and third
* while is c# split wethod will return 4 tokens: first,empty string,second and third
* we need to deal with that
*/
    /*
    List res  = new List();
    for (int i = 0 ; i < tokens.length; i++)
    {
    if (tokens[i] != "" )
    res.addItem(tokens[i]);
    }

    return (String [])(res.getAllItems (String.class));*/


  }

  /// <summary>
  ///   translate from string to hexa dump char by char
  /// </summary>
  /// <param name = "string">to translate it to the byte stream</param>
  /// <param name = "minLength">the minimal length of hexa digits for each char</param>
  /// <returns> the byte stream in form of string</returns>
  static stringToHexaDump(str: string, minLength: number): string {
    let stringBuilder: StringBuilder = new StringBuilder(str.length * minLength);
    for (let indx: number = 0; indx < str.length; indx = indx + 1) {
      let currInt: number = str.charCodeAt(indx);
      let hexStr: string = currInt.toString(16);
      while (hexStr.length < minLength) {
        hexStr = "0" + hexStr;
      }
      stringBuilder.Append(hexStr);
    }
    return stringBuilder.ToString().toUpperCase();
  }

  static searchAndReplace(str: string, from: string, to: string): string;
  static searchAndReplace(str: string, from: string[], to: string[]): string;
  static searchAndReplace(str: string, from: any, to: any): string {
    if (arguments.length === 3 && (str === null || str.constructor === String) && (from === null || from.constructor === String) && (to === null || to.constructor === String)) {
      return StrUtil.searchAndReplace_0(str, from, to);
    }
    return StrUtil.searchAndReplace_1(str, from, to);
  }

  /// <summary> replace every appearance of 'from' in 'str' with 'to'</summary>
  /// <param name="str">the working base source string </param>
  /// <param name="from">the string to replace </param>
  /// <param name="to">the string use instead 'from' </param>
  /// <returns> modified String </returns>
  private static searchAndReplace_0(str: string, from: string, to: string): string {
    let lastSubStr: number = 0;
    let startSubStr: number;
    let result: string;

    if ((startSubStr = NString.IndexOf(str, from)) === -1) {
      result = str;
    }
    else {
      let stringBuilder: StringBuilder = new StringBuilder(str.length);
      while (startSubStr !== -1) {
        stringBuilder.Append(NString.Substring(str, lastSubStr, startSubStr - lastSubStr) + to);
        startSubStr = startSubStr + from.length;
        lastSubStr = startSubStr;
        startSubStr = NString.IndexOf(str, from, lastSubStr);
      }
      stringBuilder.Append(NString.Substring(str, lastSubStr));
      result = stringBuilder.ToString();
    }
    return result;
  }

  /// <summary> replace every appearance of strings of 'from' in 'str' with the according string in 'to'</summary>
  /// <param name="str">the working base source string </param>
  /// <param name="from">the string to replace </param>
  /// <param name="to">the string use instead 'from' </param>
  /// <returns> modified String </returns>
  private static searchAndReplace_1(str: string, from: string[], to: string[]): string {
    let lastSubStr: number = 0;
    let sarIndex: number = 0;
    let fromCopy: string[] = from.slice();
    let startSubStr: number;
    let SARindex: RefParam<number> = new RefParam(0);
    startSubStr = StrUtil.indexOf(str, fromCopy, lastSubStr, SARindex);
    sarIndex = SARindex.value;
    if (startSubStr === -1)
      return str;

    let result: string;
    let tmpBuf: StringBuilder = new StringBuilder(str.length);
    while (startSubStr !== -1) {
      tmpBuf.Append(NString.Substring(str, lastSubStr, startSubStr - lastSubStr) + to[sarIndex]);
      startSubStr += fromCopy[sarIndex].length;
      lastSubStr = startSubStr;
      startSubStr = StrUtil.indexOf(str, fromCopy, lastSubStr, SARindex);
      sarIndex = SARindex.value;
      };
    tmpBuf.Append(NString.Substring(str, lastSubStr));
    result = tmpBuf.ToString();

    return result;
  }

  /// <summary> this functions is for use by the searchAndReplace() function -
  /// searches the offset of the strings from the array in the given string
  /// and returns the minimum offset found and sets the index of the found string
  /// to SARindex
  /// </summary>
  /// <param name="str">the string to search in </param>
  /// <param name="strings">an array of strings to search for </param>
  /// <param name="offset">where to start the search </param>
  private static indexOf(str: string, strings: string[], offset: number, SARindex: RefParam<number>): number {
    let minOffset: number = -1;
    for (let i: number = 0; i < strings.length; i = i + 1) {
      let flag: boolean = strings[i] === null;
      if (!(strings[i] === null)) {
        let resultOffset: number = NString.IndexOf(str, strings[i], offset);

        if (resultOffset === -1) {
          strings[i] = null;
        }
        else {
          if (resultOffset < minOffset || minOffset === -1) {
            minOffset = resultOffset;
            SARindex[0] = i;
          }
        }
      }
    }

    let result: number;
    if (minOffset > -1) {
      result = minOffset;
    }
    else {
      SARindex[0] = -1;
      result = -1;
    }
    return result;
  }

  /// <summary> replace tokens in user string by vector values </summary>
  /// <param name="userString">- user buffer like "User %d, %d string"
  /// </param>
  /// <param name="token">- token used in user string - i.e. "%d"
  /// </param>
  /// <param name="occurrence">- number of token where replace will take part (1 for first occurrence)
  /// </param>
  /// <param name="value">- value to be inserted insted of token
  /// </param>
  static replaceStringTokens(userString: string, token: string, occurrence: number, val: string): string {
    let tokenLen: number = token.length;
    let currPosition: number = 0;
    let newString: string = userString;

    if (val !== null) {
      let num2: number = 0;
      while (num2 < occurrence && currPosition !== -1) {
        currPosition = NString.IndexOf(userString, token, currPosition + ((num2 === 0) ? 0 : tokenLen));
        num2 = num2 + 1;
      }

      if (currPosition !== -1) {
        newString = NString.Substring(userString, 0, currPosition) + val + NString.Substring(userString, currPosition + tokenLen, userString.length - (currPosition + tokenLen));
      }
    }
    return newString;
  }

  static makePrintableTokens(source: string, type: string): string;
  static makePrintableTokens(source: string, type: number): string;
  static makePrintableTokens(source: List<string>, type: number): string;
  static makePrintableTokens(source: any, type: any): string | void{
    if (arguments.length === 2 && (source === null || source.constructor === String) && (type === null || type.constructor === Number)) {
      return StrUtil.makePrintableTokens_0(source, type);
    }
    StrUtil.makePrintableTokens_1(source, type);
  }

  /// <summary>
  ///   converts special characters in a token to a printable format
  /// </summary>
  /// <param name = "source">a token </param>
  /// <param name = "type">type of conversion: STR_2_HTML, SEQ_2_HTML, HTML_2_SEQ, HTML_2_STR, SEQ_2_STR </param>
  /// <returns> token with converted special characters </returns>
  static makePrintableTokens_0(source: string, type: number): string {
    let escStr: string[] = [
      "\\", "-", ","
    ];
    let escSeq: string[] = [
      "\\\\", "\\-", "\\,"
    ];
    let escHtm: string[] = [
      HTML_BACKSLASH, HTML_HYPHEN, HTML_COMMA
    ];
    let result: string;
    switch (type) {
      case STR_2_HTML:
        result = StrUtil.searchAndReplace(source, escStr, escHtm);
        break;
      case SEQ_2_HTML:
        result = StrUtil.searchAndReplace(source, escSeq, escHtm);
        break;
      case HTML_2_SEQ:
        result = StrUtil.searchAndReplace(source, escHtm, escSeq);
        break;
      case HTML_2_STR:
        result = StrUtil.searchAndReplace(source, escHtm, escStr);
        break;
      case SEQ_2_STR:
        result = StrUtil.searchAndReplace(source, escSeq, escStr);
        break;
      default:
        result = source;
        break;
    }

    return result;
  }

  /// <summary>
  ///   converts special characters in a tokens collection to a printable format
  /// </summary>
  /// <param name = "source">vector of strings before tokenaizer </param>
  /// <param name = "type">type of conversion: STR_2_HTML, SEQ_2_HTML, HTML_2_SEQ, HTML_2_STR </param>
  private static makePrintableTokens_1(source: List<string>, type: number): void {
    if (source !== null) {
      let length: number = source.Count;
      for (let i: number = 0; i < length; i = i + 1) {
        let currElm: string = source.get_Item(i);
        source.set_Item(i, StrUtil.makePrintableTokens_0(currElm, type));
      }
    }
  }

  /// <summary>
  ///   change non-printable characters like "new line" and "line feed" to their
  ///   printable representation
  /// </summary>
  /// <param name = "source">is the string with non-printable characters </param>
  /// <returns> the new string where all the non-printable characters are converted </returns>
  static makePrintable(source: string): string {
    let from: string[] = [
      "\n", "\r", "'", "\\", "\"", "\0"
    ];
    let to: string[] = [
      "\\n", "\\r", "\\'", "\\\\", "\\\"", "\\0"
    ];
    return StrUtil.searchAndReplace(source, from, to);
  }

  /// <summary>
  ///   change non-printable characters like "new line" and "line feed" to their
  ///   printable representation (simplified version for range error message)
  /// </summary>
  /// <param name = "source">is the string with non-printable characters </param>
  /// <returns> the new string where all the non-printable characters are converted </returns>
  static makePrintable2(source: string): string {
    let from: string[] = [
      "\n", "\r", "\0"
    ];
    let to: string[] = [
      "\\n", "\\r", "\\0"
    ];
    return StrUtil.searchAndReplace(source, from, to);
  }

  /// <summary>
  ///
  /// </summary>
  /// <param name="s"></param>
  /// <param name="len"></param>
  /// <returns></returns>
  static ZstringMake(s: string, len: number): string {
    len = StrUtil.mem_trim(s, len);
    return NString.Substring(s, 0, len);
  }

  /// <summary>(public)
  /// returns plain text from rtf text
  /// </summary>
  /// <param name="rtfText">refer to the summary</param>
  /// <returns>refer to the summary</returns>
  static GetPlainTextfromRtf(rtfText: string): string {
    if (Rtf.isRtf(rtfText)) {
      let rtf: Rtf = new Rtf();
      let outputTxt: StringBuilder = new StringBuilder("");
      rtf.toTxt(rtfText, outputTxt);
      rtfText = outputTxt.ToString();
    }
    return rtfText;
  }

  /// <summary>
  /// Returns true if the string arrays str1 & str2 are equal
  /// </summary>
  /// <param name="str1"></param>
  /// <param name="str2"></param>
  /// <returns></returns>
  static StringsArraysEqual(str1: string[], str2: string[]): boolean {
    let result: boolean;
    if (str1 === null && str2 === null) {
      result = true;
    }
    else {
      if (str1 === null || str2 === null) {
        result = false;
      }
      else {
        if (str1.length !== str2.length) {
          result = false;
        }
        else {
          for (let index: number = 0; index < <number>str1.length; index = index + 1) {
            if ((str1[index] !== str2[index])) {
              result = false;
              return result;
            }
          }
          result = true;
        }
      }
    }
    return result;
  }

  /// <summary>
  /// The code is copied from tsk_open_bnd_wild and SearchAndReplaceWildChars
  /// The refactoring is not performed for backwards compatibility
  /// The code replaces special charachters :* ? with recieved filler
  /// </summary>
  /// <returns></returns>
  static SearchAndReplaceWildChars(buf: string, len: number, filler: string): string {
    buf = NString.PadRight(buf, len);

    let escChar: boolean = false;
    let stopSearch: boolean = false;
    let tmpBuf: StringBuilder = new StringBuilder(len);
    for (let i: number = 0; i < len; i = i + 1) {
      switch (buf[i]) {
        case ('\\'): {
          let isNextCharWild: boolean = true;

          //If next char is not wild , then copy '\', if this is first char.
          if ((i + 1 < len) && (buf[i + 1] != '*' && buf[i + 1] != '\\'))
            isNextCharWild = false;
          if (escChar || !isNextCharWild)
            tmpBuf.Append(buf[i]);
          escChar = !escChar;
        }
          break;
        case ('*'):
          if (escChar)
            tmpBuf.Append(buf[i]);
          else {
            tmpBuf.Append(filler, len - tmpBuf.Length);
            stopSearch = true;
          }
          escChar = false;
          break;
        case '?':
          tmpBuf.Append(filler);
          escChar = false;
          break;
        default:
          tmpBuf.Append(buf[i]);
          escChar = false;
          break;
      }
    }

    let text: string = tmpBuf.ToString();
    return NString.TrimEnd(text, new Array<number>(1));
  }
}
