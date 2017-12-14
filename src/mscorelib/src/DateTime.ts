import {NotImplementedException} from "./NotImplementedException";
import {NObject} from "./NObject";
import {IFormatProvider} from "./IFormatProvider";
import {CultureInfo} from "./CultureInfo";

export enum DateTimeKind {
  Local,
  Unspecified,
  Utc
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export class DateTimeFormatInfo extends NObject {
  LongTimePattern: string;
  DateSeparator: string;
  LongDatePattern: string;
  ShortDatePattern: string;
}

export class DateTime extends NObject {
  private dt: Date;
  private kind: DateTimeKind;

  get Kind(): DateTimeKind {
    return this.kind;
  }

  get Ticks(): number {
    throw new NotImplementedException();
  }

  get Year(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCFullYear() : this.dt.getFullYear();
  }

  get Month(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCMonth() + 1 : this.dt.getMonth() + 1;
  }

  get Day(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCDate() : this.dt.getDate();
  }

  get Hour(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCHours() : this.dt.getHours();
  }

  get Minute(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCMinutes() : this.dt.getMinutes();
  }

  get Second(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCSeconds() : this.dt.getSeconds();
  }

  get Millisecond(): number {
    return this.kind === DateTimeKind.Utc ? this.dt.getUTCMilliseconds() : this.dt.getMilliseconds();
  }

  get DayOfWeek(): DayOfWeek {
    return this.dt.getDay();
  }

  constructor();
  constructor(year: number, month: number, day: number);
  constructor(year: number, month: number, day: number, hour: number, minute: number, second: number);
  constructor(year: number = 1, month: number = 1, day: number = 1, hour: number = 1, minute: number = 1, second: number = 1) {
    super();

    if (arguments.length === 0) {
      this.constructor_0();
      return;
    }
    if (arguments.length === 6) {
      this.constructor_1(year, month, day, hour, minute, second);
      return;
    }
    this.constructor_0();
  }

  private constructor_0(year: number = 1, month: number = 1, day: number = 1): void {
    this.dt = new Date(year, month - 1, day);
    this.kind = DateTimeKind.Unspecified;
  }

  private constructor_1(year: number = 1, month: number = 1, day: number = 1, hour: number = 1, minute: number = 1, second: number = 1): void {
    this.dt = new Date(year, month - 1, day, hour, minute, second);
    this.kind = DateTimeKind.Unspecified;
  }

  ToString(): string
  ToString(format: DateTimeFormatInfo): string
  ToString(format: string, cultureInfo?: CultureInfo): string
  ToString(dateTimeFormatInfoOrString?: any): string {
    // to do: implement this
    return this.kind === DateTimeKind.Utc ? this.dt.toUTCString() : this.dt.toString();
  }

  static get UtcNow(): DateTime {
    var d = new DateTime();
    d.dt = new Date();
    d.kind = DateTimeKind.Utc;
    return d;
  }

  static get Now(): DateTime {
    var d = new DateTime();
    d.dt = new Date();
    d.kind = DateTimeKind.Local;
    return d;
  }

  static op_Subtraction(x: DateTime, y: DateTime): TimeSpan {
    return TimeSpan.FromSeconds((x.dt.getTime() - y.dt.getTime()) / 1000);
  }

  static op_GreaterThanOrEqual(x: DateTime, y: DateTime): boolean {
    return x.dt >= y.dt;
  }

  static ParseExact(s: string, format: string, provider: IFormatProvider): DateTime {
    throw new NotImplementedException();
  }
}

export class TimeSpan extends NObject {
  private ticks: number;

  constructor(ticks: number) {
    super();
    this.ticks = ticks;
  }

  get TotalDays(): number {
    throw new NotImplementedException();
  }

  get Days(): number {
    throw new NotImplementedException();
  }

  get Hours(): number {
    throw new NotImplementedException();
  }

  get Minutes(): number {
    throw new NotImplementedException();
  }

  get Seconds(): number {
    throw new NotImplementedException();
  }

  static FromSeconds(seconds: number): TimeSpan {
    return new TimeSpan(seconds * 100e9);
  }

  static FromDays(days: number): TimeSpan {
    var hours = days * 24;
    var minutes = 60 * hours;
    return TimeSpan.FromSeconds(60 * minutes);
  }

  static op_GreaterThanOrEqual(x: TimeSpan, y: TimeSpan) {
    return x.ticks >= y.ticks;
  }
}
