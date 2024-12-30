import { HttpResponse } from "../runtime/http";
import { HttlDiagnostic } from "./diagnostic";

export interface HttlOutput {
  result: HttpResponse[];
  errors: HttlDiagnostic[];
}

