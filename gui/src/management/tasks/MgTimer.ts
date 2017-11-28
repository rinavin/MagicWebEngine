/// <summary>
/// This class acts as base class for the timers implemented in RC and Merlin.
/// </summary>
import Timer = NodeJS.Timer;
import {Events} from "../../Events";
export abstract class MgTimer {
  // member variables.
  protected _timerIntervalMilliSeconds: number = 0;
  private _threadTimer: Timer = null;

  ///<summary>Constructor</summary>
  ///<param name="timerIntervalMilliSeconds">Timer Interval in milliseconds
  ///</param>
  constructor(timerIntervalMilliSeconds: number) {
    this._timerIntervalMilliSeconds = timerIntervalMilliSeconds;
  }

  /// <summary>Call back method of threading timer.
  /// <param name="state"></param>
  /// </summary>
  static Run(state: any): void {
    Events.OnTimer(<MgTimer>state);
  }

  /// <summary>
  /// Starts the timer thread with the interval passed in milliseconds.
  /// </summary>
  Start(): void {
    // TODO
    // this._threadTimer = new Timer(MgTimer.Run, this, this._timerIntervalMilliSeconds, this._timerIntervalMilliSeconds);
  }

  /// <summary>Stops the thread.
  /// </summary>
  Stop(): void {
    // TDDO
    // this._threadTimer.Dispose();
  }
}
