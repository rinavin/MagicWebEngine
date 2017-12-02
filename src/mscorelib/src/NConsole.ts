import {NObject} from "./NObject";
import {TextWriter} from "./TextWriter";
import {NotImplementedException} from "./NotImplementedException";

export class NConsole extends NObject {
  static WriteLine(line: string)
  static WriteLine(format: string, arg0: any)
  static WriteLine(lineOrFormat: string, arg0?: any) {
    throw new NotImplementedException();
  }

  static Out: TextWriter;
}
