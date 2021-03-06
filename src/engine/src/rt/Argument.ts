import {ApplicationException, Int32, StringBuilder, NNumber} from "@magic/mscorelib";
import {Logger, StorageAttribute, StorageAttributeCheck, StrUtil, UtilStrByteMode} from "@magic/utils";
import {BlobType, DisplayConvertor, ExpVal, FieldDef, Manager, NUM_TYPE, PIC} from "@magic/gui";
import {Expression} from "../exp/Expression";
import {Field} from "../data/Field";
import {Expression_ReturnValue} from "../../index";
import {Task} from "../tasks/Task";
import {GUIManager} from "../GUIManager";
import {ConstInterface} from "../ConstInterface";


export class Argument {
  private _exp: Expression = null;
  private _fld: Field = null;
  private _skip: boolean = false;
  private _type: string = '\0'; // Field|Expression|Value
  private _val: string = null;
  private _valueAttr: StorageAttribute = StorageAttribute.NONE; // true is argument is of type ARG_TYPE_VALUE and
  private _valueIsNull: boolean = false;

  constructor();
  constructor(field: Field);
  constructor(expVal: ExpVal);
  constructor(srcArg: Argument);
  constructor(fieldOrExpValOrSrcArg?: any) {
    if (arguments.length === 0) {
      this.constructor_0();
      return;
    }
    if (arguments.length === 1 && (fieldOrExpValOrSrcArg === null || fieldOrExpValOrSrcArg instanceof Field)) {
      this.constructor_1(fieldOrExpValOrSrcArg);
      return;
    }
    if (arguments.length === 1 && (fieldOrExpValOrSrcArg === null || fieldOrExpValOrSrcArg instanceof ExpVal)) {
      this.constructor_2(fieldOrExpValOrSrcArg);
      return;
    }
    this.constructor_3(fieldOrExpValOrSrcArg);
  }

  /// <summary>
  ///   CTOR
  /// </summary>
  private constructor_0(): void {
    this._type = '\0'/*' '*/;
    this._fld = null;
    this._exp = null;
    this._skip = false;
  }

  /// <summary>
  /// CTOR - create an argument from a field
  /// </summary>
  private constructor_1(field: Field): void {
    this._fld = field;
    this._type = ConstInterface.ARG_TYPE_FIELD /*'F'*/;
    this._exp = null;
    this._skip = false;
  }

  /// <summary>
  ///   CTOR that creates a "Value" type argument from a given Expression Value
  /// </summary>
  /// <param name = "expVal">the source expression value</param>
  private constructor_2(expVal: ExpVal): void {
    this._type = ConstInterface.ARG_TYPE_VALUE;
    this._fld = null;
    this._exp = null;
    this._skip = false;

    if (expVal.IsNull)
      this._val = null;
    else
      this._val = expVal.ToMgVal();

    this._valueIsNull = (this._val === null);
    this._valueAttr = expVal.Attr;
  }

  /// <summary>
  ///   CTOR that creates a "Value" type argument from a given Field or Expression type
  ///   argument
  /// </summary>
  /// <param name = "srcArg">the source argument</param>
  constructor_3(srcArg: Argument) {
    let retVal: Expression_ReturnValue;
    this._type = ConstInterface.ARG_TYPE_VALUE;

    switch (srcArg._type) {
      case ConstInterface.ARG_TYPE_FIELD:
        this._val = srcArg._fld.getValue(true);
        this._valueIsNull = srcArg._fld.isNull();
        this._valueAttr = srcArg._fld.getType();
        break;

      case ConstInterface.ARG_TYPE_EXP:
        retVal = srcArg._exp.evaluate(255);
        this._val = retVal.mgVal;

        this._valueAttr = retVal.type;

        this._valueIsNull = (this._val == null);
        if (this._valueIsNull)
          this._val = Argument.getEmptyValue((retVal.type === StorageAttribute.BLOB ||
            retVal.type === StorageAttribute.BLOB_VECTOR));
        break;

      case ConstInterface.ARG_TYPE_SKIP:
        this._skip = true;
        break;
      default:
        throw new ApplicationException("in Argument.Argument(): illegal source Argument type!");
    }
  }

  /// <summary>
  ///   Parsing Argument string and fill inner objects
  /// </summary>
  /// <param name = "arg">string to parse </param>
  /// <param name = "srcTask">of the argument to find expression argument </param>
  public fillData(arg: String, srcTask: Task): void {
    this._type = arg[0];
    let argElements: string = arg.substr(2);

    switch (this._type) {
      case ConstInterface.ARG_TYPE_FIELD: {
        let fieldId: string[] = argElements.split(',');
        let parent: number =  NNumber.Parse(fieldId[0]);
        let fldIdx: number =  NNumber.Parse(fieldId[1]);
        this._fld = <Field>srcTask.getFieldDef(parent, fldIdx);
      }
        break;

      case ConstInterface.ARG_TYPE_EXP:
        let expNum: number = NNumber.Parse(argElements);
        this._exp = srcTask.getExpById(expNum);
        break;

      case ConstInterface.ARG_TYPE_SKIP:
        this._skip = true;
        break;
      default:
        Logger.Instance.WriteExceptionToLog("in Argument.FillData() illegal type: " + arg);
        break;
    }
  }

