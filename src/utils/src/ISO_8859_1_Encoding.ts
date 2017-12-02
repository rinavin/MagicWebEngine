import {Encoding} from "@magic/mscorelib";

export class ISO_8859_1_Encoding {
  static _encoding8859: Encoding = Encoding.GetEncoding("iso-8859-1");

  static getInstance(): Encoding {
    return ISO_8859_1_Encoding._encoding8859;
  }

  public GetBytes(chars: string[], charIndex: number, charCount: number, bytes: Uint8Array, byteIndex: number): number
  {
    for (let i: number = 0; i < charCount; i++)
      bytes[byteIndex + i] = chars[charIndex + i].charCodeAt(0);

    return charCount;
  }

  public GetChars(bytes: Uint8Array, byteIndex: number, byteCount: number, chars: string[], charIndex: number): number
  {
    for (let i: number = 0; i < byteCount; i++)
      chars[charIndex + i] = String.fromCharCode(bytes[byteIndex + i]);

    return byteCount;
  }
}
