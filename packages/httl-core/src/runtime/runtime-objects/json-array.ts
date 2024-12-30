import { Err, Ok, Result } from "oxide.ts";

import { Expression, HttlDiagnostic, RuntimeObject } from "../../common";
import { JsonArrayExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";

export class JsonArrayRt extends RuntimeObject<JsonArrayExpression> {
  constructor(
    private readonly items: RuntimeObject<Expression>[],
    executor: IRuntimeExecutor,
    expr: JsonArrayExpression,
  ) {
    super(executor, expr);
    items.forEach(i => i.setParent(this));
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const items = [];

    for (const item of this.items) {
      const itemRes = await item.execute();
      if (itemRes.isErr()) {
        return Err(itemRes.unwrapErr());
      }

      items.push(itemRes.unwrap().result);
    }

    this.setResult(items);

    return Ok(this);
  }
}
