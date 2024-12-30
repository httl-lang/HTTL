import { TokenExpression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { KeywordRt } from "../../runtime/runtime-objects/keyword";

export class KeywordExpression extends TokenExpression {
  value: string;

  public setValue(value: string) {
    this.value = value;
  }

  public evaluate(executor: IRuntimeExecutor): KeywordRt {
    return new KeywordRt(this.value.trim(), executor, this);
  }
}
