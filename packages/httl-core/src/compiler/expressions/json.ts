import { FormattingContext } from "../../code";
import { CompositeExpression, Expression, Guard, TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { JsonRt } from "../../runtime/runtime-objects";
import { JsonArrayRt } from "../../runtime/runtime-objects/json-array";
import { JsonObjectRt } from "../../runtime/runtime-objects/json-object";
import { BooleanLiteralRt, NumberLiteralRt } from "../../runtime/runtime-objects/literal";

export class JsonExpression extends CompositeExpression {
  public json: Expression;

  public setValue(json: Expression): void {
    this.addExpressions(json);
    this.json = json;
  }

  public evaluate(executor: IRuntimeExecutor): JsonRt {
    const json = this.json.evaluate(executor);
    return new JsonRt(json, executor, this);
  }
}

export type JsonObjectPair = { key: Expression, value: Expression };

export class JsonObjectExpression extends CompositeExpression {
  public pairs: JsonObjectPair[] = [];

  public setPairs(pairs: JsonObjectPair[]): void {
    pairs.forEach(p => this.addExpressions(p.key, p.value));
    this.pairs = pairs;
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    let formatedText = "{";

    if (this.pairs.length) {
      context.increaseIntend();

      formatedText += '\n';

      formatedText += this.pairs
        .map(p =>
          `${context.intend()}${p.key.format(context).trim()}: ${p.value.format(context.padRight(',')).trim()}`
        ).join("\n");

      formatedText += '\n';

      context.decresIntend();
      formatedText += `${context.intend()}}`;
    } else {
      formatedText += context.intend() + "}";
    }

    return formatedText;
  }

  public evaluate(executor: IRuntimeExecutor): JsonObjectRt {
    const pairs = this.pairs.map(p => ({
      key: p.key.evaluate(executor),
      value: p.value.evaluate(executor)
    }));

    return new JsonObjectRt(pairs, executor, this);
  }
}


export class JsonArrayExpression extends CompositeExpression {
  public items: Expression[] = [];

  public setItems(items: Expression[]): void {
    this.addExpressions(...items);
    this.items = items;
  }

  protected override formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    return `[${expressions.map(e => e.format(context).trim()).join(", ")}]`;
  }

  public evaluate(executor: IRuntimeExecutor): JsonArrayRt {
    const items = this.items.map(i => i.evaluate(executor));
    return new JsonArrayRt(items, executor, this);
  }
}

export class JsonLiteralExpression extends TokenExpression {
  private value: boolean | null;

  public setValue(value: string): void {
    Guard.notNull(value, "value");
    this.value = value === "true" ? true : value === "false" ? false : null;
  }

  protected override formatExpression(context: FormattingContext): string {
    return this.value === null ? "null" : this.value.toString();
  }

  public evaluate(executor: IRuntimeExecutor): BooleanLiteralRt {
    return new BooleanLiteralRt(this.value, executor, this)
  }
}

export class JsonNumberExpression extends TokenExpression {
  private value: number;

  public setValue(value: string): void {
    Guard.notNull(value, "value");
    this.value = parseFloat(value);
  }

  public evaluate(executor: IRuntimeExecutor): NumberLiteralRt {
    return new NumberLiteralRt(this.value, executor, this,);
  }
}
