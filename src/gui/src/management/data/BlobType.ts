import {ISO_8859_1_Encoding, StorageAttribute, StrUtil} from "@magic/utils";
import {ApplicationException, Debug, Encoding, NConsole, NNumber, NString} from "@magic/mscorelib";
import {Manager} from "../../Manager";
import {GuiConstants} from "../../GuiConstants";

export class BlobType {
  static CONTENT_TYPE_UNKNOWN: string = '0';
  static CONTENT_TYPE_ANSI: string = '1';
  static CONTENT_TYPE_UNICODE: string = '2';
  static CONTENT_TYPE_BINARY: string = '3';

  /// <summary> returns the content type of the blob</summary>
  /// <param name="blob">
  /// </param>
  /// <returns>
  /// </returns>
  static getContentType(blob: string): string {
    try {
      let tokens: string[] = StrUtil.tokenize(blob, ",;");
      return tokens[4].charAt(0);
    }
    catch (Exception) {
      throw new ApplicationException(" in BlobType.getContentType blob is in invalid format");
    }
  }

  /// <summary> Creates an empty blob prefix with a given cell attribute</summary>
  /// <param name="vecCellAttr">in case this blob is vector the cells type else 0
  /// </param>
  /// <returns> an empty blob prefix without the ';" at the end
  /// </returns>
  static getEmptyBlobPrefix(vecCellAttr: string): string {
    return NString.Format("0,0,{0},{1},0", '\0', vecCellAttr);
  }

  /// <param name="contentType">
  /// </param>
  /// <returns>
  /// </returns>
  static getBlobPrefixForContentType(contentType: string): string {
    return NString.Format("0,0,{0},{0},{1};", '\0', contentType);
  }

  /// <summary> returns the header only</summary>
  /// <param name="str">
  /// </param>
  /// <returns>
  /// </returns>
  static getPrefix(str: string): string {
    let idx: number = NString.IndexOf(str, ';')/*';'*/;
    return NString.Substring(str, 0, idx + 1);
  }

  /// <param name="ContentType">
  /// </param>
  /// <returns>
  /// </returns>
  static getEncodingFromContentType(ContentType: string): Encoding {
    let encoding: Encoding;

    if (ContentType === BlobType.CONTENT_TYPE_UNICODE)
      encoding = Encoding.Unicode;
    else if (ContentType === BlobType.CONTENT_TYPE_ANSI)
      encoding = Manager.Environment.GetEncoding();
    else
      encoding = ISO_8859_1_Encoding.getInstance();

    return encoding;
  }

  /// <summary> This function converts ansi bytes to unicode bytes.
  /// </summary>
  /// <param name="BytesInMb"></param>
  /// <returns></returns>
  private static MbToUnicode(BytesInMb: Uint8Array): Uint8Array {
    let result: Uint8Array = null;

    try {
      let UnicodeString: string = Manager.Environment.GetEncoding().GetString(BytesInMb, 0, BytesInMb.length);
      result = Encoding.Unicode.GetBytes(UnicodeString);
    }
    catch (Exception) {
      result = null;
    }

    return result;
  }

  /// <summary> This function converts unicode bytes to ansi bytes.
  /// </summary>
  /// <param name="BytesInUnicode"></param>
  /// <returns></returns>
  private static UnicodeToMb(BytesInUnicode: Uint8Array): Uint8Array {
    let result: Uint8Array = null;

    try {
      let UnicodeString: string = Encoding.Unicode.GetString(BytesInUnicode, 0, BytesInUnicode.length);

      result = Manager.Environment.GetEncoding().GetBytes(UnicodeString);
    }
    catch (Exception) {
      result = null;
    }
    return result;
  }

  /// <summary> Assumes the given blob contains a string and returns it. If the content type of the blob is not Unicode
  /// then assume it is ANSI.
  ///
  /// </summary>
  /// <param name="blob">a valid representation of a blob
  /// </param>
  /// <returns> the string contained by the blob
  /// </returns>
  static getString(blob: string): string {
    let result: string = null;
    let bytes: Uint8Array = null;

    if (BlobType.isValidBlob(blob)) {
      let contentType: string = BlobType.getContentType(blob);
      if (contentType !== BlobType.CONTENT_TYPE_UNICODE)
        contentType = BlobType.CONTENT_TYPE_ANSI;

      try {
        bytes = BlobType.getBytes(blob);

        let encoding: Encoding = BlobType.getEncodingFromContentType(contentType);
        result = encoding.GetString(bytes, 0, bytes.length);

        let index: number = NString.IndexOf(result, '\0')/*' '*/;
        if (index !== -1)
          result = NString.Substring(result, 0, index);
      }
      catch (Exception) {
        result = null;
      }
    }
    else
      Debug.Assert(false);

    return result;
  }

