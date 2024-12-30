import { Result, Ok } from "oxide.ts";
import { CompletionContext, CompletionTarget } from "../../code";
import { CompletionProvider, HttpHeaderNameCompletionProvider, HttpHeaderValueCompletionProvider } from "../../code/completion/providers";
import { RuntimeObject, HttlDiagnostic } from "../../common";
import { HttpHeaderNameExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { HttpHeaderRt } from "./http-header";


export class HttpHeaderNameRt extends RuntimeObject<HttpHeaderNameExpression> {
  constructor(
    public readonly name: string,
    executor: IRuntimeExecutor,
    expr: HttpHeaderNameExpression
  ) {
    super(executor, expr);
  }
  public override async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    if (context.target === CompletionTarget.Current) {
      return new HttpHeaderNameCompletionProvider(this.parent as HttpHeaderRt);
    }

    if (context.target === CompletionTarget.Next) {
      return new HttpHeaderValueCompletionProvider({ name: this });
    }

    throw new Error("Invalid target");
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    this.setResult(this.name);
    return Ok(this);
  }
}
