import { Ok, Result } from "oxide.ts";

import { Expression, HttlDiagnostic, RuntimeObject, TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../executors";

export class NumberLiteralRt extends RuntimeObject<Expression> {
  constructor(
    public readonly value: number,
    executor: IRuntimeExecutor,
    expr: Expression,
  ) {
    super(executor, expr);
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    this.setResult(this.value)
    return Ok(this);
  }
}


export class BooleanLiteralRt extends RuntimeObject<TokenExpression> {
  constructor(
    public readonly value: boolean,
    executor: IRuntimeExecutor,
    expr: TokenExpression,
  ) {
    super(executor, expr);
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    this.setResult(this.value)
    return Ok(this);
  }
}

export class StringLiteralRt extends RuntimeObject<TokenExpression> {

  constructor(
    public readonly value: string,
    executor: IRuntimeExecutor,
    expr: TokenExpression,
  ) {
    super(executor, expr);
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    this.setResult(this.value)
    return Ok(this);
  }
}

