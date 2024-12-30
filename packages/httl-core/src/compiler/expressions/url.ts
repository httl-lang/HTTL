import { CompositeExpression, Expression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { UrlRt } from "../../runtime/runtime-objects/url";
import { StringExpression } from "./string";


export class UrlExpression extends CompositeExpression {
  public url: StringExpression;

  public setUrl(url: Expression) {
    this.addExpressions(url);
    this.url = url as StringExpression;
  }

  public evaluate(executor: IRuntimeExecutor): UrlRt {
    const url = this.url.evaluate(executor);
    return new UrlRt(url, executor, this);
  }
}
