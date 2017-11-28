import {MgControlBase} from "./MgControlBase";
import {FieldValidator} from "./FieldValidator";
import {PIC} from "./PIC";
import {StringBuilder, List, NString} from "@magic/mscorelib";
import {StorageAttribute, StrUtil, SEQ_2_HTML, HTML_2_STR, PICInterface} from "@magic/utils";
import {Events} from "../../Events";


export class ValidationDetails {

  // ATTENTION !!! when you add/modify/delete a member variable don't forget to take care
  // about the copy constructor: ValidationDetails(ValidationDetails vd)

  private _control: MgControlBase = null;
  private _fieldValidator: FieldValidator = null;
  private _picData: PIC = null;
  private _pictureEnable: StringBuilder = null; // for inner (of Numeric type) use only, String of 1's -> possible to write ; 0's -> impossible to write ; for '\' using
  private _pictureReal: StringBuilder = null; // for inner (of Numeric type) use only
  private _continuousRangeValues: List<string> = null;  // can't use List<T> - uses Clone()
  private _discreteRangeValues: List<string> = null; // can't use List<T> - uses Clone()
  private _isNull: boolean = false;
  private _oldvalue: string = null; // old value of the control
  private _range: string = null; // 'compressed' string of the range
  private _val: string = null;  // new value, inserted into control
  private _validationFailed: boolean = false;

  get ValidationFailed(): boolean {
    return this._validationFailed;
  }

  /// <summary>
  ///   Constructor, which sets all member values
  /// </summary>
  constructor(oldvalue: string, val: string, range: string, pic: PIC, control: MgControlBase);
  constructor(rangeStr: string);
  constructor(vd: ValidationDetails);
  constructor();
  constructor(oldvalueOrRangeStrOrVd?: any, val?: string, range?: string, pic?: PIC, control?: MgControlBase) {
    if (arguments.length === 5 && (oldvalueOrRangeStrOrVd === null || oldvalueOrRangeStrOrVd.constructor === String) && (val === null || val.constructor === String) && (range === null || range.constructor === String) && (pic === null || pic instanceof PIC) && (control === null || control instanceof MgControlBase)) {
      this.constructor_0(oldvalueOrRangeStrOrVd, val, range, pic, control);
      return;
    }
    if (arguments.length === 1 && (oldvalueOrRangeStrOrVd === null || oldvalueOrRangeStrOrVd.constructor === String)) {
      this.constructor_1(oldvalueOrRangeStrOrVd);
      return;
    }
    if (arguments.length === 1 && (oldvalueOrRangeStrOrVd === null || oldvalueOrRangeStrOrVd instanceof ValidationDetails)) {
      this.constructor_2(oldvalueOrRangeStrOrVd);
      return;
    }
    this.constructor_3();
  }

  private constructor_0(oldvalue: string, val: string, range: string, pic: PIC, control: MgControlBase): void {
    this._picData = pic;
    this._oldvalue = oldvalue; // old value of the field
    this._val = val; // new  inserted value of the field
    this._range = range;
    this._control = control;

    switch (pic.getAttr()) {
      case StorageAttribute.NUMERIC:
        this._pictureReal = new StringBuilder(this._picData.getMaskSize());
        this._pictureEnable = new StringBuilder(this._picData.getMaskSize());
        this.getRealNumericPicture();
        break;

      case StorageAttribute.BOOLEAN:
        if (this._range == null)
          this._range = "True,False"; // default range value for Logical
        break;
      case StorageAttribute.DATE:
      case StorageAttribute.TIME:
      case StorageAttribute.ALPHA:
      case StorageAttribute.BLOB:
      case StorageAttribute.BLOB_VECTOR:
      case StorageAttribute.UNICODE:
        break;

      default:
        Events.WriteExceptionToLog("ValidationDetails.ValidationDetails: There is no type " +
          this._picData.getAttr());
        break;
    }
    // get Range for the picture:
    if (this._range != null)
      this.fillRange();

    // free memory
    range = null;
  }

  /// <summary>
  ///   constructor for range only, make parsing of  Range and fill
  ///   DiscreteRangeValues and ContinuousRangeValues
  ///   (used in DisplayConventor)
  /// </summary>
  /// <param name = "range">string</param>
  private constructor_1(rangeStr: string): void {
    this.constructor_3();
    this._range = rangeStr;
    if (this._range !== null)
      this.fillRange();
  }

  /// <summary>
  ///   Make copy of validation details,
  ///   copy constructor
  /// </summary>
  private constructor_2(vd: ValidationDetails): void {
    this.constructor_3();
    this._oldvalue = vd.getOldValue();
    this._val = vd._val;
    this._range = vd.getRange();
    this._control = vd.getControl();
    this._validationFailed = false;
    if (vd._pictureReal !== null) {
      this._pictureReal = new StringBuilder(vd._pictureReal.ToString());
    }
    if (vd._pictureEnable !== null) {
      this._pictureEnable = new StringBuilder(vd._pictureEnable.ToString());
    }
    if (vd.getDiscreteRangeValues() !== null) {
      this._discreteRangeValues = vd.CloneDiscreteRangeValues();
    }
    if (vd.getContinuousRangeValues() != null) {
      this._continuousRangeValues = vd.CloneContinuousRangeValues();
    }
    this._picData = vd.getPIC();
    this._isNull = vd.getIsNull();
  }

