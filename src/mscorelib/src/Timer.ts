import {IDisposable} from "./IDisposable";

export class Timer implements IDisposable {
  constructor(callback: () => void, state: any, dueTime: number, period: number) {

  }

  Dispose(): void {
  }
}
