import { TokenRange } from "./token";

export enum HttlDiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

export class HttlDiagnostic {

  public static fromError(error: unknown, range: TokenRange) {
    const message = error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : `Unknown error occurred at ${range}`;


    return new HttlDiagnostic(message, range);
  }

  public readonly severity: HttlDiagnosticSeverity = HttlDiagnosticSeverity.Error;

  constructor(
    public readonly error: string,
    public readonly token: TokenRange = null
  ) { }
}
