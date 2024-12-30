import { Err, Ok, Result } from "oxide.ts";

import { Expression, HttlDiagnostic, RootRuntimeObject, RuntimeObject } from "../../common";
import { ProgramExpression } from "../../compiler/expressions";
import { ErrorBehavior, IRuntimeExecutor } from "../executors";
import { CompletionContext } from "../../code";
import { ApiSpecEndpointCompletionProvider, CompletionProvider, HttpHeaderNameCompletionProvider, HttpMethodsCompletionProvider, KeywordsCompletionProvider, VariablesCompletionProvider } from "../../code/completion/providers";

export class ProgramRt extends RootRuntimeObject<ProgramExpression> {
  constructor(
    executor: IRuntimeExecutor,
    expr: ProgramExpression,
    private readonly rtObjects: RuntimeObject<Expression>[],
  ) {
    super(executor, expr);
    rtObjects.forEach(rt_object => rt_object.setParent(this));
  }

  public override async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    const { spec } = this.executor.$default
    const endpoints = spec ? new ApiSpecEndpointCompletionProvider(spec) : undefined;
    const headers = new HttpHeaderNameCompletionProvider();
    const variables = new VariablesCompletionProvider();
    const httpMethods = new HttpMethodsCompletionProvider();
    const keywords = new KeywordsCompletionProvider();

    return [
      endpoints,
      headers,
      variables,
      httpMethods,
      keywords,
    ]
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    for (const rt_object of this.rtObjects) {
      const result = await rt_object.execute();

      if (result.isErr()) {
        this.executor.addDiagnostic(result.unwrapErr());

        if (this.executor.errorBehavior() === ErrorBehavior.Stop) {
          return Err(result.unwrapErr());
        }
      }
    }

    return Ok(this);
  }
}