  /// <summary>
  ///   build the XML string for the argument
  /// </summary>
  /// <param name = "message">the XML string to append the argument to</param>
  public buildXML(message: StringBuilder): void {
    switch (this._type) {
      case ConstInterface.ARG_TYPE_FIELD:
        message.Append("F:" + this._fld.getTask().getTaskTag() + "," + this._fld.getId());
        break;

      case ConstInterface.ARG_TYPE_EXP:
        message.Append("E:" + this._exp.getId());
        break;

      case ConstInterface.ARG_TYPE_SKIP:
        message.Append("X:0");
        break;

      default:
        Logger.Instance.WriteExceptionToLog("in Argument.buildXML() illegal type: " + this._type);
        break;
    }
  }

  /// <summary>
  ///   returns the type of the argument
  /// </summary>
  getType(): string {
    return this._type;
  }

  /// <summary>
  ///   for field type arguments returns a reference to the field
  /// </summary>
  getField(): Field {
    if (this._type === ConstInterface.ARG_TYPE_FIELD)
      return this._fld;
    return null;
  }

  /// <summary>
  ///   for expression type arguments returns a reference to the expression
  /// </summary>
  protected getExp(): Expression {
    if (this._type === ConstInterface.ARG_TYPE_EXP)
      return this._exp;
    return null;
  }

  /// <summary>
  ///   set the value of this argument to a given field
  /// </summary>
  /// <param name = "destFld">the destination field
  /// </param>
  public setValueToField(destFld: Field): void {
    let val: string;
    let isNull: boolean;

    switch (this._type) {
      case ConstInterface.ARG_TYPE_FIELD:
        val = this._fld.getValue(true);
        val = Argument.convertArgs(val, this._fld.getType(), destFld.getType());
        isNull = this._fld.isNull() || val == null;
        break;

      case ConstInterface.ARG_TYPE_EXP:
        val = this._exp.evaluate(destFld.getType(), destFld.getSize());
        isNull = (val == null);
        if (isNull)
          val = Argument.getEmptyValue((destFld.getType() === StorageAttribute.BLOB ||
            destFld.getType() === StorageAttribute.BLOB_VECTOR));
        break;
      case ConstInterface.ARG_TYPE_VALUE:
        val = Argument.convertArgs(this._val, this._valueAttr, destFld.getType());
        isNull = this._valueIsNull || val == null;
        break;
      default:
        return;
    }
    // Update destination field's _isNULL with the value from record. This is needed to identify
    // if the variable is modified.
    destFld.takeValFromRec();
    destFld.setValueAndStartRecompute(val, isNull, (<Task>destFld.getTask()).DataViewWasRetrieved, false, true);
  }

  /// <summary>
  /// converts Alpha/Unicode values to Blob and vice versa.
  /// </summary>
  /// <param name="value"></param>
  /// <param name="srcAttr"></param>
  /// <param name="expectedType"></param>
  /// <returns></returns>
  public static convertArgs(value: string, srcAttr: StorageAttribute, expectedType: StorageAttribute): string {
    let invalidArg: boolean = false;

    switch (expectedType) {
      case StorageAttribute.ALPHA:
      case StorageAttribute.UNICODE:
        if (srcAttr === StorageAttribute.BLOB) {
          if (BlobType.isValidBlob(value))
            value = BlobType.getString(value);
        }
        else if (!StorageAttributeCheck.IsTypeAlphaOrUnicode(srcAttr))
          invalidArg = true;
        break;

      case StorageAttribute.NUMERIC:
      case StorageAttribute.DATE:
      case StorageAttribute.TIME:
        if (!StorageAttributeCheck.isTypeNumeric(srcAttr))
          invalidArg = true;
        break;

      case StorageAttribute.BLOB:
        if (StorageAttributeCheck.IsTypeAlphaOrUnicode(srcAttr)) {
          let contentType: string = srcAttr === StorageAttribute.ALPHA
            ? BlobType.CONTENT_TYPE_ANSI
            : BlobType.CONTENT_TYPE_UNICODE;
          value = BlobType.createFromString(value, contentType);
        }
        else if (!StorageAttributeCheck.isTypeBlob(srcAttr))
          invalidArg = true;
        break;
    }

    // If there is mismatch in attribute, take default value of expectd argument.
    if (invalidArg)
      value = FieldDef.getMagicDefaultValue(expectedType);
    return value;
  }

