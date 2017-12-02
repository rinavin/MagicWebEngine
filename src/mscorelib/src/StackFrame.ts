import {MethodBase} from "./MethodBase";
import {NotImplementedException} from "./NotImplementedException";

export class StackFrame {

  constructor(skipFrames: number, fNeedFileInfo: boolean) {
    throw new NotImplementedException();
  }

  public GetFileLineNumber(): number {
    throw new NotImplementedException();
  }

  public GetFileName(): string {
    throw new NotImplementedException();
  }

  public GetMethod(): MethodBase {
    throw new NotImplementedException();
  }
}
