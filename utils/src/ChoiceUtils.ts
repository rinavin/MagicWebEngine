import {NString, StringBuilder} from "@magic/mscorelib";
import {StrUtil} from "./StrUtil";
import {SEQ_2_STR} from "./StrUtil";

export class ChoiceUtils {

  /// <summary>
  ///   init the display Value from string
  /// </summary>
  /// <param name = "choiceDispStr">the all substring separated with comma.
  ///   The behavior:
  ///   a. when have "\" before char a-z need to ignore the \ put the a-z char
  ///   b. when "\," -> ","
  ///   c. when "\-" -> "-"
  ///   d. when "\\" -> "\"
  ///   e. when "\\\\" -> "\\"
  ///   the display can be all string. and we don't need to check validation according to the dataType(as we do in Link
  /// </param>
  static GetDisplayListFromString(choiceDispStr: string, removeAccelerators: boolean, shouldMakePrintable: boolean, shouldTrimOptions: boolean): String[] {
    let fromHelp = new Array("\\\\", "\\-", "\\,");
    let toHelp = new Array("XX", "XX", "XX");
    let trimChar: number[] = [
      32
    ]/*' '*/;
    choiceDispStr = NString.TrimEnd(choiceDispStr, trimChar);
    let helpStrDisp: string = StrUtil.searchAndReplace(choiceDispStr, fromHelp, toHelp);
    let sTok: String[] = StrUtil.tokenize(helpStrDisp, ",");
    let size: number = (helpStrDisp !== "" ? sTok.length : 0);
    let tokenBuffer: StringBuilder;
    let helpTokenDisp: string, token;
    let currPosDisp: number = 0, nextPosDisp = 0, tokenPosDisp, i;
    let choiceDisp = new Array(size);
    for (; i < size; i++) {
      nextPosDisp = currPosDisp;
      nextPosDisp = helpStrDisp.indexOf(',', nextPosDisp);
      if (nextPosDisp === currPosDisp)
        token = helpTokenDisp = "";
      else if (nextPosDisp === -1) {
        token = choiceDispStr.substring(currPosDisp);
        helpTokenDisp = helpStrDisp.substring(currPosDisp);
      }
      else {
        token = choiceDispStr.substring(currPosDisp, (nextPosDisp) - (currPosDisp));
        helpTokenDisp = helpStrDisp.substring(currPosDisp, (nextPosDisp) - (currPosDisp));
      }
      currPosDisp = nextPosDisp + 1;
      if (token != null) {
        token = StrUtil.ltrim(token);
        if (removeAccelerators)
          token = ChoiceUtils.RemoveAcclCharFromOptions(new StringBuilder(token));
        helpTokenDisp = StrUtil.ltrim(helpTokenDisp);
        if (removeAccelerators)
          helpTokenDisp = ChoiceUtils.RemoveAcclCharFromOptions(new StringBuilder(helpTokenDisp));
      }
      if (helpTokenDisp.indexOf('\\') >= 0) {
        tokenBuffer = new StringBuilder();
        for (; tokenPosDisp < helpTokenDisp.length; tokenPosDisp++)
          if (helpTokenDisp[tokenPosDisp] !== '\\')
            tokenBuffer.Append(token[tokenPosDisp]);
          else if (tokenPosDisp === helpTokenDisp.length - 1)
            tokenBuffer.Append(' ');
        token = tokenBuffer.ToString();
      }
      if (shouldMakePrintable) {
        token = StrUtil.makePrintableTokens(token, SEQ_2_STR);
        if (shouldTrimOptions) {
          let temp: string = token.TrimEnd(trimChar);
          if (temp.length === 0)
            choiceDisp[i] = " ";
          else choiceDisp[i] = token.TrimEnd(trimChar);
        }
        else choiceDisp[i] = token;
      }
      else choiceDisp[i] = token;
    }
    return choiceDisp;
  }

  static RemoveAcclCharFromOptions(OptionStr: StringBuilder): string {
    let i: number = 0;
    if (OptionStr != null) {
      for (; i < OptionStr.Length;) {
        if (OptionStr[i] === '&') {
          if (i < OptionStr.Length - 1 && OptionStr[i + 1] === ('&'))
            i++;
          OptionStr = OptionStr.Remove(i, 1);
        }
        else i++;
      }
    }
    return (OptionStr != null ? OptionStr.ToString() : null);
  }
}
