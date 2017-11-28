import {NObject} from "./NObject";
import {IFormatProvider} from "./IFormatProvider";
import {NumberFormatInfo} from "./NumberFormatInfo";
import {Type} from "./Type";

export class CultureInfo extends NObject implements IFormatProvider {
  static InvariantCulture: CultureInfo = new CultureInfo("Invariant");
  static CurrentCulture: CultureInfo = CultureInfo.InvariantCulture;

  Name: string = "Invariant";

  private nfi: NumberFormatInfo = new NumberFormatInfo();

  GetFormat(type: Type): any {
    if (type.Name === "NumberFormatInfo") {
      return this.nfi;
    }
    return null;
  }

  constructor(name: string) {
    super();
  }
}
