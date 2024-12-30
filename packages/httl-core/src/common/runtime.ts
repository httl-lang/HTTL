import { IHttlContext } from "../httl";
import { IRuntimeExecutor } from "../runtime";
import { HttlDocument } from "../document";
import { ProgramExpression } from "../compiler/expressions";

export interface IRuntime {
  context: IHttlContext;
  run(program: ProgramExpression, doc: HttlDocument, parent: IRuntimeExecutor): Promise<IRuntimeExecutor>;
  validate(program: ProgramExpression, doc: HttlDocument, parent: IRuntimeExecutor): Promise<IRuntimeExecutor>;
}