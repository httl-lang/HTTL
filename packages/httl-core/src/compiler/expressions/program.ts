import { ApiHttpHeaderExpression, FileExpression, RequestExpression, StringExpression, StringLiteralExpression, UseExpression, VariableExpression } from ".";
import { FormattingContext } from "../../code";
import { CompositeExpression, Expression, Lang, RuntimeObject, Token } from "../../common";
import { IRuntimeExecutor } from "../../runtime";
import { ProgramRt } from "../../runtime/runtime-objects/program";

export class ProgramExpression extends CompositeExpression {

  public evaluate(executor: IRuntimeExecutor): RuntimeObject<Expression> {
    const rtObjects = this.expressions.map(e =>
      e.evaluate(executor)
    );

    const program = new ProgramRt(executor, this, rtObjects)
    executor.setProgram(program);

    return program;
  }

  public formatExpressions(context: FormattingContext, expressions: Expression[]): string {
    let formatedText = "";
    let lastExp = this.expressions[0];
    for (const exp of expressions) {
      if (lastExp.constructor !== exp.constructor || exp.constructor === RequestExpression) {
        if (!context.hasMultipleLineBreaksToRight())
          formatedText += '\n';
      } else if (exp instanceof ApiHttpHeaderExpression) {
        if (exp.header.header.isExt !== (lastExp as ApiHttpHeaderExpression).header.header.isExt) {
          formatedText += '\n';
        }
      }
      context.cleanLineBreaksCounter();
      formatedText += exp.format(context);

      lastExp = exp;
    }

    return formatedText.trim();
  }

  // TODO: rework this
  public addDefaultApi() {
    const defApi = new UseExpression(this.range);
    const file = new FileExpression(this.range);
    const str = new StringExpression(this.range);
    const strLiteral = new StringLiteralExpression(Token.UNDEFINED);
    strLiteral.setLiteral(`.${Lang.FILE_EXTENSION}`);
    str.setParts([strLiteral]);
    file.setPath(str);
    defApi.setPath(file);

    const varExp = new VariableExpression(Token.UNDEFINED);
    varExp.setName(Lang.DEFAULT_API_NAME);

    defApi.setAlias(varExp);

    this.expressions.unshift(defApi);
  }
}
