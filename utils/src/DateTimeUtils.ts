import {
  CultureInfo,
  DateTime,
  DateTimeFormatInfo,
  Exception,
  NConsole,
  NNumber,
  NString,
  StringBuilder
} from "@magic/mscorelib";
import {XMLConstants} from "./XMLConstants";

export class DateTimeUtils {

  // create a DateTime reference from a given string, formatted: "dd/MM/yyyy HH:mm:ss" (HH - 24 hours clock)
  static Parse(dateTimeString: string): DateTime {
    let dateTime: DateTime;

    try {
      dateTime = DateTime.ParseExact(dateTimeString, XMLConstants.CACHED_DATE_TIME_FORMAT, CultureInfo.InvariantCulture);
    }
    catch (ex) {
      if (ex.constructor === Object) {
        let separatorChars: string[] = ['/', ' ', ':', '-'];
        let array: string[] = NString.Split(dateTimeString, separatorChars);
        dateTime = new DateTime(NNumber.Parse(array[2]), NNumber.Parse(array[1]), NNumber.Parse(array[0]), NNumber.Parse(array[3]), NNumber.Parse(array[4]), NNumber.Parse(array[5]));
      }
      else
        throw ex;
      return dateTime;
    }
  }
  /// <summary> returns the number in a 2 digit string
  private static int2str(n: number): string {
		return (n > 9) ? n.toString() : ("0" + n);
	}

	static ToString(dateTime: DateTime, format: string): string;
	static ToString(dateTime: DateTime, formatter: DateTimeFormatInfo): string;
  static ToString(dateTime: DateTime, formatOrFormatter: any): string {
    if (arguments.length === 2 && (dateTime === null || dateTime instanceof DateTime) && (formatOrFormatter === null || formatOrFormatter.constructor === String)) {
			return DateTimeUtils.ToString_0(dateTime, formatOrFormatter);
		}
		return DateTimeUtils.ToString_1(dateTime, formatOrFormatter);
	}

  // format a string from a given DateTime reference.
  // For now only the formats used are supported. If a new format is used, it's treatment
  // should be added.
  // possible format:
  //    (1) "dd/MM/yyyy HH:mm:ss" (HH - 24 hours clock)
  private static ToString_0(dateTime: DateTime, format: string): string {
    let dateTimeString: string;
    try {
      dateTimeString = dateTime.ToString(format, CultureInfo.InvariantCulture);
		}
    catch (ex) {
      if (ex instanceof Exception) {
        if (format === XMLConstants.CACHED_DATE_TIME_FORMAT) {
          dateTimeString = NString.Concat([
						DateTimeUtils.int2str(dateTime.Day), "/", DateTimeUtils.int2str(dateTime.Month), "/", dateTime.Year, " ", DateTimeUtils.int2str(dateTime.Hour), ":", DateTimeUtils.int2str(dateTime.Minute), ":", DateTimeUtils.int2str(dateTime.Second)
					]);
				}
        else {
          if (format === XMLConstants.ERROR_LOG_TIME_FORMAT) {
            dateTimeString = NString.Concat([
							DateTimeUtils.int2str(dateTime.Hour), ":", DateTimeUtils.int2str(dateTime.Minute), ":", DateTimeUtils.int2str(dateTime.Second), "."
						]);
            if (dateTime.Millisecond % 100 > 50) {
              dateTimeString = dateTimeString + (dateTime.Millisecond / 100 + 1);
						}
            else {
              dateTimeString = dateTimeString + dateTime.Millisecond / 100;
						}
					}
          else {
            if (format === XMLConstants.ERROR_LOG_DATE_FORMAT) {
              dateTimeString = NString.Concat([
								DateTimeUtils.int2str(dateTime.Day), "/", DateTimeUtils.int2str(dateTime.Month), "/", dateTime.Year
							]);
						}
            else {

              if (format === XMLConstants.HTTP_ERROR_TIME_FORMAT) {
                dateTimeString = NString.Concat([
									DateTimeUtils.int2str(dateTime.Hour), ":", DateTimeUtils.int2str(dateTime.Minute), ":", DateTimeUtils.int2str(dateTime.Second), "."
								]);
							}
              else {
								NConsole.WriteLine(ex.Message);
                let dateTimeTmpString: StringBuilder = new StringBuilder();
                dateTimeString = dateTimeTmpString.ToString();
							}
						}
					}
				}
			}
			else
				throw ex;
		}
    return dateTimeString;
	}

  // format a string from a given DateTime reference.
  // possible format:
  //    (1) "dd/MM/yyyy HH:mm:ss" (HH - 24 hours clock)
  private static ToString_1(dateTime: DateTime, formatter: DateTimeFormatInfo): string {
    let dateTimeString: string;
    try {
      dateTimeString = dateTime.ToString(formatter);
		}
    catch (ex) {
      if (ex instanceof Exception) {
				NConsole.WriteLine(ex.Message);
        let dateTimeTmpString: StringBuilder = new StringBuilder();
        dateTimeString = dateTimeTmpString.ToString();
			}
			else
				throw ex;
		}
    return dateTimeString;
	}

  constructor() {
	}
}
