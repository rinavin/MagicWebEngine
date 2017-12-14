import {NotImplementedException} from "./NotImplementedException";
import {NString} from "./NString";
//todo:code error - circular dependency
// import {Type} from "./Type";

export class NObject {
  Equals(other: NObject): boolean {

    return this === other;
  }

  GetHashCode(): number {
    return NString.GetHashCode(this.toString());
  }
		
  
  //todo:code error
	
	/*
	  ToString(): string {
		return this.GetType().Name;
	  }
	*/

/*
  toString(): string {
    return this.ToString();
  }
*/

  //todo:code error
/*
  GetType(): Type {
    return new Type(this.constructor.toString().match(/function (\w*)/)[1]);
  }
*/

  static ReferenceEquals(x: NObject, y: NObject): boolean {
    return x === y;
  }

  static GenericEquals(x: any, y: any): boolean {
    if (typeof x === "object") return x.Equals(y);
    return x === y;
  }

  static GenericToString(x: any): string {
    if (typeof x === "object") return x.ToString();
    return x.toString();
  }

  static GenericGetHashCode(x: any): number {
    if (typeof x === "object") return x.GetHashCode();
    return NString.GetHashCode(this.toString());
  }

  MemberwiseClone(): any {
    throw new NotImplementedException;
  }
}
