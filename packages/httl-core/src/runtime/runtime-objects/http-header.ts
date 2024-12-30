import { Result, Err, Ok } from "oxide.ts";
import { RuntimeObject, HttlDiagnostic } from "../../common";
import { HttpHeaderExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { HttpHeaderNameRt } from "./http-header-name";
import { HttpHeaderValueRt } from "./http-header-value";

export class HttpHeaderRt extends RuntimeObject<HttpHeaderExpression> {

  private _value: string = undefined;
  private _header: string = undefined;

  constructor(
    public readonly headerRt: HttpHeaderNameRt,
    public readonly valueRt: HttpHeaderValueRt,
    public readonly isExt: boolean,
    executor: IRuntimeExecutor,
    expr: HttpHeaderExpression
  ) {
    super(executor, expr);
    headerRt.setParent(this);
    valueRt.setParent(this);
  }

  public get header(): string { return this._header; }
  public get value(): string { return this._value; }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const header = await this.headerRt.execute();
    if (header.isErr()) {
      return Err(header.unwrapErr());
    }

    this._header = header.unwrap().result?.trim();

    const value = await this.valueRt.execute();
    if (value.isErr()) {
      return Err(value.unwrapErr());
    }

    this._value = value.unwrap().result?.trim();

    return Ok(this);
  }
}
