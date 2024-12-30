import { HttlDiagnostic, Json, RuntimeObject, Symbols } from "../../common";
import { IRuntimeExecutor } from "../executors";
import { Err, Ok, Result } from "oxide.ts";
import { RequestAssertionExpression } from "../../compiler/expressions/request-assertion";
import { HttpResponse } from "../http";
import { JsonRt } from "./json";

export class RequestAssertionRt extends RuntimeObject<RequestAssertionExpression> {
  constructor(
    private readonly assertion: JsonRt,
    executor: IRuntimeExecutor,
    expr: RequestAssertionExpression,
  ) {
    super(executor, expr);
    assertion.setParent(this);
  }

  public async assert(response: HttpResponse): Promise<Result<this, HttlDiagnostic>> {
    if (response[Symbols.DIAGNOSTIC_OBJECT]) {
      return Ok(this);
    }

    const assertion = await this.result;
    const asssertions = []

    if (assertion.status) {
      if (assertion.status !== response.statusCode) {
        asssertions.push(
          Err(HttlDiagnostic.fromError("ASSERTION: Status code does not match", this.expr.range)));
      }
    }

    if (assertion.headers) {
      const diff = Json.compare(assertion.headers, Object.fromEntries(response.res.headers));

      for (const [key, [expected, actual]] of diff.entries()) {
        asssertions.push(
          Err(HttlDiagnostic.fromError(`ASSERTION: Header ${key} does not match. Expecting ${expected} but getting ${actual}`, this.expr.range)));
      }
    }

    if (assertion.body) {
      const bodyRes = Json.safeParse(response.res.data);
      if (bodyRes.isErr()) {
        asssertions.push(
          Err(HttlDiagnostic.fromError("ASSERTION: Assertion support only JSON payload at the moment.", this.expr.range))
        );
      }

      const diff = Json.compare(assertion.body, bodyRes.unwrap());

      for (const [key, [expected, actual]] of diff.entries()) {
        asssertions.push(
          Err(HttlDiagnostic.fromError(`ASSERTION: Header ${key} does not match. Expected '${expected}' but received '${actual}'`, this.expr.range)));
      }
    }

    if (asssertions.length > 0) {
      return asssertions[0];
    }

    return Ok(this);
  }

  protected async executeInternal(): Promise<Result<this, HttlDiagnostic>> {
    const assertRes = await this.assertion.execute();
    if (assertRes.isErr()) {
      return Err(assertRes.unwrapErr());
    }

    const body = assertRes.unwrap().result;
    this.setResult(body);

    return Ok(this);
  }
}




