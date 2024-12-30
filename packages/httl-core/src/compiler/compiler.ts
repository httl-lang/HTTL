import { Token } from "../common";
import { HTTLLangParser } from "../parser";
import { ExpressionBuilder } from "./builder/expression-builder";
import { ProgramExpression } from "./expressions/program";

export class HttlCompiler {

  public compile(text: string): ProgramExpression {
    const builder = new ExpressionBuilder();

    try {
      const programExpression = HTTLLangParser.parse(text, builder);
      if (!(programExpression instanceof ProgramExpression)) {
        throw new Error("Invalid Program expression");
      }

      return programExpression;
    }
    catch (error) {
      const err = builder.createError(Token.fromText(text)).set(
        expr => expr.setErrorMessage(error.message)
      ).build();

      const program = builder.createProgram({ start: 0, end: text.length }).set(
        expr => expr.addExpressions(err)
      ).build();

      return program;
    }
  }
}