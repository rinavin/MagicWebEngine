import {StackFrame} from "./StackFrame";
import {NotImplementedException} from "./NotImplementedException";

export class StackTrace {

  public GetFrames(): StackFrame[] {
    throw new NotImplementedException();
  }

}
