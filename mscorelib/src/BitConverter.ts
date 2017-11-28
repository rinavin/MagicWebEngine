import {NotImplementedException} from "./NotImplementedException";

export class BitConverter {
  static ToInt32(bytes: Uint8Array, startIndex: number): number {
    throw new NotImplementedException();
  }

  static ToInt16(bytes: Uint8Array, startIndex: number): number {
    throw new NotImplementedException();
  }

  static ToDouble(bytes: Uint8Array, startIndex: number): number {
    throw new NotImplementedException();
  }

  static GetBytes(d: number): Uint8Array {
    throw new NotImplementedException();
  }
}
