import { FormattingContext } from "../../code";
import { CompositeExpression, Expression } from "../../common"
import { IRuntimeExecutor } from "../../runtime"
import { BinaryBodyRt, FormBodyRt, JsonBodyRt, RawBodyRt, RequestBodyRt, UrlEncodedBodyRt } from "../../runtime/runtime-objects/request-body";
import { FileExpression } from "./file";
import { JsonExpression } from "./json";
import { StringExpression } from "./string";

export type RequestBodyType = 'json' | 'formdata' | 'urlencoded' | 'bin' | 'raw';

export class RequestBodyExpression extends CompositeExpression {
  public type: RequestBodyType
  public body: Expression

  public setType(type: RequestBodyType) {
    this.type = type;
  }

  public setBody(body: Expression) {
    this.addExpressions(body);
    this.body = body;
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    return this.type !== 'json'
      ? `${this.type} ${this.body.format(context)}`
      : this.body.format(context);
  }

  public evaluate(executor: IRuntimeExecutor): RequestBodyRt<Expression> {

    switch (this.type) {
      case 'json':
        return new JsonBodyRt(executor, this.body as JsonExpression);
      case 'formdata':
        return new FormBodyRt(executor, this.body as JsonExpression);
      case 'urlencoded':
        return new UrlEncodedBodyRt(executor, this.body as JsonExpression);
      case 'bin':
        return new BinaryBodyRt(executor, this.body as FileExpression);
      case 'raw':
        return new RawBodyRt(executor, this.body as StringExpression);
    }

    throw new Error('Invalid request body type');
  }
}