import { HttlDiagnostic } from "httl-core";

export class HttlExecutionError extends Error {
  constructor(diagnostic: HttlDiagnostic[]) {
    super();
    const errors = diagnostic.map((error) =>
      `  · '${error.error}' at '${error.token.text}'`
    );

    this.message = `Execution failed:\n${errors.join("\n")}`;
  }
}