import { RuntimeObject } from ".";
import { FormattingContext } from "../code";
import { IRuntimeExecutor } from "../runtime";
import { Token, TokenRange } from "./token";

export abstract class Expression {
  protected leftHiddenTokens: Token[] = [];
  protected rightHiddenTokens: Token[] = [];

  public errorExpr: Expression = null;
  public abstract get range(): TokenRange

  public setError(error: Expression) {
    this.errorExpr = error;
  }

  public setLeftHiddenTokens(tokens: Token[]) {
    this.leftHiddenTokens = [...this.leftHiddenTokens, ...tokens].toSorted((a, b) => a.start - b.start);
  }

  public setRightHiddenTokens(tokens: Token[]) {
    this.rightHiddenTokens = [...this.rightHiddenTokens, ...tokens].toSorted((a, b) => a.start - b.start);
  }

  public abstract evaluate(executor: IRuntimeExecutor): RuntimeObject<Expression>
  public abstract getText(): string;
  public abstract format(context: FormattingContext): string;
}

export class EmptyExpression extends Expression {
  constructor() {
    super();
  }

  public evaluate(executor: IRuntimeExecutor): RuntimeObject<Expression> {
    return null;
  }

  public get range(): TokenRange {
    return { start: NaN, end: NaN, text: this.getText() }
  }

  public getText(): string {
    return ""
  }

  public format(context: FormattingContext): string {
    return ""
  }
}

export abstract class TokenExpression extends Expression {
  constructor(
    public readonly token: Token
  ) {
    super();
  }

  public override get range(): TokenRange {
    return {
      start: this.token.start,
      end: this.token.end,
      text: this.token.text
    }
  }

  public override getText(): string {
    return this.token.text;
  }

  public override format(context: FormattingContext): string {
    if (this.token === Token.UNDEFINED) {
      return "";
    }

    let formatedText = "";

    if (this.leftHiddenTokens.length) {
      formatedText += this.leftHiddenTokens.map(x => x.text).join("");
    }

    const padRight = context.getPadRight()
    formatedText += this.formatExpression(context) + padRight;

    if (this.rightHiddenTokens.length) {
      const rightHiddenTokens = this.rightHiddenTokens.map(x => x.text).join("");
      context.checkLineBreaksToRight(rightHiddenTokens);
      formatedText += rightHiddenTokens;
    }

    return formatedText;
  }

  protected formatExpression(context: FormattingContext): string {
    return this.token.text;
  }
}


export abstract class CompositeExpression extends Expression {
  protected readonly expressions: Expression[] = [];

  constructor(
    private readonly _range: TokenRange
  ) {
    super();
  }

  public addExpressions(...exprs: Expression[]) {
    exprs.forEach(expr => this.expressions.push(expr));
    this.expressions.sort((a, b) => a.range.start - b.range.start);
  }

  public override get range(): TokenRange {
    return this._range;
  }

  public override getText(): string {
    return this._range.text;
  }

  public override format(context: FormattingContext): string {
    const expressions = this.expressions.toSorted((a, b) => a.range.start - b.range.start)

    let formatedText = "";

    if (this.leftHiddenTokens.length) {
      formatedText += this.leftHiddenTokens.map(x => x.text).join("").trim() + "\n" + context.intend();
    }
    const padRight = context.getPadRight()
    formatedText += this.formatExpressions(context, expressions) + padRight;

    if (this.rightHiddenTokens.length) {
      const rightHiddenTokens = this.rightHiddenTokens.map(x => x.text).join("");
      context.checkLineBreaksToRight(rightHiddenTokens);
      formatedText += rightHiddenTokens;
    }


    return formatedText;
  }

  protected formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    return expressions
      .map(e => e.format(context))
      .join("");
  }
}

