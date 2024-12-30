import { Result, Err, Ok } from "oxide.ts";
import { IRuntimeExecutor } from "../runtime";
import { HttlDiagnostic } from "./diagnostic";
import { Expression } from "./expression";
import { IExtension } from "../extensions";
import { Guard } from "./guard";
import { CompletionContext } from "../code";
import { CompletionProvider } from "../code/completion/providers/completion-provider";
import { HttpResponse } from "../runtime/http";

export type RuntimeObjectBase = RuntimeObject<Expression>
export type RuntimeObjectType = new (...args: any[]) => RuntimeObjectBase;

export abstract class RuntimeObject<TExpr extends Expression> {
  private _result: any = undefined;
  private _id: string = undefined;

  protected parent: RuntimeObjectBase = undefined;

  constructor(
    protected readonly executor: IRuntimeExecutor,
    public readonly expr: TExpr
  ) {
    this._id = executor?.register(this);
  }

  public get id(): string { return this._id; }
  public get result(): any { return this._result; }

  public async apply(ext: IExtension): Promise<Result<void, string>> {
    return Ok(undefined);
  }

  public async execute(): Promise<Result<this, HttlDiagnostic>> {
    try {
      Guard.notNull(this.expr, "expr");

      if (this.expr.errorExpr) {
        const errorRt = this.expr.errorExpr.evaluate(this.executor)
        errorRt.setParent(this);
        const errRes = await errorRt.execute()
        return Err(errRes.unwrapErr());
      }

      return await this.executeInternal();
    } catch (error: unknown) {
      if (error instanceof HttpResponse) {
        return Err(
          HttlDiagnostic.fromError(error.error, this.expr.range)
        );
      }

      return Err(
        HttlDiagnostic.fromError(error, this.expr.range)
      );
    }
  }

  public setParent(parent: RuntimeObjectBase) {
    this.parent = parent;
  }

  public async completion(context: CompletionContext): Promise<CompletionProvider | CompletionProvider[]> {
    return this.parent ? this.parent.completion(context.push(this)) : []
  }

  public getRoot(): RootRuntimeObject<Expression> {
    const root = this.parent instanceof RootRuntimeObject
      ? this.parent as RootRuntimeObject<Expression>
      : this.parent?.getRoot();

    if (root === undefined)
      throw new Error("Root not found");

    return root;
  }

  public nextObjects(): RuntimeObjectType[] {
    return [];
  }

  protected setResult(result: any) {
    this._result = result;
  }

  protected abstract executeInternal(): Promise<Result<this, HttlDiagnostic>>;


}


export abstract class RootRuntimeObject<T extends Expression> extends RuntimeObject<T> { }
