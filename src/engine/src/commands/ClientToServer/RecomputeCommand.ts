import {RefParam} from "@magic/mscorelib";
import {ConstInterface} from "../../ConstInterface";
import {ICommandTaskTag} from "./ICommandTaskTag";
import {ClientOriginatedCommand} from "./ClientOriginatedCommand";
import {CommandSerializationHelper} from "./CommandSerializationHelper";

export class RecomputeCommand extends ClientOriginatedCommand implements ICommandTaskTag {
  TaskTag: string = null;
  FldId: number = 0;
  IgnoreSubformRecompute: boolean = false;

  get CommandTypeAttribute(): string {
    return ConstInterface.MG_ATTR_VAL_RECOMP;
  }

  SerializeCommandData(refHasChildElements: RefParam<boolean>): string {
    let helper: CommandSerializationHelper = new CommandSerializationHelper();

    helper.SerializeTaskTag(this.TaskTag);
    helper.SerializeFldId(this.FldId);
    if (this.IgnoreSubformRecompute)
      helper.SerializeAttribute(ConstInterface.MG_ATTR_IGNORE_SUBFORM_RECOMPUTE, "1");

    return helper.GetString();
  }

  constructor() {
    super();
  }
}
