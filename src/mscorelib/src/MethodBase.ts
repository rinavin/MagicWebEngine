import {NotImplementedException} from "./NotImplementedException";

export class MethodBase {

  get Name(): string {
    throw new NotImplementedException();
  }

}
