import { TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { SyntaxErrorRt } from "../../runtime/runtime-objects";

export class ErrorNodeExpression extends TokenExpression {
  public error: string;

  public setErrorMessage(value: string) {
    this.error = value;
  }

  public evaluate(executor: IRuntimeExecutor): SyntaxErrorRt {
    return new SyntaxErrorRt(executor, this);
  }
}
