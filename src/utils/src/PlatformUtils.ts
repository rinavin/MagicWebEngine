export class OSEnvironment {
  static EolSeq: string = "\n";
  static TabSeq: string = "\t";

  static getStackTrace(): string {
    // TODO : Find a way to get stack trace
    // return OSEnvironment.EolSeq + Environment.StackTrace;
    return "";
  }
}
