export interface IComparer<T> {
  Compare(obj1: T, obj2: T): number;
}
