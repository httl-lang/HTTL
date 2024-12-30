import { IRuntime, } from "../common";
import { IHttlContext } from "../httl";
import { DefaultApiRt } from "./runtime-objects";

import { DiagnosticExecutor, IRuntimeExecutor, RuntimeExecutor } from "./executors";
import { HttlDocument } from "../document";
import { ProgramExpression } from "../compiler/expressions";

export class HttlRuntime implements IRuntime {

  constructor(
    public readonly context: IHttlContext
  ) { }

  public async run(program: ProgramExpression, doc: HttlDocument, parent?: IRuntimeExecutor): Promise<IRuntimeExecutor> {
    const executor = new RuntimeExecutor(this, doc, parent);
    return this.execute(program, executor);
  }

  public async validate(program: ProgramExpression, doc: HttlDocument, parent?: IRuntimeExecutor): Promise<IRuntimeExecutor> {
    const executor = new DiagnosticExecutor(this, doc, parent);
    return this.execute(program, executor);
  }

  private async execute(program: ProgramExpression, executor: IRuntimeExecutor): Promise<IRuntimeExecutor> {
    executor.$default = new DefaultApiRt(executor);

    const programRt = program.evaluate(executor);
    executor.$default.setParent(programRt);
    const diagnostic = await programRt.execute();
    if (diagnostic.isErr()) {
      executor.addDiagnostic(diagnostic.unwrapErr());
    }

    return executor;
  }
}