  private constructor_3(): void {
    this._fieldValidator = new FieldValidator();
  }

  /// <summary>
  ///   ***********************Numeric*****************************************
  /// </summary>
  private getRealNumericPicture(): void {
    let mask: string = this._picData.getMask();
    let dec_: number = this._picData.getDec();
    let whole_: number = this._picData.getWholes();
    let decimal_: boolean = this._picData.withDecimal();
    let dec_pnt_in_first: boolean = this._picData.decInFirstPos();
    let isNegative: boolean = this._picData.isNegative();
    let isFirstPic_N: boolean = true;
    let isPointInserted: boolean = false;

    let currChar = 0;

    for (let i: number = 0; i < this._picData.getMaskSize(); i = i + 1) {
      currChar = +mask.charAt(i); // it's ASCII of the char

      switch (currChar) {
        case PICInterface.PIC_N:
          if (isFirstPic_N) {
            if (isNegative)
              this.setPictures('-', '0');

            if (dec_pnt_in_first) {
              this.setPictures('.', '1');
              isPointInserted = true;
            }
            else if (whole_ > 0) {
              whole_--;
              this.setPictures('#', '0');
            }
            isFirstPic_N = false;
            break;
          }

          if (decimal_) {
            if (whole_ > 0) {
              whole_--;
              this.setPictures('#', '0');
            }
            else if (whole_ === 0 && !isPointInserted) {
              this.setPictures('.', '1');
              isPointInserted = true;
            }
            else if (dec_ > 0) {
              dec_--;
              this.setPictures('#', '0');
            }
          }
          else {
            if (whole_ > 0) {
              whole_--;
              this.setPictures('#', '0');
            }
          }
          break;

        default: // const string in Alpha
          this.setPictures(currChar.toString(), '1');
          break;
      }
    }
    Events.WriteDevToLog(this._pictureReal.ToString());
    Events.WriteDevToLog(this._pictureEnable.ToString());
  }

  /// <summary>
  ///   ***********************Range*****************************************
  /// </summary>
  /// <summary>
  ///   Fill Range structures in the class
  /// </summary>
  private fillRange(): void {
    this._range = StrUtil.makePrintableTokens(this._range, SEQ_2_HTML)/*''*/;
    // find delimiters ',' which has not '\,' => RealDelimeters
    let from: number = 0;
    let prev: number = 0;
    while ((from = this.findDelimeter(from, ",", this._range)) !== -1 && prev < this._range.length) {
      this.rangeForms(NString.Substring(this._range, prev, from - prev));
      from = (prev = from + 1);
    }
    // last element:
    if (prev < this._range.length) {
      this.rangeForms(NString.Substring(this._range, prev));
    }

    // range=null; // don't delete it
    if (this._discreteRangeValues != null) {
      StrUtil.makePrintableTokens(this._discreteRangeValues, HTML_2_STR /*'\u0003*/);
      Events.WriteDevToLog(this._discreteRangeValues.toString());
    }
    if (this._continuousRangeValues !== null) {
      StrUtil.makePrintableTokens(this._continuousRangeValues, HTML_2_STR/*'\u0003'*/)/*''*/;
      Events.WriteDevToLog(this._continuousRangeValues.toString());
    }
  }

  /// <summary>
  ///   Fill Vectors of DiscreterangeValues and ContinuousRangeValues
  ///   DiscreteRangeValues: every member is discrete value of the range
  ///   ContinuousRangeValues: [LOW border, TOP border, ...]
  /// </summary>
  /// <param name = "found">- String to insert to DiscreteRangeValues, or parse to ContinuousRangeValues</param>
  private rangeForms(found: string): void {
    let minus: number;
    if ((minus = this.findDelimeter(0, "-", found)) === -1)
    // not found continuous range: num1-num2
    {
      found = NString.TrimStart(found, null);
      let todel: number = 0;
      while (todel < found.length && (todel = this.findDelimeter(todel, "\\", found)) !== -1) {
        // to delete '\' and replace '\\' with '\'
        found = NString.Substring(found, 0, todel) + NString.Substring(found, todel = todel + 1);
        todel = todel + 1;
      }
      if (this._discreteRangeValues === null)
        this._discreteRangeValues = new List<string>();
      this._discreteRangeValues.Add(found);
    }
    else {
      // index of minus found in if statement
      let val: string;
      for (let i: number = 0; i < 2; i = i + 1) {
        if (i === 0) {
          NString.Substring(found, 0, minus);
        }
        else {
          minus = minus + 1;
          // skip blanks between '-' and the value. Heading blanks cause to wrong values.
          while (minus < found.length && found.charAt(minus) === ' '/*' '*/) {
            minus = minus + 1;
          }
          val = NString.Substring(found, minus);
        }
        val = this.deleteChar("\\", val);
        if (this._continuousRangeValues === null) {
          this._continuousRangeValues = new List<string>();
        }
        this._continuousRangeValues.Add(val);
      }
    }
  }

