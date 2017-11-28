import {NObject} from "./NObject";
import {IDisposable} from "./IDisposable";
import {Environment} from "./Environment";
import {NotImplementedException} from "./NotImplementedException";


export class TextWriter extends NObject implements IDisposable {

  Write(text: Object): void
  Write(text: string): void {
    throw new NotImplementedException();
  }

  WriteLine(): void

  WriteLine(text: string): void
  WriteLine(text?: string): void {
    this.Write(text + Environment.NewLine);
  }

  Flush(): void {
    throw new NotImplementedException();
  }

  Dispose(): void {
  }
}
