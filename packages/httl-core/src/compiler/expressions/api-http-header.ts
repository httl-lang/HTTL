import { CompositeExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { ApiHttpHeaderRt } from "../../runtime/runtime-objects/api-header";
import { HttpHeaderExpression } from "./http-header";
import { VariableExpression } from "./var";

export class ApiHttpHeaderExpression extends CompositeExpression {
  public header: HttpHeaderExpression;
  public api: VariableExpression;

  public setApi(value: VariableExpression) {
    this.addExpressions(value);
    this.api = value;
  }

  public setHeader(value: HttpHeaderExpression) {
    this.addExpressions(value);
    this.header = value;
  }
  public evaluate(executor: IRuntimeExecutor): ApiHttpHeaderRt {
    const apiRt = this.api.evaluate(executor);
    const headerRt = this.header.evaluate(executor);

    return new ApiHttpHeaderRt(apiRt, headerRt, executor, this);
  }
}
