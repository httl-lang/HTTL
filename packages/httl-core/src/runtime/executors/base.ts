import { Result } from "oxide.ts";
import { Expression, HttlDiagnostic, IRuntime, Position, RuntimeObject } from "../../common";
import { ApiRt, RequestRt, VariableRt } from "../runtime-objects";
import { IExtension } from "../../extensions";
import { HttpRequestOptions } from "../http/http-client";
import { HttpResponse } from '../http/http-response';
import { ProgramRt } from "../runtime-objects/program";
import { CodeMap } from "../../code/code-map";
import { HttlDocument } from "../../document";

export enum ErrorBehavior {
  Continue,
  Stop
}

export interface IRuntimeExecutor {

  doc: HttlDocument;

  setProgram(program: ProgramRt);
  getProgram(): ProgramRt;

  getCodeMap(): CodeMap;

  runtime: IRuntime;
  diagnostics: HttlDiagnostic[];

  register(rt: RuntimeObject<Expression>): string;
  has(name: string): boolean;
  set(name: string, value: any, override?: boolean): void;
  get(name: string, safeGet?: boolean): any;

  $default: ApiRt;
  $requests: RequestRt[];
  $variables: VariableRt[];

  httpRequest(url: URL, options: HttpRequestOptions): Promise<HttpResponse>;
  loadApi(path: string): Promise<Result<ApiRt, string>>;
  isAlreadyImported(path: string): boolean

  ext(name: string, args: string): Result<IExtension, string>;

  addDiagnostic(diagnostic: HttlDiagnostic): void;
  errorBehavior(): ErrorBehavior;
}
