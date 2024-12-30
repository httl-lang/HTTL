import { HttlOutput } from "../common";
import { IRuntimeExecutor } from "../runtime";
import { ApiRt } from "../runtime/runtime-objects";

export class HttlDocumentOutput {
  constructor(
    private readonly executor: IRuntimeExecutor,
  ) { }

  public defaultApi(): ApiRt {
    return this.executor.$default;
  }

  public hasErrors(): boolean {
    return this.executor.diagnostics.length > 0;
  }

  public toOutput(): HttlOutput {
    const result = (this.executor.$requests || [])
      .map(r => r.response).filter(r => !!r);

    return {
      errors: this.executor.diagnostics || [],
      result,
    }
  }
}
