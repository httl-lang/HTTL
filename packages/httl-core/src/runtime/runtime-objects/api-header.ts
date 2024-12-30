import { Err, Ok, Result } from "oxide.ts";
import { HttlDiagnostic, RootRuntimeObject } from "../../common";
import { ApiHttpHeaderExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { ApiRt } from "./api";
import { HttpHeaderRt } from "./http-header";
import { VariableRt } from "./var";

export class ApiHttpHeaderRt extends RootRuntimeObject<ApiHttpHeaderExpression> {

  constructor(
    private readonly api: VariableRt,
    public readonly header: HttpHeaderRt,
    executor: IRuntimeExecutor,
    expr: ApiHttpHeaderExpression,
  ) {
    super(executor, expr);
    api.setParent(this);
    header.setParent(this);
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {

    const varRes = await this.api.execute();
    if (varRes.isErr()) {
      return Err(varRes.unwrapErr());
    }

    const headerRes = await this.header.execute();
    if (headerRes.isErr()) {
      return Err(headerRes.unwrapErr());
    }

    const apiRt = varRes.unwrap().result as ApiRt;
    const headerRt = headerRes.unwrap()

    if (headerRt.isExt) {
      const extRes = await this.executor.ext(headerRt.header, headerRt.value);
      if (extRes.isErr()) {
        return Err(
          HttlDiagnostic.fromError(extRes.unwrapErr(), this.expr.range)
        );
      }

      await apiRt.apply(extRes.unwrap());
    }
    else {
      apiRt.setHeader(headerRt.header, headerRt.value);
    }

    return Ok(this);
  }
}
