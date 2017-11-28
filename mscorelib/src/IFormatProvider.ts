import {Type} from "./Type";

export interface IFormatProvider {
  GetFormat(type: Type): any;
}
