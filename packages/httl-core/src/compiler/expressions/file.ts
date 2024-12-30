import { CompositeExpression, Expression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { FileRt } from "../../runtime/runtime-objects";
import { StringExpression } from "./string";

export class FileExpression extends CompositeExpression {
  private path: StringExpression;

  public setPath(value: Expression) {
    this.addExpressions(value);
    this.path = value as StringExpression;
  }

  public evaluate(executor: IRuntimeExecutor): FileRt {
    const pathRt = this.path.evaluate(executor);
    return new FileRt(pathRt, executor, this);
  }
}
