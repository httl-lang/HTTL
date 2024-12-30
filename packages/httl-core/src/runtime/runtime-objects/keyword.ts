import { Ok, Result } from "oxide.ts";

import { HttlDiagnostic, RuntimeObject } from "../../common";
import { IRuntimeExecutor } from "../executors";
import { KeywordExpression } from "../../compiler/expressions/keyword";

export class KeywordRt extends RuntimeObject<KeywordExpression> {
  constructor(
    public readonly value: string,
    executor: IRuntimeExecutor,
    expr: KeywordExpression,
  ) {
    super(executor, expr);
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    this.setResult(this.value)
    return Ok(this);
  }
}