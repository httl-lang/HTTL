import { Err, Ok, Result } from "oxide.ts";

import { HttlDiagnostic, RuntimeObject } from "../../common";
import { UrlExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { StringRt } from "./string";
import { HttlUrl } from "../../common/url";

export class UrlRt extends RuntimeObject<UrlExpression> {
  private _url: HttlUrl;

  constructor(
    public readonly string: StringRt,
    executor: IRuntimeExecutor,
    expr: UrlExpression,
  ) {
    super(executor, expr);
    string.setParent(this);
  }

  public get url() {
    return this._url;
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const urlRes = await this.string.execute();
    if (urlRes.isErr()) {
      return Err(urlRes.unwrapErr());
    }

    const url = HttlUrl.parse(urlRes.unwrap().result);
    if (url === HttlUrl.INVALID) {
      return Err(
        HttlDiagnostic.fromError(
          new Error(`Invalid URL: ${urlRes.unwrap().result}`),
          this.string.expr.range
        )
      );
    }

    this._url = url;

    return Ok(this);
  }
}
