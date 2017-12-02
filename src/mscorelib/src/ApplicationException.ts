import {Exception} from "./Exception";

export class ApplicationException extends Exception {

  InnerException: Exception;

  constructor(message: string = "", innerException?: Exception) {
    super(message);
    this.name = 'ApplicationException';
    this.InnerException = innerException;
  }
}
