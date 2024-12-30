import { ProgramExpression } from "../../compiler/expressions";
import { FormattingContext } from "./formatting-context";
import { FormattingOptions } from "./formatting-options";


export class FormattingService {
  constructor(
    public readonly program: ProgramExpression,
  ) { }

  public async format(options: FormattingOptions): Promise<string> {
    const formatedText = this.program.format(new FormattingContext(options));

    return formatedText;
  }
}