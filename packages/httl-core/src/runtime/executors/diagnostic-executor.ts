import { Err, Ok, Result } from "oxide.ts";
import { HttlDiagnostic, IRuntime, Symbols, VAR } from "../../common";
import { ErrorBehavior, IRuntimeExecutor } from "./base";
import { RuntimeExecutor } from "./runtime-executor";
import { ApiRt } from "../runtime-objects";
import { HttpRequestOptions } from "../http/http-client";
import { HttpResponse } from '../http/http-response';
import { HttlDocument } from "../../document";

export class DiagnosticExecutor extends RuntimeExecutor {
  constructor(
    runtime: IRuntime,
    doc: HttlDocument,
    parent?: IRuntimeExecutor
  ) {
    super(runtime, doc, parent);
  }

  public getDiagnostics(): HttlDiagnostic[] {
    const diagnostics: HttlDiagnostic[] = [];
    this.variables.forEach((value, key) => {
      if (value instanceof HttlDiagnostic) {
        diagnostics.push(value);
      }
    });

    return diagnostics;
  }

  override get(name: string, safeGet?: boolean) {
    if (VAR.has(name, this.variables))
      return VAR.resolve(name, this.variables, safeGet, true);

    if (this.runtime.context.env.has(name))
      return this.runtime.context.env.get(name)

    if (!safeGet)
      throw new Error(`Variable ${name} not found`);
  }

  public override httpRequest(url: URL, options: HttpRequestOptions): Promise<HttpResponse> {
    return Promise.resolve({
      [Symbols.DIAGNOSTIC_OBJECT]: true,
    } as unknown as HttpResponse);
  }

  protected override async internalLoadApi(path: string): Promise<Result<ApiRt, string>> {
    const executor =
      await this.runtime.context
        .load(path)
        .sync()
        .validate(this);

    if (executor.diagnostics.length > 0) {
      return Err(executor.diagnostics[0].error);
    }

    const api = executor.$default

    return Ok(api);
  }

  public override errorBehavior(): ErrorBehavior {
    return ErrorBehavior.Continue;
  }
}
