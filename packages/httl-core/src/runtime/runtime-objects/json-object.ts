import { Err, Ok, Result } from "oxide.ts";

import { HttlDiagnostic, RuntimeObject } from "../../common";
import { JsonObjectExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";

export class JsonObjectRt extends RuntimeObject<JsonObjectExpression> {
  constructor(
    private readonly pairs: Array<{ key: RuntimeObject<any>; value: RuntimeObject<any> }>,
    executor: IRuntimeExecutor,
    expr: JsonObjectExpression,
  ) {
    super(executor, expr);
    pairs.forEach(p => {
      p.key.setParent(this);
      p.value.setParent(this);
    });
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const entries = [];

    for (const pair of this.pairs) {
      const key = await pair.key.execute();
      if (key.isErr()) {
        return Err(key.unwrapErr());
      }

      const value = await pair.value.execute();
      if (value.isErr()) {
        return Err(value.unwrapErr());
      }

      entries.push([key.unwrap().result, value.unwrap().result]);
    }

    const value = Object.fromEntries(entries);

    this.setResult(value);

    return Ok(this);
  }
}
