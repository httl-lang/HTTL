import { Err, Ok, Result } from "oxide.ts";

import { Expression, HttlDiagnostic, Lang, RuntimeObject } from "../../common";
import { IRuntimeExecutor } from "../executors";
import { StringExpression } from "../../compiler/expressions/string";
import { StringLiteralRt } from "./literal";
import { VariableRt } from "./var";

export class StringRt extends RuntimeObject<StringExpression> {
  constructor(
    private readonly parts: RuntimeObject<Expression>[],
    executor: IRuntimeExecutor,
    expr: StringExpression,
  ) {
    super(executor, expr);
    parts.forEach(p => p.setParent(this));
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const parts = await Promise.all(
      this.parts.map(async (part): Promise<Result<string, HttlDiagnostic>> => {
        if (part instanceof StringLiteralRt) {
          const value = await part.execute();
          if (value.isErr()) {
            return Err(value.unwrapErr());
          }

          const ltr = Lang.replaceEscapes(value.unwrap().result);

          return Ok(ltr);
        }

        if (part instanceof VariableRt) {
          const value = await part.execute();
          if (value.isErr()) {
            return Err(value.unwrapErr());
          }

          return Ok(value.unwrap().result);
        }
      })
    );

    if (parts.some(part => part.isErr())) {
      return Err(parts.find(part => part.isErr()).unwrapErr());
    }

    const str = Result.all(...parts).unwrap().join("");

    this.setResult(str);

    return Ok(this);
  }
}
