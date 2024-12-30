import { Err, Ok, Result } from "oxide.ts";

import { Expression, HttlDiagnostic, RuntimeObject } from "../../common";
import { JsonExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";

export class JsonRt extends RuntimeObject<JsonExpression> {
  private _json: any;

  constructor(
    private readonly jsonRt: RuntimeObject<Expression>,
    executor: IRuntimeExecutor,
    expr: JsonExpression,
  ) {
    super(executor, expr);
    jsonRt.setParent(this);
  }

  public get json(): any {
    return this._json;
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {

    const json = await this.jsonRt.execute();
    if (json.isErr()) {
      return Err(json.unwrapErr());
    }

    this._json = json.unwrap().result;
    const value = JSON.stringify(this._json);

    this.setResult(value);

    return Ok(this);
  }
}
