import { CompositeExpression, Expression } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { ApiRt } from "../../runtime/runtime-objects/api";
import { FileExpression } from "./file";
import { KeywordExpression } from "./keyword";
import { VariableExpression } from "./var";

export class UseExpression extends CompositeExpression {

  public use: KeywordExpression
  public path: FileExpression
  public as: KeywordExpression
  public alias: VariableExpression

  public setUse(useKeyword: Expression) {
    this.addExpressions(useKeyword);
    this.use = useKeyword as KeywordExpression;
  }

  public setPath(value: Expression) {
    if (!(value instanceof FileExpression))
      throw new Error("Api path must be a file");

    this.addExpressions(value);
    this.path = value as FileExpression;
  }

  public setAs(asKeyword: KeywordExpression) {
    this.addExpressions(asKeyword);
    this.as = asKeyword;
  }

  public setAlias(value: Expression) {
    this.addExpressions(value);
    this.alias = value as VariableExpression;
  }

  public evaluate(executor: IRuntimeExecutor): ApiRt {
    const useRt = this.use ? this.use.evaluate(executor) : undefined;
    const pathRt = this.path ? this.path.evaluate(executor) : undefined;
    const asRt = this.as ? this.as.evaluate(executor) : undefined;
    const aliasRt = this.alias ? this.alias.evaluate(executor) : undefined;

    return new ApiRt(executor, useRt, pathRt, asRt, aliasRt, this);
  }
}
