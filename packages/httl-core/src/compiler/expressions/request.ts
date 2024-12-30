import { FormattingContext } from "../../code"
import { CompositeExpression, Expression } from "../../common"
import { IRuntimeExecutor } from "../../runtime"
import { RequestRt } from "../../runtime/runtime-objects"
import { KeywordExpression } from "./keyword"
import { RequestAssertionExpression } from "./request-assertion"
import { RequestBodyExpression } from "./request-body"
import { UrlExpression } from "./url"
import { VariableExpression } from "./var"

export class RequestExpression extends CompositeExpression {
  public api: VariableExpression

  public method: KeywordExpression
  public url: UrlExpression
  public headers: Expression[] = []
  public body: RequestBodyExpression
  public var: VariableExpression
  public assert: RequestAssertionExpression

  public setApi(value: VariableExpression) {
    this.addExpressions(value);
    this.api = value;
  }

  public setMethod(value: Expression) {
    this.addExpressions(value);
    this.method = value as KeywordExpression;
  }

  public setUrl(value: Expression) {
    this.addExpressions(value);
    this.url = value as UrlExpression;
  }

  public setHeaders(exp: Expression[]) {
    this.addExpressions(...exp);
    this.headers = [...exp];
  }

  public setBody(value: Expression) {
    this.addExpressions(value);
    this.body = value as RequestBodyExpression;
  }

  public setVar(value: Expression) {
    this.addExpressions(value);
    this.var = value as VariableExpression;
  }

  public setAssert(value: Expression) {
    this.addExpressions(value);
    this.assert = value as RequestAssertionExpression
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    let formatedText = `${this.method.format(context).trim()} ${this.url.format(context)}`.trim();

    if (this.headers?.length > 0) {
      const headers = this.headers?.map(h => h.format(context).trim()).join('\n')
      formatedText += `\n${headers}`
    }

    if (this.body) {
      if (this.headers?.length > 0) {
        formatedText += '\n'
      } else {
        formatedText += ' '
      }
      formatedText += `${this.body.format(context).trim()}\n`
    }

    if (this.var) {
      if (!formatedText.endsWith('\n') || !formatedText.endsWith(' '))
        formatedText += ' '

      formatedText += `as ${this.var.format(context).trim()}\n`
    }

    if (this.assert) {
      formatedText += `\nassert ${this.assert.format(context).trim()}\n`
    }

    return formatedText.trim() + '\n';
  }

  public evaluate(executor: IRuntimeExecutor): RequestRt {

    const apiRt = this.api.evaluate(executor);
    const methodRt = this.method.evaluate(executor);
    const urlRt = this.url.evaluate(executor);
    const headersRt = this.headers.map(h => h.evaluate(executor));
    const bodyRt = this.body ? this.body.evaluate(executor) : null;
    const varRt = this.var ? this.var.evaluate(executor) : null;
    const assertRt = this.assert ? this.assert.evaluate(executor) : null;


    return new RequestRt(
      apiRt,
      methodRt,
      urlRt,
      headersRt,
      bodyRt,
      varRt,
      assertRt,
      executor,
      this);
  }
}