  /// <summary>
  ///   delete String/char from the string
  /// </summary>
  /// <param name = "delete">String to delete</param>
  /// <param name = "String">delete from the String</param>
  private deleteChar(stringToDelete: string, from: string): string {
    let index: number = 0;
    while ((index = NString.IndexOf(from, stringToDelete, index)) !== -1)
      from = NString.Substring(from, 0, index) + NString.Substring(from, index + stringToDelete.length);
    return from;
  }

  /// <summary>
  ///   Find real delimiter, there is no symbol '\' before REAL delimiter
  /// </summary>
  /// <param name = "start">of string, looking in</param>
  /// <param name = "delim">to found</param>
  /// <returns> place of found real delimiter, or -1 -> not found</returns>
  private findDelimeter(start: number, delim: string, str: string): number {
    let found: number = NString.IndexOf(str, delim, start);
    while (found < str.length && found > 0)
      // => found!=-1(not found); found!=0(not first letter)
    {
      if (str.charAt(found - 1) === '\\'/*'\'*/) {
        found = NString.IndexOf(str, delim, found + 1);
      }
      else
        break;
    }
    return found;
  }

  /// <summary>
  ///   add chars to Real and Enable String Buffers
  /// </summary>
  /// <param name = "real">to Real</param>
  /// <param name = "Enable">to Enable</param>
  private setPictures(Real: string, Enable: string): void {
    this._pictureEnable.Append(Enable);
    this._pictureReal.Append(Real);
  }

  setValue(val: string): void {
    this._val = val;
  }

  setOldValue(oldvalue: string): void {
    this._oldvalue = oldvalue;
  }

  setRange(range: string): void {
    this._range = range;
  }

  /// <summary>
  ///   set the "validation failed" flag
  /// </summary>
  setValidationFailed(val: boolean): void {
    this._validationFailed = val;
  }

  /// <summary>
  ///   set isNull flag of the ValDetails
  /// </summary>
  setNull(isNull_: boolean): void {
    this._isNull = isNull_;
  }

  /// <summary>
  ///   returns the valid display value (with mask)
  /// </summary>
  getDispValue(): string {
    let minimumValueLength: number = this._picData.getMinimumValueLength();

    // RTrim the value beyond this index
    if (this._val.length > minimumValueLength) {
      if (minimumValueLength > 0 || StrUtil.rtrim(this._val).length > 0) {
        let str: string = NString.Substring(this._val, minimumValueLength);
        this._val = NString.Substring(this._val, 0, minimumValueLength);
        this._val = this._val + StrUtil.rtrim(str);
      }
    }
    return this._val;
  }

  getOldValue(): string {
    return this._oldvalue;
  }

  getType(): StorageAttribute {
    return this._picData.getAttr();
  }

  getPictureReal(): string {
    return this._pictureReal.ToString();
  }

  getPictureEnable(): string {
    return this._pictureEnable.ToString();
  }

  // for Numeric
  getIsNegative(): boolean {
    return this._picData.isNegative();
  }

  // for Numeric
  getIsPadFill(): boolean {
    return this._picData.padFill();
  }

  // for Numeric
  getPadFillChar(): string {
    return this._picData.getPad();
  }

  // for Numeric, Date, Time
  getIsZeroFill(): boolean {
    return this._picData.zeroFill();
  }

  // for Numeric, Date, Time
  getZeroFillChar(): string {
    return this._picData.getZeroPad();
  }

  // for Numeric
  getNegativeSignPref(): string {
    return this._picData.getNegPref_();
  }

  getDiscreteRangeValues(): List<string> {
    return this._discreteRangeValues;
  }

  getContinuousRangeValues(): List<string> {
    return this._continuousRangeValues;
  }

  getRange(): string {
    return this._range;
  }

  getControl(): MgControlBase {
    return this._control;
  }

  getPIC(): PIC {
    return this._picData;
  }

  getIsNull(): boolean {
    return this._isNull;
  }

  evaluate(): ValidationDetails {
    return this._fieldValidator.checkVal(this);
  }

  /// <summary>
  ///
  /// </summary>
  /// <returns></returns>
  private CloneDiscreteRangeValues(): List<string> {
    let clone: List<string> = new List<string>();
    clone.AddRange(this._discreteRangeValues.GetEnumerator());
    return clone;
  }

  private CloneContinuousRangeValues(): List<string> {
    let clone: List<string> = new List<string>();
    clone.AddRange(this._continuousRangeValues.GetEnumerator());
    return clone;
  }
}
