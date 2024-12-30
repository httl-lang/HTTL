import { Guard, TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { StringLiteralRt } from "../../runtime/runtime-objects/literal";

export class StringLiteralExpression extends TokenExpression {
  private literal: string;

  setLiteral(value: string): void {
    Guard.notNull(value, "value");
    this.literal = value;
  }

  public evaluate(executor: IRuntimeExecutor): StringLiteralRt {
    return new StringLiteralRt(this.literal, executor, this);
  }
}
