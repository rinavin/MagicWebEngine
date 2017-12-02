import {NObject} from "./NObject";

export class Debug extends NObject {
  static WriteLine(text: string): void {
    console.log(text);
  }

  static Assert(assertCondtion: boolean, message?: string, detailedMessage?: string): void {
    if (!assertCondtion)
      alert(message);
  }
}
