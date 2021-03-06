import {ExpressionEvaluator, NullValueException} from "../exp/ExpressionEvaluator";
import {DisplayConvertor, ExpVal} from "@magic/gui";
import {StorageAttribute, StrUtil} from "@magic/utils";
import {Expression} from "../exp/Expression";
import {Task} from "../tasks/Task";
import {NObject, NString, Char} from "@magic/mscorelib";

/// <summary>
///   this class represent a range or locate sections - i.e. min/max expressions
/// </summary>
export class Boundary {
  private _cacheTableFldId: number = 0;
  private _max: Expression = null;
  private _min: Expression = null;
  private _retType: StorageAttribute = StorageAttribute.NONE;
  private _size: number = 0;
  private _maxExpVal: ExpVal = null;
  private _minExpVal: ExpVal = null;

  DiscardMin: boolean = false;
  DiscardMax: boolean = false;
  MaxEqualsMin: boolean = false;

  get MaxExpVal(): ExpVal {
    return this._maxExpVal;
  }

  get MinExpVal(): ExpVal {
    return this._minExpVal;
  }

  constructor(task: Task, minIdx: number, maxIdx: number, returnType: StorageAttribute, size: number);
  constructor(task: Task, minIdx: number, maxIdx: number, returnType: StorageAttribute, size: number, cacheTableId: number);
  constructor(task: Task, minIdx: number, maxIdx: number, returnType: StorageAttribute, size: number, cacheTableId?: number) {
    if (arguments.length === 5 && (task === null || task instanceof Task) && (minIdx === null || minIdx.constructor === Number) && (maxIdx === null || maxIdx.constructor === Number) && (returnType === null || returnType.constructor === Number) && (size === null || size.constructor === Number)) {
      this.constructor_0(task, minIdx, maxIdx, returnType, size);
      return;
    }
    this.constructor_1(task, minIdx, maxIdx, returnType, size, cacheTableId);
  }

  /// <summary>
  /// Instantiates a new Boundary object
  /// </summary>
  /// <param name="task"></param>
  /// <param name="minIdx"></param>
  /// <param name="maxIdx"></param>
  /// <param name="returnType"></param>
  /// <param name="size"></param>
  private constructor_0(task: Task, minIdx: number, maxIdx: number, returnType: StorageAttribute, size: number): void {
    this.constructor_1(task, minIdx, maxIdx, returnType, size, -1);
  }

  private constructor_1(task: Task, minIdx: number, maxIdx: number, returnType: StorageAttribute, size: number, cacheTableId: number): void {
    this._retType = returnType;
    this._size = size;
    this._cacheTableFldId = cacheTableId;
    if (minIdx !== -1)
      this._min = task.getExpById(minIdx);

    if (maxIdx !== -1)
      this._max = task.getExpById(maxIdx);
  }

  // sometimes the min or max does not have an expression
  hasMinExp(): boolean {
    return this._min !== null;
  }

  // sometimes the min or max does not have an expression
  hasMaxExp(): boolean {
    return this._max !== null;
  }

  /// <summary>
  ///   returns the min/max expressions return type - it actually the type of the field they are Associated with
  /// </summary>
  getExpType(): StorageAttribute {
    return this._retType;
  }


  /// <summary>
  ///   return the id of the cached table field this range corresponds to
  /// </summary>
  getCacheTableFldId(): number {
    return this._cacheTableFldId;
  }

