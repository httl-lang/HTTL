import fs from "fs";
import { Err, Ok, Result } from "oxide.ts";

import { HttlDiagnostic, Lang, Path, RuntimeObject } from "../../common";
import { FileExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { StringRt } from "./string";

export class FileRt extends RuntimeObject<FileExpression> {

  constructor(
    private readonly path: StringRt,
    executor: IRuntimeExecutor,
    expr: FileExpression,
  ) {
    super(executor, expr);
    path.setParent(this);
  }

  public readFile(): string {
    return fs.readFileSync(this.result).toString();
  }

  protected override async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const filePath = await this.path.execute();
    if (filePath.isErr()) {
      return Err(filePath.unwrapErr());
    }

    const file = filePath.unwrap().result;
    const absolutePath = Lang.isDefaultHttlFile(file)
      ? Path.toAbsolutePath(this.executor.runtime.context.workdir, file)
      : Path.join(this.executor.doc.filePath, file);

    if (!fs.existsSync(absolutePath)) {
      return Err(
        HttlDiagnostic.fromError(`File not found: "${this.path.result}"`, this.expr.range)
      );
    }

    this.setResult(absolutePath)

    return Ok(this);
  }
}
