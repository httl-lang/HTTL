import { constants, Expression, HttlDiagnostic, RuntimeObject } from "../../common";
import { FileExpression as BinaryExpression, JsonExpression, StringExpression } from "../../compiler/expressions";
import { IRuntimeExecutor } from "../executors";
import { Err, Ok, Result } from "oxide.ts";
import FormData from 'form-data';

export abstract class RequestBodyRt<T extends Expression> extends RuntimeObject<T> {
  public abstract getHeaders(): Record<string, string>;
}

export class JsonBodyRt extends RequestBodyRt<JsonExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: JsonExpression
  ) {
    super(executor, expr);
  }

  public getHeaders() {
    return {
      'Content-Type': constants.CONTENT_TYPE.JSON
    };
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    // TODO: temporary solution
    const rt = this.expr.evaluate(this.executor)
    rt.setParent(this);

    const bodyRes = await rt.execute();
    if (bodyRes.isErr()) {
      return Err(bodyRes.unwrapErr());
    }

    const body = bodyRes.unwrap().result;
    this.setResult(body);

    return Ok(this);
  }
}

export class FormBodyRt extends RequestBodyRt<JsonExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: JsonExpression
  ) {
    super(executor, expr);
  }

  public getHeaders() {
    return this.result.getHeaders()
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    // TODO: temporary solution
    const rt = this.expr.evaluate(this.executor)
    rt.setParent(this);

    const bodyRes = await rt.execute();


    if (bodyRes.isErr()) {
      return Err(bodyRes.unwrapErr());
    }

    const json = bodyRes.unwrap().json;
    const formBody = new FormData();

    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        formBody.append(key, json[key]);
      }
    }

    this.setResult(formBody);

    return Ok(this);
  }
}

export class UrlEncodedBodyRt extends RequestBodyRt<JsonExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: JsonExpression
  ) {
    super(executor, expr);
  }

  public getHeaders() {
    return {
      'Content-Type': constants.CONTENT_TYPE.URL_ENCODED
    }
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    // TODO: temporary solution
    const rt = this.expr.evaluate(this.executor)
    rt.setParent(this);

    const bodyRes = await rt.execute();
    if (bodyRes.isErr()) {
      return Err(bodyRes.unwrapErr());
    }

    const json = bodyRes.unwrap().json;
    const params = new URLSearchParams();
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        params.append(key, json[key]);
      }
    }

    const body = params.toString()

    this.setResult(body);

    return Ok(this);
  }
}

export class BinaryBodyRt extends RequestBodyRt<BinaryExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: BinaryExpression
  ) {
    super(executor, expr);
  }

  public getHeaders() {
    return {
      'Content-Type': constants.CONTENT_TYPE.BINARY
    }
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    // TODO: temporary solution
    const rt = this.expr.evaluate(this.executor)
    rt.setParent(this);

    const bodyRes = await rt.execute();
    if (bodyRes.isErr()) {
      return Err(bodyRes.unwrapErr());
    }

    const file = bodyRes.unwrap().readFile();
    this.setResult(file);

    return Ok(this);
  }
}

export class RawBodyRt extends RequestBodyRt<StringExpression> {

  constructor(
    executor: IRuntimeExecutor,
    expr: StringExpression
  ) {
    super(executor, expr);
  }

  public getHeaders() {
    return {}
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    // TODO: temporary solution
    const rt = this.expr.evaluate(this.executor)
    rt.setParent(this);

    const bodyRes = await rt.execute();
    if (bodyRes.isErr()) {
      return Err(bodyRes.unwrapErr());
    }

    const body = bodyRes.unwrap().result;
    this.setResult(body);

    return Ok(this);
  }
}




