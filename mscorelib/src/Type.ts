import {NObject} from "./NObject";

export class Type extends NObject {
  constructor(public Name: string) {
    super();
  }

  Equals(obj: any): boolean {
    return (obj instanceof Type) && ((<Type>obj).Name === this.Name);
  }
}