  /// <summary> Create a blob of the specified content type from the display string
  /// </summary>
  /// <param name="blobStr"></param>
  /// <param name="contentType"></param>
  /// <returns></returns>
  static createFromString(blobStr: string, contentType: string): string {
    let blob: string = null;
    let srcContentType: string = contentType;
    let bytes: Uint8Array = null;

    if (contentType !== BlobType.CONTENT_TYPE_UNICODE)
      srcContentType = BlobType.CONTENT_TYPE_ANSI;

    try {
      let encoding: Encoding = BlobType.getEncodingFromContentType(srcContentType);

      bytes = encoding.GetBytes(blobStr);

      blob = BlobType.createFromBytes(bytes, contentType);
    }
    catch (Exception) {
      blob = null;
    }

    return blob;
  }

  /// <summary> Get blob contents as byte array
  ///
  /// </summary>
  /// <param name="blob">contents including blob prefix
  /// </param>
  /// <returns> byte array according to content type in blob prefix
  /// </returns>
  static getBytes(str: string): Uint8Array {
    let bytes: Uint8Array = null;
    let data: string = BlobType.removeBlobPrefix(str);

    try {
      let encoding: Encoding = ISO_8859_1_Encoding.getInstance();
      bytes = encoding.GetBytes(data);
    }
    catch (Exception) {
      bytes = null;
    }

    return bytes;
  }

  /// <summary> Create a blob of the specified content type from the byte array
  ///
  /// </summary>
  /// <param name="Bytes">
  /// </param>
  /// <param name="contentType">
  /// </param>
  /// <returns> string
  /// </returns>
  static createFromBytes(bytes: Uint8Array, contentType: string): string {
    let blobStr = '';
    let blobPrefix: string;
    let blobData: string;

    blobPrefix = BlobType.getBlobPrefixForContentType(contentType);

    try {
      let encoding: Encoding = ISO_8859_1_Encoding.getInstance();
      blobData = encoding.GetString(bytes, 0, bytes.length);
    }
    catch (Exception) {
      blobData = null;
    }

    blobStr = blobPrefix + blobData;

    return blobStr;
  }

  /// <param name="dest">
  /// </param>
  /// <param name="src">
  /// </param>
  /// <returns>
  /// </returns>
  static copyBlob(dest: string, src: string): string {
    let srcBytes: Uint8Array;
    let destBytes: Uint8Array;

    if (src === null)
      return null;
    else if (dest === null)
      return src;

    srcBytes = BlobType.getBytes(src);

    let destContentType: string = BlobType.getContentType(dest);
    let srcContentType: string = BlobType.getContentType(src);

    if (srcContentType === BlobType.CONTENT_TYPE_ANSI && destContentType === BlobType.CONTENT_TYPE_UNICODE)
      destBytes = BlobType.MbToUnicode(srcBytes);
    else if (srcContentType === BlobType.CONTENT_TYPE_UNICODE && destContentType === BlobType.CONTENT_TYPE_ANSI)
      destBytes = BlobType.UnicodeToMb(srcBytes);
    else
      destBytes = srcBytes;

    dest = BlobType.createFromBytes(destBytes, destContentType);

    return dest;
  }

  /// <summary> removes blob prefix from source</summary>
  /// <param name="source">- blob value
  ///
  ///
  /// </param>
  static removeBlobPrefix(source: string): string {
    let idx: number;
    if (source !== null) {
      idx = NString.IndexOf(source, ';');
      if (idx < 0)
        NConsole.Out.WriteLine("Error: invalid blob prefix");
      return NString.Substring(source, idx + 1);
    }
    else
      return null;
  }

  /// <summary> checks if the given string is a valid blob</summary>
  /// <param name="blob">
  /// </param>
  /// <returns> true if the blob is valid
  /// </returns>
  static isValidBlob(blob: string): boolean {
    let isValid: boolean = true;

    if (blob === null || NString.IndexOf(blob, ';') < 0)
      isValid = false;

    if (isValid) {
      let contentType: string = BlobType.getContentType(blob);
      if (contentType !== BlobType.CONTENT_TYPE_ANSI && contentType !== BlobType.CONTENT_TYPE_BINARY && contentType !== BlobType.CONTENT_TYPE_UNICODE && contentType !== BlobType.CONTENT_TYPE_UNKNOWN)
        isValid = false;
    }
    return isValid;
  }

  static setContentType(str: string, contentType: string): string {
    let result: string = "";

    try {
      let prefixLastIndex: number = NString.IndexOf(str, ";");
      let prefix: string = NString.Substring(str, 0, prefixLastIndex);

      let dataLength: number = str.length - (prefix.length + 1);
      let data: string = NString.Substring(str, prefixLastIndex + 1, dataLength);

      let prefixTokens: string[] = StrUtil.tokenize(prefix, ",;");

      for (let i: number = 0; i < GuiConstants.BLOB_PREFIX_ELEMENTS_COUNT; i = i + 1) {
        if (i === 4)
          result = result + contentType + ",";
        else
          result = result + prefixTokens[i] + ",";
      }
      return NString.Substring(result, 0, result.length - 1) + ";" + data;
    }
    catch (Exception) {
      throw new ApplicationException(" in BlobType.setContentType : invalid format");
    }
  }

