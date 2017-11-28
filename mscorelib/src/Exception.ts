/// <summary>
/// The base class of all exceptions
/// </summary>
export class Exception extends Error {

  /// <summary>
  /// constructor
  /// </summary>
  /// <param name="message"  denotes the message of exception></param>
  /// <param name="name"  denotes the type of exception></param>
  constructor(message?: string) {
    super(message);
    this.name = "Exception";
  }

  /// <summary>
  /// get the message of exception
  /// </summary>
  get Message() {
    return this.message;
  }

  /// <summary>
  /// get the stack trace of exception
  /// </summary>
  get StackTrace() {
    return this.stack;
  }

  /// <summary>
  /// get the type of exception
  /// </summary>
  public GetType(): string {
    return this.name;
  }
}


