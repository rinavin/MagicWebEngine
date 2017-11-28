import {Array_Enumerator, IEnumerable} from "./ArrayEnumerator";
import {NotImplementedException} from "./NotImplementedException";
import {IComparer} from "./IComparer";
import {isUndefined} from "util";

export class List<T> {
  private array: T[] = new Array<T>();

  constructor(arrayEnumerator?: Array_Enumerator<T>) {
    if (arguments.length === 1) {
      this.AddRange(arrayEnumerator);
    }
  }

  Add(item: T) {
    this.array.push(item);
  }

  AddRange(arrayEnumerator: Array_Enumerator<T>)
  AddRange(array: Array<T>)
  AddRange(arrayEnumeratorOrArray: any) {
    if (arrayEnumeratorOrArray.constructor === Array) {
      arrayEnumeratorOrArray.forEach((item: T) => {
        this.array.push(item);
      });
    }
    else {
      let e = arrayEnumeratorOrArray;
      while (e.MoveNext()) {
        this.Add(e.Current);
      }
    }
  }

  get Count(): number {
    return this.array.length;
  }

  get_Item(index: number): T {
    return this.array[index];
  }

  set_Item(index: number, value: T): void {
    if (index >= 0 && index < length)
      this.array[index] = value;
    else
      throw new Error("index out of bounds");
  }

  GetEnumerator(): Array_Enumerator<T> {
    return new Array_Enumerator<T>(this.array);
  }

  Remove(object: T): void {
    let index: number = this.array.indexOf(object);

    if (index > -1)
      this.RemoveAt(index);
  }

  RemoveAt(index: number): void {
    this.RemoveRange(index, 1);
  }

  RemoveRange(index: number, count: number): void {
    this.array.splice(index, count);
  }

  Insert(index: number, item: T): void {
    if (index >= 0 && index < length)
      this.array.splice(index, 0, item);
  }

  Clear(): void {
    this.array.splice(0, this.Count);
  }

  ToArray(): T[] {
    return this.array.slice(0);
  }

  IndexOf(item: T): number {
    return this.array.indexOf(item);
  }

  Sort(comparer?: IComparer<T>) {
    if (arguments.length === 0)
    // TODO: implement
      throw  new NotImplementedException();

    this.array.sort(comparer.Compare);
  }

  Contains(object: T): boolean {
    return this.array.indexOf(object) > -1;
  }

  find(predicate: (value: T) => boolean): T {
    let foundItem = this.array.find(predicate);
    if (isUndefined(foundItem))
      foundItem = null;

    return foundItem;
  }

  findIndex(predicate: (value: T) => boolean): number {
    return this.array.findIndex(predicate);
  }

  forEach(callackFuntion: (value: T, idx: number) => void) {
    this.array.forEach(callackFuntion);
  }

  Join(separator: string): string {
    return this.array.join(separator);
  }

  toString(): string {
    return this.array.toString();
  }
}
