import {NObject} from "./NObject";
import {NotImplementedException} from "./NotImplementedException";

export class Encoding extends NObject {
  static ASCII: Encoding = new Encoding();
  static UTF8: Encoding = new Encoding();
  static Unicode: Encoding = new Encoding();

  static get Default(): Encoding {
    throw new NotImplementedException();
  }

  // TODO: Implement
  GetBytes(str: string[]): Uint8Array
  GetBytes(str: string): Uint8Array
  GetBytes(str: any): Uint8Array {
    return null;
  }

  // TODO: Implement
  GetByteCount(str: string): number {
    throw new NotImplementedException();
  }

  // TODO: Implement
  GetString(bytes: Uint8Array, index: number, count: number): string {
    return "";
  }

  // TODO: Implement
  GetChars(bytes: Uint8Array) {
    throw new NotImplementedException();
  }

  // TODO: Implement
  static GetEncoding(name: string): Encoding
  static GetEncoding(codepage: number): Encoding
  static GetEncoding(nameOrCodepage: any): Encoding {
    return new Encoding();
  }
}
