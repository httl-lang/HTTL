import { Result, Err, Ok } from "oxide.ts";
import { CompletionContext, CompletionTarget } from "../../code";
import { CompletionProvider, HttpHeaderValueCompletionProvider } from "../../code/completion/providers";
import { RuntimeObject, Expression, HttlDiagnostic } from "../../common";
import { HttpHeaderValueExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { HttpHeaderRt } from "./http-header";


export class HttpHeaderValueRt extends RuntimeObject<HttpHeaderValueExpression> {

  constructor(
    public readonly parts: RuntimeObject<Expression>[],
    executor: IRuntimeExecutor,
    expr: HttpHeaderValueExpression
  ) {
    super(executor, expr);
    parts.forEach(v => v.setParent(this));
  }

  public override async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    if (context.target === CompletionTarget.Current) {
      const headerName = (this.parent as HttpHeaderRt).headerRt;
      return new HttpHeaderValueCompletionProvider({ name: headerName, value: this });
    }

    if (context.target === CompletionTarget.Next) {
      return this.parent.completion(context.push(this));
    }

    throw new Error("Invalid target");
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const parts = await Promise.all(
      this.parts.map(async (part): Promise<Result<string, HttlDiagnostic>> => {
        const value = await part.execute();
        if (value.isErr()) {
          return Err(value.unwrapErr());
        }

        return Ok(value.unwrap().result);
      })
    );

    if (parts.some(part => part.isErr())) {
      return Err(parts.find(part => part.isErr()).unwrapErr());
    }

    const str = Result.all(...parts).unwrap().join("").trim();

    this.setResult(str);

    return Ok(this);
  }
}
