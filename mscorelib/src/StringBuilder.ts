import {Environment} from "./Environment";
import {NChar} from "./NChar";
import {NotImplementedException} from "./NotImplementedException";

export class StringBuilder {
  private parts: string[] = new Array<string>();

  constructor(length: number)
  constructor(value?: string, length?: number)
  constructor(valueOrLength: any) {
    // TODO: implement ctor with length and string
  }

  Append(char: number, numberOfCharacters?: number): StringBuilder
  Append(text: string, startIndex?: number, charCount?: number): StringBuilder
  Append(textOrChar: any, startIndexOrNumberOfCharacters?: number, charCount?: number): StringBuilder {

    if (textOrChar.constructor === String) {
      this.Append_0(textOrChar, startIndexOrNumberOfCharacters, charCount);
    }
    else {
      this.Append_1(textOrChar, startIndexOrNumberOfCharacters);
    }
    return this;
  }

  Append_0(text: string, startIndex?: number, charCount?: number): void {
    this.parts.push(text);
    this.parts.push(text.substring(startIndex, startIndex + charCount));
  }

  Append_1(char: number, numberOfCharacters?: number): void {

    if (numberOfCharacters > 0)
      throw new NotImplementedException();
    else {
      let text: string = String.fromCharCode(char);
      this.parts.push(text);
    }
  }

  AppendLine(): void
  AppendLine(text: string): void
  AppendLine(text: string = null): void {
    if (text !== null) {
      this.parts.push(text);
    }
    this.parts.push(Environment.NewLine);
  }

  AppendFormat(text: string): StringBuilder
  AppendFormat(format: string, arg0: any): StringBuilder
  AppendFormat(format: string, arg0: any, arg1: any): StringBuilder
  AppendFormat(format: string, arg0: any, arg1: any, arg2: any): StringBuilder
  AppendFormat(textOrFormat: string, arg0?: any, arg1?: any, arg2?: any): StringBuilder {
    throw new NotImplementedException();
  }

  ToString(): string
  ToString(startIndex: number, length: number): string
  ToString(startIndex?: number, length?: number): string {
    return this.parts.join("");
  }

  get Length(): number {
    let len = 0;
    for (let i = 0; i < this.parts.length; i++) {
      len += this.parts[i].length;
    }
    return len;
  }

  get_Item(index: number): string {
    let o = 0;
    for (let i = 0; i < this.parts.length; ++i) {
      let p = this.parts[i];
      if (index < o + p.length) {
        return p.charCodeAt(index - o).toString();
      }
      o += p.length;
    }
    return o.toString();
  }

  set_Item(index: number, value: string) {
    throw new NotImplementedException();
  }

  // Insert(index: number, value: string)
  Insert(index: number, value: NChar[] | string): StringBuilder {
    throw new NotImplementedException();
  }

  // TODO : Implement
  Remove(startIndex: number, length: number): StringBuilder {
    throw new NotImplementedException();
  }

  Replace(oldValue: string, newValue: string, startIndex?: number, count?: number): StringBuilder {
    throw  new NotImplementedException();
  }
}
