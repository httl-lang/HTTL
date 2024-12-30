import { Err, Ok, Result } from "oxide.ts";
import { Guard, HttlDiagnostic, Id, IRuntime, Lang, RuntimeObjectBase, VAR } from "../../common";
import { ApiRt, RequestRt, VariableRt } from "../runtime-objects";
import { ErrorBehavior, IRuntimeExecutor } from "./base";
import { extensions, IExtension } from "../../extensions";
import { HttpRequestOptions, HttpClient } from "../http/http-client";
import { HttpResponse } from '../http/http-response';
import { HttlDocument } from "../../document";
import { ProgramRt } from "../runtime-objects/program";
import { CodeMap } from "../../code/code-map";

export class RuntimeExecutor implements IRuntimeExecutor {
  protected readonly runtimeObjects = new Map<string, RuntimeObjectBase>();
  protected readonly variables = new Map<string, any>();
  protected readonly importedFiles = new Set<string>();
  protected readonly codeMap: CodeMap;

  private program: ProgramRt;

  public readonly diagnostics: HttlDiagnostic[] = [];

  constructor(
    public readonly runtime: IRuntime,
    public readonly doc: HttlDocument,
    private readonly parent?: IRuntimeExecutor
  ) {
    this.codeMap = new CodeMap(this);
  }

  public getCodeMap(): CodeMap {
    return this.codeMap;
  }

  public setProgram(program: ProgramRt) {
    Guard.notNull(program, "program");
    Guard.isNull(this.program, "this.program");

    this.program = program;
  }

  public getProgram(): ProgramRt {
    return this.program;
  }

  public get $default(): ApiRt {
    return this.get(Lang.DEFAULT_API_NAME);
  }

  public set $default(value: ApiRt) {
    this.set(Lang.DEFAULT_API_NAME, value);
  }

  public get $requests(): RequestRt[] {
    return Array.from(this.runtimeObjects.values())
      .filter(value => value instanceof RequestRt);
  }

  public get $variables(): VariableRt[] {
    return Array.from(this.runtimeObjects.values())
      .filter(value => value instanceof VariableRt);
  }

  public register(rt: RuntimeObjectBase): string {
    const id = Id.generate();
    this.runtimeObjects.set(id, rt);
    this.codeMap.register(rt);

    return id;
  }

  public set(name: string, value: any, override?: boolean) {
    if (this.variables.has(name) && !override) {
      throw new Error(`Variable ${name} already declared`);
    }

    this.variables.set(name, value);
  }

  public get(name: string, safeGet?: boolean): any {
    if (VAR.has(name, this.variables))
      return VAR.resolve(name, this.variables, safeGet);

    if (this.runtime.context.env.has(name))
      return this.runtime.context.env.get(name)

    if (!safeGet)
      throw new Error(`Variable ${name} not found`);
  }

  public has(name: string): boolean {
    return VAR.has(name, this.variables) || this.runtime.context.env.has(name);
  }

  public async httpRequest(url: URL, options: HttpRequestOptions): Promise<HttpResponse> {
    return await HttpClient.request(url, options);
  }

  public isAlreadyImported(path: string): boolean {
    return this.importedFiles.has(path) || this.parent?.isAlreadyImported(path);
  }

  private checkCyclicDependency(path: string): Result<undefined, string> {
    const sameFile = this.doc?.filePath === path
    const alreadyLoaded = this.parent?.isAlreadyImported(path);
    if (sameFile || alreadyLoaded) {
      return Err(`Cyclic dependency detected for "${path}" file.`);
    }

    this.importedFiles.add(path);

    return Ok(undefined);
  }

  public async loadApi(path: string): Promise<Result<ApiRt, string>> {
    const checkRes = this.checkCyclicDependency(path);
    if (checkRes.isErr()) {
      return Err(checkRes.unwrapErr());
    }

    return this.internalLoadApi(path);
  }

  protected async internalLoadApi(path: string): Promise<Result<ApiRt, string>> {
    const result =
      await this.runtime.context
        .load(path)
        .sync()
        .run(this);

    if (result.hasErrors()) {
      return Err(`Failed to load api: ${path}`);
    }

    return Ok(result.defaultApi());
  }

  public ext(name: string, arg: string): Result<IExtension, string> {
    if (!(name in extensions)) {
      return Err(`Extension ${name} not found`);
    }

    const { applicable, call } = extensions[name];
    const args = arg.split(" ");

    return Ok({ applicable, call: () => call(...args) });
  }

  public addDiagnostic(diagnostic: HttlDiagnostic): void {
    if (!this.diagnostics.includes(diagnostic))
      this.diagnostics.push(diagnostic);
  }

  public errorBehavior(): ErrorBehavior {
    return ErrorBehavior.Stop;
  }
}
