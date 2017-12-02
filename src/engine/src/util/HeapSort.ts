import {IComparable} from "@magic/mscorelib";

/// <summary>Class for JAVA 1.1 containing static methods to sort an arbitrary array
/// of JAVA objects which implement the IComparable interface.
/// </summary>
export class HeapSort {
  private static left(i: number): number {
    return 2 * i + 1;
  }

  private static right(i: number): number {
    return 2 * i + 2;
  }

  static sort(array: IComparable[]): void;
  static sort(array: IComparable[], idx: number[]): void;
  static sort(array: any, idx?: number[]): void {
    if (arguments.length === 1 && (array === null || array instanceof Array)) {
      HeapSort.sort_0(array);
      return;
    }
    HeapSort.sort_1(array, idx);
  }

  /// <summary>Sort array, rearranging the entries in array to be in
  /// sorted order.
  /// </summary>
  private static sort_0(array: IComparable[]): void {
    let sortsize: number = array.length;
    let temp: IComparable;
    let largest: number, i: number, l: number, r: number;

    if (sortsize <= 1)
      return;

    let top: number = sortsize - 1;
    let t: number = sortsize / 2;

    do {
      t = t - 1;
      largest = t;

      /* heapify */

      do {
        i = largest;
        l = HeapSort.left(largest);
        r = HeapSort.right(largest);

        if (l <= top) {
          if (array[l].CompareTo(array[i]) > 0)
            largest = l;
        }
        if (r <= top) {
          if (array[r].CompareTo(array[largest]) > 0)
            largest = r;
        }
        if (largest !== i) {
          temp = array[largest];
          array[largest] = array[i];
          array[i] = temp;
        }
      }
      while (largest !== i);
    }
    while (t > 0);

    t = sortsize;

    do {
      top = top - 1;
      t = t - 1;

      let here: number = t;

      temp = array[here];
      array[here] = array[0];
      array[0] = temp;

      largest = 0;

      do {
        i = largest;
        l = HeapSort.left(largest);
        r = HeapSort.right(largest);

        if (l <= top) {
          if (array[l].CompareTo(array[i]) > 0) {
            largest = l;
          }
        }
        if (r <= top) {
          if (array[r].CompareTo(array[largest]) > 0) {
            largest = r;
          }
        }
        if (largest !== i) {
          temp = array[largest];
          array[largest] = array[i];
          array[i] = temp;
        }
      }
      while (largest !== i);
    }
    while (t > 1);
  }

  /// <summary>Sort array, returning an array of integer indices which
  /// access array at various offsets.
  ///
  /// array[idx[i]] will be the i'th ranked element of array.
  /// e.g.  array[idx[0]] is the smallest element,
  /// array[idx[1]] is the next smallest and so on.
  ///
  /// array is left in its original order.
  ///
  /// goofy name of method is because JAVA doesn't allow
  /// methods with the same names and parameters to have
  /// different return types.
  ///
  /// </summary>
  static sortI(array: IComparable[]): number[] {
    let idx: number[] = new Array<number>(array.length);
    for (let _ai: number = 0; _ai < idx.length; ++_ai)
      idx[_ai] = 0;

    HeapSort.sort(array, idx);
    return idx;
  }

  /// <summary>Sort array, placing an array of integer indices into the
  /// array idx.  If idx is smaller than array, an
  /// IndexOutOfBoundsException will be thrown.
  ///
  /// array[idx[i]] will be the i'th ranked element of array.
  /// e.g.  array[idx[0]] is the smallest element,
  /// array[idx[1]] is the next smallest and so on.
  ///
  /// array is left in its original order.
  ///
  /// </summary>
  private static sort_1(array: IComparable[], idx: number[]): void {
    let sortsize: number = array.length;
    let i: number, top: number, t: number, largest: number, l: number, r: number, here: number, temp: number;

    if (sortsize <= 1) {
      if (sortsize === 1)
        idx[0] = 0;
    }

    top = sortsize - 1;
    t = sortsize / 2;

    for (i = 0; i < sortsize; i = i + 1)
      idx[i] = i;

    do {
      t = t - 1;
      largest = t;

      /* heapify */

      do {
        i = largest;
        l = HeapSort.left(largest);
        r = HeapSort.right(largest);

        if (l <= top) {
          if (array[idx[l]].CompareTo(array[idx[i]]) > 0)
            largest = l;
        }
        if (r <= top) {
          if (array[idx[r]].CompareTo(array[idx[largest]]) > 0)
            largest = r;
        }
        if (largest !== i) {
          temp = idx[largest];
          idx[largest] = idx[i];
          idx[i] = temp;
        }
      }
      while (largest !== i);
    }
    while (t > 0);

    t = sortsize;

    do {
      top = top - 1;
      t = t - 1;

      here = t;

      temp = idx[here];
      idx[here] = idx[0];
      idx[0] = temp;

      largest = 0;

      do {
        i = largest;
        l = HeapSort.left(largest);
        r = HeapSort.right(largest);

        if (l <= top) {
          if (array[idx[l]].CompareTo(array[idx[i]]) > 0) {
            largest = l;
          }
        }
        if (r <= top) {
          if (array[idx[r]].CompareTo(array[idx[largest]]) > 0) {
            largest = r;
          }
        }
        if (largest !== i) {
          temp = idx[largest];
          idx[largest] = idx[i];
          idx[i] = temp;
        }
      }
      while (largest !== i);
    }
    while (t > 1);
  }
}