  /// <summary>
  ///   computes the min and max expression to check their values
  /// </summary>
  compute(padValueWithMinMaxCharacters: boolean): void {
    if (this.hasMinExp()) {

      // evaluate the min expression
      let minVal: string = this._min.evaluate(this.getExpType(), this._size);
      if (minVal !== null) {
        minVal = NString.TrimEnd(minVal, new Array<string>(0));
      }

      this._minExpVal = new ExpVal(this.getExpType(), minVal === null, minVal);

      // check and set the MaxEqualsMin before the wild chars are replaced on the string result
      this.MaxEqualsMin = this.IsMaxEqualsMin();

      if (!this._minExpVal.IsNull && (this._minExpVal.Attr === StorageAttribute.ALPHA || this._minExpVal.Attr === StorageAttribute.UNICODE)) {
        if (padValueWithMinMaxCharacters) {
          this._minExpVal.StrVal = NObject.GenericToString(DisplayConvertor.StringValueToMgValue(this._minExpVal.StrVal, this._minExpVal.Attr, Char.MinValue, /*' '*/this._size));
          this.MaxEqualsMin = false;
        }
        this._minExpVal.StrVal = StrUtil.SearchAndReplaceWildChars(this._minExpVal.StrVal, this._size, Char.MinValue)/*' '*/;
      }
      this.DiscardMin = this._min.DiscardCndRangeResult();
    }

    if (this.hasMaxExp()) {

      // evaluate the max expression
      let maxVal: string = this._max.evaluate(this.getExpType(), this._size);
      this._maxExpVal = new ExpVal(this.getExpType(), maxVal === null, maxVal);

      if (!this._maxExpVal.IsNull && (this._maxExpVal.Attr === StorageAttribute.ALPHA || this._maxExpVal.Attr === StorageAttribute.UNICODE)) {
        if (padValueWithMinMaxCharacters) {
          this._maxExpVal.StrVal = DisplayConvertor.StringValueToMgValue(this._maxExpVal.StrVal, this._maxExpVal.Attr, Char.MaxValue /*'￿'*/, this._size);
        }
        this._maxExpVal.StrVal = StrUtil.SearchAndReplaceWildChars(this._maxExpVal.StrVal, this._size, Char.MaxValue)/*'￿'*/;
      }
      this.DiscardMax = this._max.DiscardCndRangeResult();
    }
  }

  /// <summary>
  ///   this function gets a value and checks whether it satisfies the range section
  /// </summary>
  /// <param name = "val">- the value to be compared
  /// </param>
  checkRange(val: string, IsNull: boolean): boolean {
    let res: boolean = true;

    let cmpVal: ExpVal = new ExpVal(this.getExpType(), IsNull, val);

    if (cmpVal.IsNull && ((this.hasMinExp() && this._minExpVal.IsNull) || (this.hasMaxExp() && this._maxExpVal.IsNull))) {
      res = true;
    }
    else {
      // check min expression Compliance
      if (this.hasMinExp()) {

        // if both of the compared values are not null
        if (!this._minExpVal.IsNull && !cmpVal.IsNull) {
          try {
            // the compared value must be equal or greater to the min value
            if (ExpressionEvaluator.val_cmp_any(cmpVal, this._minExpVal, true) < 0)
              res = false;
          }
          catch (exception) {
            if (exception instanceof NullValueException) {
              res = false;
            }
            else
              throw exception;
          }
        }
        else {
          if (cmpVal.IsNull !== this._minExpVal.IsNull)
            res = false;
        }
      }
      // check max expression Compliance
      if (this.hasMaxExp() && res) {
        // if both of the compared values are not null
        if (!this._maxExpVal.IsNull && !cmpVal.IsNull) {
          try {
            // the compared value must be equal or greater to the min value
            if (ExpressionEvaluator.val_cmp_any(cmpVal, this._maxExpVal, true) > 0)
              res = false;
          }
          catch (exception) {
            if (exception instanceof NullValueException)
              res = false;
            else
              throw exception;
          }
        }
        // if one of them is null and null is the greatest value there is we must check that maxExpVal is not null
        else if (cmpVal.IsNull !== this._maxExpVal.IsNull)
          res = false;
      }
    }
    return res;
  }

  /// <summary>
  /// returns true if min expression equal to max expression and no wild chars (*, ?) exist in the range
  /// </summary>
  /// <returns></returns>
  IsMaxEqualsMin(): boolean {
    let result: boolean = false;
    if (this.hasMaxExp() && this.hasMinExp()) {
      if (this._min.getId() === this._max.getId()) {
        if (this._retType === StorageAttribute.ALPHA || this._retType === StorageAttribute.UNICODE)
          result = !this.WildCharExist();
        else
          result = true;
      }
    }
    return result;
  }

  /// <summary>
  /// checks if wild char exist in tne value
  /// </summary>
  /// <returns></returns>
  private WildCharExist(): boolean {
    let wildChars: string[] = ["*", "?"];
    let result: boolean = false;

    // check trim
    if (!this._minExpVal.IsNull) {
      let stringValue: string = this._minExpVal.StrVal;

      for (let i: number = 0; i < wildChars.length; i = i + 1) {
        if (NString.EndsWith(stringValue, wildChars[i])) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

  ToString(): string {
    return NString.Format("{{Boundary: {0}-{1}, {2}, {3}}}", [
      this._max, this._max, this._retType, this._size
    ]);
  }
}
