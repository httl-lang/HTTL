import { FormattingContext } from "../../code";
import { CompositeExpression, Expression, Guard, TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { HttpHeaderNameRt, HttpHeaderRt, HttpHeaderValueRt } from "../../runtime/runtime-objects";

export class HttpHeaderNameExpression extends TokenExpression {
  public name: string;
  public isExt: boolean;

  public setName(value: string) {
    Guard.notNull(value, "value");
    this.name = value;
  }

  public setIsExt(value: boolean) {
    this.isExt = value;
  }

  protected formatExpression(context: FormattingContext): string {
    return (this.isExt ? `@${this.name}` : this.name).trim();
  }

  public evaluate(executor: IRuntimeExecutor): HttpHeaderNameRt {
    return new HttpHeaderNameRt(this.name, executor, this);
  }
}

export class HttpHeaderValueExpression extends CompositeExpression {
  public parts: Expression[];

  public setValue(exprs: Expression[]) {
    this.addExpressions(...exprs);
    this.parts = exprs;
  }

  public evaluate(executor: IRuntimeExecutor): HttpHeaderValueRt {
    const values = this.parts.map(p => p.evaluate(executor));
    return new HttpHeaderValueRt(values, executor, this);
  }
}

export class HttpHeaderExpression extends CompositeExpression {
  public header: HttpHeaderNameExpression;
  public value: HttpHeaderValueExpression;
  public isExt: boolean

  public setHeader(value: Expression) {
    this.addExpressions(value);
    this.header = value as HttpHeaderNameExpression;
    this.isExt = this.header.isExt;
  }

  public setIsExt(value: boolean) {
    this.isExt = value;
  }

  public setValue(value: Expression) {
    this.addExpressions(value);
    this.value = value as HttpHeaderValueExpression;
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    const name = this.header.format(context).trim()
    const value = this.value.format(context.padRight('\n')).trim()

    return `${name}: ${value}` + '\n';
  }

  public evaluate(executor: IRuntimeExecutor): HttpHeaderRt {
    const valueRt = this.value.evaluate(executor);
    const stringRt = this.header.evaluate(executor);
    return new HttpHeaderRt(stringRt, valueRt, this.isExt, executor, this);
  }
}
