import { Err, Result } from "oxide.ts";
import { Guard, HttlDiagnostic, RuntimeObject } from "../../common";
import { ErrorNodeExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";

export class SyntaxErrorRt extends RuntimeObject<ErrorNodeExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: ErrorNodeExpression,
  ) {
    super(executor, expr);
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    Guard.notNull(this.expr, "expr");

    return Err(
      HttlDiagnostic.fromError(this.expr.error, this.expr.token)
    );
  }
}
