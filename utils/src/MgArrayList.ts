import {List} from "@magic/mscorelib";

export class MgArrayList<T> extends List<T> {
  /// <summary>
  /// add null cells up to 'size' cells.
  /// </summary>
  /// <param name="size"></param>
  SetSize(size: number): void {
    while (this.Count < size) {
      this.Add(null);
    }

    if (this.Count > size) {
      this.RemoveRange(size, this.Count - size);
    }
  }
}
