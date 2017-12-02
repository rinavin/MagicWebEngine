import {IDisposable} from "@magic/mscorelib";
import {MgArrayList} from "@magic/utils";
import {ObjectReferenceBase} from "./ObjectReferenceBase";

export class ObjectReferencesCollection implements IDisposable {
  private _refs: MgArrayList<ObjectReferenceBase> = new MgArrayList();

  get_Item(i: number): ObjectReferenceBase {
    return this._refs[i];
  }

  Add(objRef: ObjectReferenceBase): void {
    this._refs.Add(objRef);
  }

  Dispose(): void {
    for (let i: number = 0; i < this._refs.Count; i = i + 1) {
      (<IDisposable>this._refs[i]).Dispose();
    }
  }

  Clone(): ObjectReferencesCollection {
    let objectReferencesCollection: ObjectReferencesCollection = new ObjectReferencesCollection();
    for (let i: number = 0; i < this._refs.Count; i = i + 1) {
      let objRef: ObjectReferenceBase = this.get_Item(i).Clone();
      objectReferencesCollection.Add(objRef);
    }
    return objectReferencesCollection;
  }

  // for iteration purpose
  get Refs() {
    return this._refs;
  }
}
