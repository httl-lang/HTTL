import { Token, TokenRange } from "../../common";
import { UseExpression, RequestExpression, ApiHttpHeaderExpression, HttpHeaderExpression, StringExpression, StringLiteralExpression, JsonExpression, JsonObjectExpression, JsonArrayExpression, JsonLiteralExpression, JsonNumberExpression, UrlExpression, FileExpression, VariableExpression, ErrorNodeExpression, ProgramExpression, RequestBodyExpression, HttpHeaderValueExpression, HttpHeaderNameExpression } from "../expressions";
import { KeywordExpression } from "../expressions/keyword";
import { RequestAssertionExpression } from "../expressions/request-assertion";
import { Builder } from "./builder";

export interface IExpressionBuilder {
  // Program
  createProgram(range: TokenRange): Builder<ProgramExpression>;

  // Use
  createUse(range: TokenRange): Builder<UseExpression>;

  // Request
  createRequest(range: TokenRange): Builder<RequestExpression>;
  createRequestBody(range: TokenRange): Builder<RequestBodyExpression>;
  createRequestAssert(range: TokenRange): Builder<RequestAssertionExpression>;

  // Api Http Header
  createApiHttpHeader(range: TokenRange): Builder<ApiHttpHeaderExpression>;

  // Http Header
  createHttpHeader(range: TokenRange): Builder<HttpHeaderExpression>;
  createHttpHeaderName(token: Token): Builder<HttpHeaderNameExpression>;
  createHttpHeaderValue(range: TokenRange): Builder<HttpHeaderValueExpression>;

  // String
  createString(range: TokenRange): Builder<StringExpression>;
  createStringLiteral(token: Token): Builder<StringLiteralExpression>;

  // Json
  createJson(range: TokenRange): Builder<JsonExpression>;
  createJsonObject(range: TokenRange): Builder<JsonObjectExpression>;
  createJsonArray(range: TokenRange): Builder<JsonArrayExpression>;
  createJsonLiteral(token: Token): Builder<JsonLiteralExpression>;
  createJsonNumber(token: Token): Builder<JsonNumberExpression>;

  // Common
  createUrl(range: TokenRange): Builder<UrlExpression>;
  createFile(range: TokenRange): Builder<FileExpression>;
  createVariable(token: Token): Builder<VariableExpression>;
  createKeyword(token: Token): Builder<KeywordExpression>;

  createError(token: Token): Builder<ErrorNodeExpression>;
}
