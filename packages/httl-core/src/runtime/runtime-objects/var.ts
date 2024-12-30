import { Err, Ok, Result } from "oxide.ts";

import { HttlDiagnostic, RuntimeObject } from "../../common";
import { VariableExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { CompletionContext, CompletionTarget } from "../../code";
import { CompletionProvider, VariablesCompletionProvider } from "../../code/completion/providers";

export class VariableRt extends RuntimeObject<VariableExpression> {

  constructor(
    public readonly name: string,
    public readonly declaring: boolean,
    executor: IRuntimeExecutor,
    expr: VariableExpression,
  ) {
    super(executor, expr);
  }

  public set(value: any, override: boolean = false) {
    this.executor.set(this.name, value, override);
  }

  public override async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    if (context.target === CompletionTarget.Next) {
      return this.parent.completion(context.push(this));
    }
    
    const variables = new VariablesCompletionProvider();
    return variables;
  }

  override get result(): any {
    return this.executor.get(this.name)
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {

    // TODO: add warning for already declared variable
    if (!this.declaring && !this.executor.has(this.name)) {
      return Err(
        HttlDiagnostic.fromError(`Variable ${this.name} not found`, this.expr.range)
      );
    }

    return Ok(this);
  }
}
