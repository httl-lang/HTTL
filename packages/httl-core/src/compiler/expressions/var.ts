import { FormattingContext } from "../../code";
import { Guard, TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { VariableRt } from "../../runtime/runtime-objects/var";

export class VariableExpression extends TokenExpression {
  name: string;
  declaring: boolean;
  interpolation: boolean;

  public setName(value: string) {
    Guard.notEmptyString(value);
    this.name = value;
  }

  public setDeclaring(value: boolean) {
    this.declaring = value;
  }

  public setInterpolation(value: boolean) {
    this.interpolation = value;
  }

  protected override formatExpression(context: FormattingContext): string {
    if (this.interpolation)
      return `{${this.name.trim()}}`;

    return this.name.trim();
  }

  public evaluate(executor: IRuntimeExecutor): VariableRt {
    return new VariableRt(this.name, this.declaring, executor, this);
  }
}
