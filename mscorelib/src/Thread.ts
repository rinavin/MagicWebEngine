import {NObject} from "./NObject";
import {NotImplementedException} from "./NotImplementedException";

export class Thread extends NObject {
  private static nextId: number = 1;
  static CurrentThread: Thread = new Thread();
  ManagedThreadId: number;

  constructor() {
    super();
    this.ManagedThreadId = Thread.nextId++;
  }

  static Sleep(millisecondsTimeout: number): void {
    throw new NotImplementedException();
  }
}
