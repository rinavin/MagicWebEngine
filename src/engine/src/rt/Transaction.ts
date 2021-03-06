import {Task} from "../tasks/Task";
import {ConstInterface} from "../ConstInterface";

export class Transaction {
  private _transId: string = null;

  // holds the recovery type of a failed transaction so we can ask if we are after retry.
  private _afterTransRetry: string = ConstInterface.RECOVERY_NONE;

  private _transBegin: string = '\0';
  Opened: boolean = false;
  OwnerTask: Task = null;

  // it is for relevant for local transaction, so it will be easy to debug
  LocalTransactionId: number = 0;

  /// <summary>
  ///   CTOR
  /// </summary>
  /// <param name = "task">the task who owns this transaction </param>
  /// <param name="setTransId"></param>
  constructor(task: Task, setTransId: string, isLocalTransaction: boolean) {
    this.OwnerTask = task;
    this._transId = setTransId;
    this._transBegin = ConstInterface.TRANS_TASK_PREFIX /*'T'*/;
  }

  /// <summary>
  ///   returns true if the given task is the owner of this transaction
  /// </summary>
  /// <param name = "task">the task to check </param>
  isOwner(task: Task): boolean {
    return task === this.OwnerTask;
  }

  /// <summary>
  ///   close the transaction
  /// </summary>
  close(): void {
    this.Opened = false;
  }

  /// <summary>
  ///   opens the transaction - should be called when an update occured
  /// </summary>
  open(): void {
    this.Opened = true;
  }

  /// <summary>
  ///   returns true if the transaction was opened
  /// </summary>
  isOpened(): boolean {
    return this.Opened;
  }

  /// <summary>
  ///   signalls wheather we are now in the process of retrying a failed transaction
  /// </summary>
  setAfterRetry(val: string): void {
    this._afterTransRetry = val;
  }

  getAfterRetry(): boolean;
  getAfterRetry(recovery: string): boolean;
  getAfterRetry(recovery?: string): boolean {
    if (arguments.length === 0) {
      return this.getAfterRetry_0();
    }
    return this.getAfterRetry_1(recovery);
  }

  /// <summary>
  ///   return true if we are after a transaction retry
  /// </summary>
  private getAfterRetry_0(): boolean {
    return this._afterTransRetry !== ConstInterface.RECOVERY_NONE /*' '*/;
  }

  /// <summary>
  ///   return true if we are after a transaction with recovery RECOVERY_RETRY
  /// </summary>
  private getAfterRetry_1(recovery: string): boolean {
    return this._afterTransRetry === recovery;
  }

  /// <summary>
  ///   returns the transaction level (Task/Record)
  /// </summary>
  getLevel(): string {
    return this._transBegin;
  }

  /// <summary>
  ///   sets the level of the Transaction
  /// </summary>
  setTransBegin(val: string): void {
    this._transBegin = val;
  }

  /// <summary>
  ///   gets transId
  /// </summary>
  getTransId(): string {
    return this._transId;
  }

  /// <summary>
  ///   sets Owner task
  /// </summary>
  setOwnerTask(task: Task): void {
    this.OwnerTask = task;
  }
}
