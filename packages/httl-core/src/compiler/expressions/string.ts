import { FormattingContext } from "../../code";
import { CompositeExpression, Expression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { StringRt } from "../../runtime/runtime-objects/string";

export class StringExpression extends CompositeExpression {

  public quoted: boolean;

  public setParts(parts: Expression[]): void {
    this.addExpressions(...parts);
  }

  public setQuoted(quoted: boolean) {
    this.quoted = quoted;
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    const parts = expressions.map(e => e.format(context)).join("");

    return this.quoted ? `"${parts}"` : parts;
  }

  public evaluate(executor: IRuntimeExecutor): StringRt {
    const parts = this.expressions.map(e => e.evaluate(executor));

    return new StringRt(parts, executor, this);
  }
}
