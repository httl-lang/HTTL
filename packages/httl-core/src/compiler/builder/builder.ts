import { Expression, Token, TokenRange } from "../../common";
import { IExpressionBuilder } from ".";

export class Builder<T extends Expression> {
  private expression: T;

  constructor(
    token: Token | TokenRange,
    private readonly builder: IExpressionBuilder,
    private readonly type: new (token: Token | TokenRange) => T,
  ) {
    this.expression = new this.type(token);
  }

  public set(callback: (expr: T, builder: Builder<T>) => void) {
    callback(this.expression, this);
    return this;
  }

  public build(): T {
    return this.expression;
  }
}