  /// <summary>
  ///   get value of Argument
  /// </summary>
  /// <param name = "expType">type of expected type of evaluation</param>
  /// <param name = "expSize">size of expected string from evaluation</param>
  /// <returns> value of the Argument</returns>
  public getValue(expType: StorageAttribute, expSize: number): string {
    switch (this._type) {
      case ConstInterface.ARG_TYPE_EXP:
        this._val = this._exp.evaluate(expType, expSize);
        if (this._val == null)
          this._val = Argument.getEmptyValue(expType === StorageAttribute.BLOB
            || expType === StorageAttribute.BLOB_VECTOR);
        break;

      case ConstInterface.ARG_TYPE_FIELD:
        this._val = this._fld.getValue(true);
        break;

      case ConstInterface.ARG_TYPE_VALUE:
        break;

      default:
        return null;
    }
    return this._val;
  }

  /// <returns> translation of this argument into Magic URL style (e.g. -Aalpha or -N17 etc.)</returns>
  public toURL(htmlArgs: StringBuilder, makePrintable: boolean): void {
    if (!this.skipArg()) {
      let argValue: string = null, rangeStr = null;
      let attribute: StorageAttribute = StorageAttribute.NONE;
      let isNull: boolean = false;
      let pic: PIC = null;
      let num1: NUM_TYPE, num2;
      let retVal: Expression_ReturnValue;
      let compIdx: number = 0;

      // Get the value and attribute and set the "is null" flag according
      // to the argument type
      switch (this._type) {
        case ConstInterface.ARG_TYPE_VALUE:
          isNull = this._valueIsNull;
          attribute = this._valueAttr;
          argValue = this._val;
          break;

        case ConstInterface.ARG_TYPE_EXP:
          retVal = this._exp.evaluate(2000);
          argValue = retVal.mgVal;
          if (argValue == null)
            isNull = true;
          else attribute = retVal.type;
          compIdx = this._exp.getTask().getCompIdx();
          break;

        case ConstInterface.ARG_TYPE_FIELD:
          if (this._fld.isNull())
            isNull = true;
          else {
            argValue = this._fld.getValue(false);
            attribute = this._fld.getType();
          }
          compIdx = this._fld.getTask().getCompIdx();
          break;

        case ConstInterface.ARG_TYPE_SKIP:
          isNull = true; // #919535 If argument is skipped then pass NULL it will handled in server.
          break;
      }
      // Create the argument string
      if (isNull)
        htmlArgs.Append(ConstInterface.REQ_ARG_NULL);
      else {
        switch (attribute) {
          case StorageAttribute.NUMERIC:
            num1 = new NUM_TYPE(argValue);
            num2 = new NUM_TYPE(argValue);
            num1.round(0);
            if (NUM_TYPE.num_cmp(num1, num2) === 0) {
              pic = new PIC("" + UtilStrByteMode.lenB(argValue),
                StorageAttribute.ALPHA, compIdx);

              let numDispVal: String = num2.to_a(pic).Trim();
              if (numDispVal.length <= 9)
                htmlArgs.Append(ConstInterface.REQ_ARG_NUMERIC + num2.to_a(pic).Trim());
              else
                htmlArgs.Append(ConstInterface.REQ_ARG_DOUBLE + num2.to_double());
            }
            else
              htmlArgs.Append(ConstInterface.REQ_ARG_DOUBLE + num2.to_double());
            break;

          case StorageAttribute.DATE:
            pic = new PIC(Manager.GetDefaultDateFormat(), attribute, compIdx);
            rangeStr = "";
            htmlArgs.Append(ConstInterface.REQ_ARG_ALPHA);
            break;

          case StorageAttribute.TIME:
            pic = new PIC(Manager.GetDefaultTimeFormat(), attribute, compIdx);
            rangeStr = "";
            htmlArgs.Append(ConstInterface.REQ_ARG_ALPHA);
            break;

          case StorageAttribute.ALPHA:
          // alpha strings are kept internally as Unicode, so fall through to unicode case...
          case StorageAttribute.UNICODE:
            pic = new PIC("" + UtilStrByteMode.lenB(argValue), attribute, compIdx);
            rangeStr = "";
            htmlArgs.Append(ConstInterface.REQ_ARG_UNICODE);
            break;

          case StorageAttribute.BLOB:
            pic = new PIC("", attribute, compIdx);
            rangeStr = "";
            let contentType: string = BlobType.getContentType(argValue);

            // ANSI blobs are later translated to Unicode
            if (contentType === BlobType.CONTENT_TYPE_UNICODE || contentType === BlobType.CONTENT_TYPE_ANSI)
              htmlArgs.Append(ConstInterface.REQ_ARG_UNICODE);
            else
              htmlArgs.Append(ConstInterface.REQ_ARG_ALPHA);
            break;

          case StorageAttribute.BLOB_VECTOR:
            pic = new PIC("", attribute, compIdx);
            rangeStr = "";
            htmlArgs.Append(ConstInterface.REQ_ARG_ALPHA);
            // QCR 970794 appending eye catcher for vectors passed as arguments on hyperlink
            argValue = ConstInterface.MG_HYPER_ARGS + BlobType.removeBlobPrefix(argValue) + ConstInterface.MG_HYPER_ARGS;
            break;

          case StorageAttribute.BOOLEAN:
            pic = new PIC("5", attribute, compIdx);
            rangeStr = "TRUE,FALSE";
            htmlArgs.Append(ConstInterface.REQ_ARG_LOGICAL);
            break;
        }
        if (attribute !== StorageAttribute.NUMERIC) {
          let finalValue: string = StrUtil.rtrim(DisplayConvertor.Instance.mg2disp(argValue, rangeStr, pic, compIdx, false));

          // QCR 970794 converting the url to a legal format
          htmlArgs.Append(makePrintable
                            ? GUIManager.Instance.makeURLPrintable(finalValue)
                            : finalValue);
        }
      }
    }
  }

