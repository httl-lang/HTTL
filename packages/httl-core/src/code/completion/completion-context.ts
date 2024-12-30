import { Position, RuntimeObjectBase } from "../../common";
import { IRuntimeExecutor } from "../../runtime";

export interface Caller {
  caller: RuntimeObjectBase;
  data?: any;
}

export enum CompletionTarget {
  Current = 0,
  Next = 1,
}

export class CompletionContext {

  private callers: Caller[] = [];
  public target: CompletionTarget = CompletionTarget.Current;

  constructor(
    public readonly executor: IRuntimeExecutor,
    public readonly position: Position,
    public readonly inline: boolean,
    caller: RuntimeObjectBase
  ) {
    this.callers.push({ caller });
  }

  public push(caller: RuntimeObjectBase, data?: any): CompletionContext {
    this.callers.push({ caller, data });
    return this;
  }

  public last(): Caller {
    return this.callers.at(-1);
  }
}