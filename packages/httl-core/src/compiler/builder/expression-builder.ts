import { Token, TokenRange } from "../../common";
import { UseExpression, RequestExpression, ApiHttpHeaderExpression, HttpHeaderExpression, StringExpression, StringLiteralExpression, JsonExpression, JsonObjectExpression, JsonArrayExpression, JsonLiteralExpression, JsonNumberExpression, UrlExpression, FileExpression, VariableExpression, ErrorNodeExpression, ProgramExpression, RequestBodyExpression, HttpHeaderNameExpression, HttpHeaderValueExpression } from "../expressions";
import { KeywordExpression } from "../expressions/keyword";
import { RequestAssertionExpression } from "../expressions/request-assertion";
import { Builder } from "./builder";
import { IExpressionBuilder } from "./expression-builder-type";

export class ExpressionBuilder implements IExpressionBuilder {
  public createProgram(range: TokenRange): Builder<ProgramExpression> {
    return new Builder(range, this, ProgramExpression);
  }

  public createUse(range: TokenRange): Builder<UseExpression> {
    return new Builder(range, this, UseExpression);
  }

  public createRequest(range: TokenRange): Builder<RequestExpression> {
    return new Builder(range, this, RequestExpression);
  }

  public createRequestBody(range: TokenRange): Builder<RequestBodyExpression> {
    return new Builder(range, this, RequestBodyExpression);
  }

  public createRequestAssert(range: TokenRange): Builder<RequestAssertionExpression> {
    return new Builder(range, this, RequestAssertionExpression);
  }

  public createApiHttpHeader(range: TokenRange): Builder<ApiHttpHeaderExpression> {
    return new Builder(range, this, ApiHttpHeaderExpression);
  }

  public createHttpHeader(range: TokenRange): Builder<HttpHeaderExpression> {
    return new Builder(range, this, HttpHeaderExpression);
  }

  public createHttpHeaderName(token: Token): Builder<HttpHeaderNameExpression> {
    return new Builder(token, this, HttpHeaderNameExpression);
  }
  public createHttpHeaderValue(range: TokenRange): Builder<HttpHeaderValueExpression> {
    return new Builder(range, this, HttpHeaderValueExpression);
  }

  public createUrl(range: TokenRange): Builder<UrlExpression> {
    return new Builder(range, this, UrlExpression);
  }

  public createFile(range: TokenRange): Builder<FileExpression> {
    return new Builder(range, this, FileExpression);
  }

  public createVariable(token: Token): Builder<VariableExpression> {
    return new Builder(token, this, VariableExpression);
  }

  public createString(range: TokenRange): Builder<StringExpression> {
    return new Builder(range, this, StringExpression);
  }

  public createStringLiteral(token: Token): Builder<StringLiteralExpression> {
    return new Builder(token, this, StringLiteralExpression);
  }

  public createError(token: Token): Builder<ErrorNodeExpression> {
    return new Builder(token, this, ErrorNodeExpression);
  }

  //
  // Json
  public createJson(range: TokenRange): Builder<JsonExpression> {
    return new Builder(range, this, JsonExpression);
  }

  public createJsonObject(range: TokenRange): Builder<JsonObjectExpression> {
    return new Builder(range, this, JsonObjectExpression);
  }

  public createJsonArray(range: TokenRange): Builder<JsonArrayExpression> {
    return new Builder(range, this, JsonArrayExpression);
  }

  public createJsonLiteral(token: Token): Builder<JsonLiteralExpression> {
    return new Builder(token, this, JsonLiteralExpression);
  }

  public createJsonNumber(token: Token): Builder<JsonNumberExpression> {
    return new Builder(token, this, JsonNumberExpression);
  }

  public createKeyword(token: Token): Builder<KeywordExpression> {
    return new Builder(token, this, KeywordExpression);
  }
}