  /// <returns> value of the skip flag </returns>
  skipArg(): boolean {
    return this._skip;
  }

  /// <summary>
  ///   This method fills the argument data from the mainProgVar strings
  /// </summary>
  /// <param name = "mainProgVar">- a vector of strings of main program variables</param>
  /// <param name = "mainProgTask">- the main program task</param>
  fillDataByMainProgVars(mainProgVar: string, mainProgTask: Task): void {
    if (mainProgVar === "Skip") {
      this._skip = true;
    }
    else {
      let fldId: number = NNumber.Parse(mainProgVar) - 1;
      this._type = ConstInterface.ARG_TYPE_VALUE;
      this._fld = <Field>mainProgTask.getFieldDef(fldId);
      this._val = this._fld.getValue(true);
      this._valueIsNull = this._fld.isNull();
      this._valueAttr = this._fld.getType();
    }
  }

  /// <summary>
  ///   fill an argument data from a parameter data
  /// </summary>
  /// <param name = "paramValueAttr"></param>
  /// <param name = "paramValue"></param>
  /// <param name = "paramNull"></param>
  fillDataByParams(paramValueAttr: StorageAttribute, paramValue: string, paramNull: boolean): void {
    this._valueAttr = paramValueAttr;
    this._val = paramValue;
    this._valueIsNull = paramNull;

    // The server indicates skip on a parameter by sending DATA_TYPE_SKIP instead of the real attribute.
    if (this._valueAttr === StorageAttribute.SKIP) {
      this._type = ConstInterface.ARG_TYPE_SKIP /*'X'*/;
      this._skip = true;
    }
    else {
      this._type = ConstInterface.ARG_TYPE_VALUE /*V*/;
    }
  }

  /// <summary> returns empty value</summary>
  /// <param name="isBlob">- true is value is for blob</param>
  private static getEmptyValue(isBlob: boolean): string {
    return isBlob ? (BlobType.getEmptyBlobPrefix('\0') /*' '*/ + ";") : "";
  }

  /// <summary>
  /// fill the argument from a string
  /// </summary>
  /// <param name="argStr"></param>
  public FillFromString(argStr: string): void {
    // type is always a value
    this._type = ConstInterface.ARG_TYPE_VALUE;

    let argType: string = null;
    // If string is shorter than 3, assume it does not have an attribute identifier
    if (argStr.length > 2)
      argType = argStr.substr(0, 2);

    switch (argType) {
      case ConstInterface.REQ_ARG_ALPHA:
        this._valueAttr = StorageAttribute.ALPHA;
        break;
      case ConstInterface.REQ_ARG_UNICODE:
        this._valueAttr = StorageAttribute.UNICODE;
        break;
      case ConstInterface.REQ_ARG_NUMERIC:
        this._valueAttr = StorageAttribute.NUMERIC;
        break;
      case ConstInterface.REQ_ARG_DOUBLE:
        this._valueAttr = StorageAttribute.NUMERIC;
        break;
      case ConstInterface.REQ_ARG_LOGICAL:
        this._valueAttr = StorageAttribute.BOOLEAN;
        break;
      case ConstInterface.REQ_ARG_NULL:
        this._valueAttr = StorageAttribute.NONE;
        break;
      default:
        // if storage type is not defined, assume alpha string and the entire string is the value
        this._valueAttr = StorageAttribute.ALPHA;
        this._val = argStr;
        return
    }
    // the case the string is too short was dealt with earlier - it will get to the default case in the switch
    // and return from there
    this._val = argStr.substr(2);
  }
}
