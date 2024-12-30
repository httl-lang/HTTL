import { Err, Ok, Result } from "oxide.ts";

import { HttlDiagnostic, RuntimeObject } from "../../common";
import { UrlExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { StringRt } from "./string";

export class UrlRt extends RuntimeObject<UrlExpression> {
  private _url: string;
  private _isAbsolute: boolean = false;

  constructor(
    public readonly string: StringRt,
    executor: IRuntimeExecutor,
    expr: UrlExpression,
  ) {
    super(executor, expr);
    string.setParent(this);
  }

  public get isAbsolute() {
    return this._isAbsolute;
  }

  public get url() {
    return this._url;
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const urlRes = await this.string.execute();
    if (urlRes.isErr()) {
      return Err(urlRes.unwrapErr());
    }

    this._url = urlRes.unwrap().result;
    this._isAbsolute = this.checkIfComplete(this._url);

    return Ok(this);
  }

  private checkIfComplete(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}
