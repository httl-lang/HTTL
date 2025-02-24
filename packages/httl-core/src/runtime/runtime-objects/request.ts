import { Expression, HttlDiagnostic, Json, RootRuntimeObject, RuntimeObject, RuntimeObjectBase, Symbols } from "../../common";
import { ApiRt } from "./api";
import { RequestExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { Err, Ok, Result } from "oxide.ts";
import { HttpHeaderRt, RequestAssertionRt, RequestBodyRt, UrlRt, VariableRt } from ".";
import { IExtension } from "../../extensions";
import { HttpResponse, HttpWarningCode } from '../http/http-response';
import { KeywordRt } from "./keyword";
import { CompletionContext, CompletionTarget } from "../../code";
import { CompletionProvider } from "../../code/completion/providers/completion-provider";
import { ApiSpecEndpointCompletionProvider } from "../../code/completion/providers/api-spec-endpoint";
import { ApiSpecBodyCompletionProvider } from "../../code/completion/providers/api-spec-body";
import { HttpHeaderNameCompletionProvider } from "../../code/completion/providers";

interface IRequestExtension {
  applicable: "request";
  headers: Record<string, string>;
}

class ResponseVar {

  public static fromHttpResponse(response: HttpResponse, name: string): ResponseVar | string {
    const responseVar = new ResponseVar(name);

    if (response[Symbols.DIAGNOSTIC_OBJECT]) {
      return responseVar;
    }

    // TODO: temporary fix
    try {
      const jsonData = JSON.parse(response.res.data);

      Object.assign(responseVar, jsonData);
      responseVar[Symbols.NESTED_VARIABLE] = true;

      return responseVar;
    } catch (e) {
      return response.res.data;
    }
  }

  private constructor(
    public readonly name: string
  ) { }

  public toString() {
    return `{${this.name}}`;
  }
}

export class RequestRt extends RootRuntimeObject<RequestExpression> {

  private _response: HttpResponse;
  private _headers: Record<string, string> = {};

  constructor(
    private readonly api: VariableRt,
    public readonly method: KeywordRt,
    public readonly url: UrlRt,
    public readonly headers: RuntimeObject<Expression>[],
    private readonly body: RequestBodyRt<Expression>,
    private readonly variable: VariableRt,
    private readonly assert: RequestAssertionRt,
    executor: IRuntimeExecutor,
    expr: RequestExpression
  ) {
    super(executor, expr);
    api.setParent(this);
    method.setParent(this);
    url.setParent(this);
    headers.forEach(h => h.setParent(this));
    body?.setParent(this);
    variable?.setParent(this);
    assert?.setParent(this);
  }

  public get response() {
    return this._response;
  }

  public override async apply(ext: IExtension): Promise<Result<void, string>> {
    if (!(Array.isArray(ext.applicable) ? ext.applicable : [ext.applicable]).includes("request"))
      return Err("Invalid extension");

    const reqExt = await ext.call() as IRequestExtension;
    this._headers = {
      ...this._headers,
      ...reqExt.headers
    }

    return Ok(undefined);
  }

  public override async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    const apiVariableRes = await this.api.execute();
    if (apiVariableRes.isErr()) {
      return this.parent.completion(context.push(this));
    }

    const { spec } = apiVariableRes.unwrap().result as ApiRt;
    if (spec === undefined) {
      return this.parent.completion(context.push(this));
    }

    const { caller, data } = context.last();
    const filter = {
      method: this.method.value,
      path: this.url.expr.getText(),
      range: { start: this.method.expr.token.column, end: this.url.expr.range.end }
    }

    if (context.target === CompletionTarget.Current) {
      if (caller instanceof KeywordRt || caller instanceof UrlRt) {
        return new ApiSpecEndpointCompletionProvider(spec, filter);
      }
    }

    if (context.target === CompletionTarget.Next) {
      if (caller instanceof KeywordRt) {
        return new ApiSpecEndpointCompletionProvider(spec, filter);
      }

      if (caller instanceof UrlRt || caller instanceof HttpHeaderRt) {
        const headers = new HttpHeaderNameCompletionProvider();
        const body = new ApiSpecBodyCompletionProvider(spec, filter);

        return [headers, body];
      }
    }

    return this.parent.completion(context.push(this));
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {

    const apiRes = await this.api.execute();
    if (apiRes.isErr()) {
      return Err(apiRes.unwrapErr());
    }

    const urlRes = await this.url.execute();
    if (urlRes.isErr()) {
      return Err(urlRes.unwrapErr());
    }

    const requestHeadersRes = await this.getResponseHeaders()
    if (requestHeadersRes.isErr()) {
      return Err(requestHeadersRes.unwrapErr());
    }

    const apiRt = apiRes.unwrap().result as ApiRt;

    const globalHeaders = apiRt.getApiHeaders();
    const requestHeaders = requestHeadersRes.unwrap();

    let headers = {
      ...globalHeaders,
      ...this._headers,
      ...requestHeaders,
    };

    let body = undefined;
    if (this.body) {
      const bodyRes = await this.body.execute();
      if (bodyRes.isErr()) {
        return Err(bodyRes.unwrapErr());
      }
      const bodyRt = bodyRes.unwrap()

      body = bodyRt.result;
      headers = {
        ...headers,
        ...bodyRt.getHeaders()
      }
    }

    const url = apiRt.composeUrl(urlRes.unwrap());

    if (!headers["host"]) {
      headers["host"] = url.hostname;
    }

    this._response = await this.executor.httpRequest(url, {
      method: this.method.value,
      headers,
      body,
    })

    if (this._response.isSelfSignedCertError) {
      this._response = await this.executor.httpRequest(url, {
        method: this.method.value,
        headers,
        body,
        rejectUnauthorized: false,
      })
    }

    // TODO: temoporary fix
    this._response.source = {
      start: this.expr.range.start,
      end: this.expr.range.end,
      line: this.method.expr.token.line,
    }

    if (this.variable) {
      const varRes = await this.variable.execute();
      if (varRes.isErr()) {
        return Err(varRes.unwrapErr());
      }

      const varResponse = ResponseVar.fromHttpResponse(this._response, this.variable.name);
      varRes.unwrap().set(varResponse);
    }

    if (this.assert) {
      const assertRes = await this.assert.execute();
      if (assertRes.isErr()) {
        return Err(assertRes.unwrapErr());
      }

      const assertRt = assertRes.unwrap();
      const assertResult = await assertRt.assert(this._response);

      if (assertResult.isErr()) {
        return Err(
          HttlDiagnostic.fromError(assertResult.unwrapErr().error, this.expr.range)
        );
      }
    }

    return Ok(this);
  }


  private async getResponseHeaders(): Promise<Result<{ [key: string]: string }, HttlDiagnostic>> {
    const requestHeaders = {};
    const errors = []

    for (const header of this.headers) {
      const headerRes = await header.execute();

      if (headerRes.isErr()) {
        errors.push(headerRes.unwrapErr());
      }
      else {
        const headerRt = headerRes.unwrap() as HttpHeaderRt;

        if (headerRt.isExt) {
          const ext = this.executor.ext(headerRt.header, headerRt.value);

          if (ext.isErr()) {
            errors.push(ext.unwrapErr());
          } else {
            const applied = await this.apply(ext.unwrap());
            if (applied.isErr()) {
              errors.push(applied.unwrapErr());
            }
          }
        } else {
          requestHeaders[headerRt.header] = headerRt.value;
        }
      }
    }

    if (errors.length > 0) {
      return Err(
        HttlDiagnostic.fromError(errors.join(", "), this.expr.range)
      );
    }

    return Ok(requestHeaders);
  }
}