  /// <summary> Replace the vector's cell attribute in the blob prefix by the specified one</summary>
  /// <param name="str">a valid blob string (i.e. prefix;data) </param>
  /// <param name="vecCellAttr">attribute to insert into the prefix </param>
  /// <returns> modified blob string </returns>
  static SetVecCellAttr(str: string, vecCellAttr: StorageAttribute): string {
    let result: string = "";
    try {
      let prefixLastIndex: number = NString.IndexOf(str, ";");
      let prefix: string = NString.Substring(str, 0, prefixLastIndex);

      let data: string = NString.Substring(str, prefixLastIndex + 1);

      let tokens: string[] = StrUtil.tokenize(prefix, ",;");

      for (let i: number = 0; i < GuiConstants.BLOB_PREFIX_ELEMENTS_COUNT; i = i + 1) {
        if (i === 3)
          result = result + StorageAttribute[<string>vecCellAttr] + ",";
        else
          result = result + tokens[i] + ",";
      }
      return NString.Substring(result, 0, result.length - 1) + ";" + data;
    }
    catch (Exception) {
      throw new ApplicationException(" in XMLparser.blobPrefixLength invalid format");
    }
  }

  /// <summary> Returns the Vector' cell attribute from the prefix. </summary>
  /// <param name="blobStr">A valid blob string  (i.e. prefix;data) </param>
  /// <returns></returns>
  static GetVecCellAttr(blobStr: string): string {
    try {
      let tokens: string[] = StrUtil.tokenize(blobStr, ",;");

      return tokens[3].charAt(0);
    }
    catch (Exception) {
      throw new ApplicationException(" in BlobType.GetVecCellAttr(): blob is in invalid format");
    }
  }

  /// <summary> Calculate the length of the blob prefix. The prefix is in the format:
  /// <tt>"ObjHandle,VariantIdx,ContentType,VecCellAttr;"</tt>. The length includes the commas and the
  /// semicolon.
  ///
  /// </summary>
  /// <param name="blob">a valid blob
  /// </param>
  /// <returns> the blob prefix length
  /// </returns>
  static blobPrefixLength(blob: string): number {
    try {
      let prefixLength: number = NString.IndexOf(blob, ';') + 1;
      let prefix: string = NString.Substring(blob, 0, prefixLength);

      // check if the prefix is valid
      if (prefixLength > 0) {
        let tokens: string[] = StrUtil.tokenize(prefix, ",");
        if (tokens.length === GuiConstants.BLOB_PREFIX_ELEMENTS_COUNT)
          return prefixLength;
      }
    }
    catch (Exception) {
      // invalid prefix
    }

    throw new ApplicationException(" in XMLparser.blobPrefixLength invalid format");
  }

  /// <summary>
  /// gets the key from a blob string
  /// </summary>
  /// <param name="blobStr"></param>
  /// <returns></returns>
  static getKey(blobStr: string): number {
    let tokens: string[] = StrUtil.tokenize(blobStr, ",;");
    let key: number = 0;

    if (tokens.length > 5) {
      try {
        key = NNumber.Parse(tokens[0]);
      }
      catch (Exception) {
      }
    }

    return key;
  }

  /// <summary> calculates the blob size held in the string
  /// </summary>
  /// <param name="blob"> The string holding the blob </param>
  /// <returns></returns>
  static getBlobSize(blob: string): number {
    let size: number = 0;

    try {
      let tokens: string[] = StrUtil.tokenize(blob, ",;");
      if (tokens.length > 5) {
        size = blob.length;
        for (let i: number = 0; i < 5; i = i + 1) {
          size = size - tokens[i].length;
          size = size - 1;
        }
      }
    }
    catch (Exception) {
    }

    return size;
  }

  /// <summary>
  /// Parse content type
  /// </summary>
  /// <param name="contentType"></param>
  /// <returns></returns>
  static ParseContentType(contentType: number): string {
    let newContentType: string = ' ';
    switch (contentType) {
      case 0:
        newContentType = BlobType.CONTENT_TYPE_UNKNOWN;
        break;
      case 1:
        newContentType = BlobType.CONTENT_TYPE_ANSI;
        break;
      case 2:
        newContentType = BlobType.CONTENT_TYPE_UNICODE;
        break;
      case 3:
        newContentType = BlobType.CONTENT_TYPE_BINARY;
    }
    return newContentType;
  }
}
