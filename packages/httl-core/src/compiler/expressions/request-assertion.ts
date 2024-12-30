import { CompositeExpression, Expression } from "../../common"
import { IRuntimeExecutor } from "../../runtime"
import { RequestAssertionRt } from "../../runtime/runtime-objects"
import { JsonExpression } from "./json"

export class RequestAssertionExpression extends CompositeExpression {

  public assertion: JsonExpression

  public setAssertion(value: Expression) {
    this.addExpressions(value);
    this.assertion = value as JsonExpression;
  }

  public evaluate(executor: IRuntimeExecutor): RequestAssertionRt {
    const assertionRt = this.assertion.evaluate(executor);
    return new RequestAssertionRt(assertionRt, executor, this);
  }
}