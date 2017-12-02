import {NString, RefParam} from "@magic/mscorelib";
import {CallOsShow} from "@magic/utils";


export class ProcessLauncher {

  /// <summary>
  /// </summary>
  /// <param name = "command">OsCommand to be executed</param>
  /// <param name = "wait">wait property</param>
  /// <param name = "show">show property</param>
  /// <param name = "errMsg">hold error message string, if command execution fails.</param>
  /// <param name = "exitCode">exit code returned by process</param>
  /// <returns>this returns errcode, if command fails to execute. </returns>
  static InvokeOS(command: string, wait: boolean, show: CallOsShow, errMsg: RefParam<string>, exitCode: RefParam<number>): number {
    return -1;
  }

  /// <summary>
  ///   Separates the executable file and arguments from a command string
  /// </summary>
  /// <param name = "cmd">the command</param>
  /// <returns>returns argument list specified in command</returns>
  static SeparateParams(cmd: string): string[] {

    const DOUBLE_QUOTE: string = '"';
    const SPACE_CHAR: string = ' ';
    let parameters = new String[2];
    let appName: string = null;
    let param: string = null;
    let startIdx: number = 0;
    let endIdx: number = -1;

    cmd = NString.Trim(cmd);

    /* if the first char is double quote, look for the matching double quote. */
    if (cmd[startIdx] === DOUBLE_QUOTE) {
      endIdx = NString.IndexOf(cmd, DOUBLE_QUOTE  /*'"'*/, startIdx + 1);
    }
    /* if there is no double qoute, search for the first space character. */
    if (endIdx === -1) {
      endIdx = NString.IndexOf(cmd, SPACE_CHAR /*' '*/, startIdx);
    }

    /* if there is no space char as well, this means that we have only one param. */
    if (endIdx === -1) {
      endIdx = cmd.length - 1;
    }

    // Read the application name
    appName = NString.Substring(cmd, startIdx, endIdx + 1 - startIdx);
    parameters[0] = NString.Trim(appName);

    // Read the arguments
    param = NString.Substring(cmd, endIdx + 1, cmd.length - (endIdx + 1));
    parameters[1] = NString.Trim(param);
    return parameters;
  }

  constructor() {

  }
}
