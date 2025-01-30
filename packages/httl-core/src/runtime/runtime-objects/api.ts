import { Err, Ok, Result } from "oxide.ts";
import { EmptyExpression, HttlDiagnostic, RootRuntimeObject, Url } from "../../common";
import { UseExpression, VariableExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { FileRt } from "./file";
import { UrlRt } from "./url";
import { IExtension } from "../../extensions";
import { ApiSpec } from "../../extensions/api-spec";
import { KeywordRt } from "./keyword";
import { VariableRt } from "./var";

export interface IApiExtension {
  baseUrl: string;
  spec: ApiSpec;
  headers: { [key: string]: string }
  body: { [key: string]: string }
}

export class ApiRt extends RootRuntimeObject<UseExpression> {
  private readonly _headers = new Map<string, string>();
  private _baseUrl?: string;
  public spec?: ApiSpec;

  constructor(
    executor: IRuntimeExecutor,
    public readonly use: KeywordRt,
    public readonly path: FileRt,
    public readonly as?: KeywordRt,
    public readonly alias?: VariableRt,
    expr?: UseExpression,
  ) {
    super(executor, expr);
    use?.setParent(this);
    path?.setParent(this);
    as?.setParent(this);
    alias?.setParent(this);
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const apiPath = await this.path.execute()
    if (apiPath.isErr()) {
      return Err(apiPath.unwrapErr());
    }

    const apiRes = await this.executor.loadApi(apiPath.unwrap().result);
    if (apiRes.isErr()) {
      return Err(
        HttlDiagnostic.fromError(apiRes.unwrapErr(), this.path.expr.range)
      );
    }

    const aliasVar = await this.alias.execute();
    if (aliasVar.isErr()) {
      return Err(aliasVar.unwrapErr());
    }

    aliasVar.unwrap().set(apiRes.unwrap(), true)

    return Ok(this);
  }

  public override async apply(_ext: IExtension) {
    if (!(Array.isArray(_ext.applicable) ? _ext.applicable : [_ext.applicable]).includes("api"))
      return Err("Invalid extension");

    const ext = await _ext.call() as IApiExtension;

    if (ext.baseUrl) {
      this._baseUrl = ext.baseUrl;
    }

    if (ext.headers) {
      for (const [header, value] of Object.entries(ext.headers)) {
        this.setHeader(header, value);
      }
    }

    if (ext.spec) {
      this.spec = ext.spec;
    }

    return Ok(undefined);
  }

  public setHeader(header: string, value: string) {
    this._headers.set(header, value);
  }

  public getApiHeaders() {
    return Object.fromEntries(this._headers.entries());
  }

  public composeUrl(urlRt: UrlRt): URL {
    const completeUrl = !urlRt.isAbsolute
      ? Url.join(this.baseUrl, urlRt.url)
      : urlRt.url;

    return new URL(completeUrl);
  }

  public get baseUrl() {
    return this._baseUrl;
  }
}


export class DefaultApiRt extends ApiRt {
  constructor(executor: IRuntimeExecutor) {
    // TODO: This is a hack, we need to refactor this
    const alias = new VariableRt("default", true, executor, new EmptyExpression() as VariableExpression);
    super(executor, null, null, null, alias, new EmptyExpression() as UseExpression);
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const aliasVar = await this.alias.execute();
    if (aliasVar.isErr()) {
      return Err(aliasVar.unwrapErr());
    }

    aliasVar.unwrap().set(this, true)

    return Ok(this);
  }
}