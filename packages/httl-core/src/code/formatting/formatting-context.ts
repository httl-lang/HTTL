import { FormattingOptions } from "./formatting-options";


export class FormattingContext {

  private indentation = 0;
  private intendSymbol: string;
  private padRightSymbol = "";
  private _hasMultipleLineBreaksToRight = false;

  constructor(
    private readonly options: FormattingOptions
  ) {
    this.intendSymbol = this.options.insertSpaces
      ? " "
      : "\t";
  }

  public intend(): string {
    return this.intendSymbol.repeat(this.indentation);
  }

  public decresIntend() {
    this.indentation -= this.options.tabSize;
  }

  public increaseIntend() {
    this.indentation += this.options.tabSize;
  }

  public padRight(text: string): FormattingContext {
    this.padRightSymbol = text;
    return this;
  }

  public getPadRight(): string {
    const result = this.padRightSymbol
    this.padRightSymbol = "";
    return result;
  }

  public checkLineBreaksToRight(value: string) {
    this._hasMultipleLineBreaksToRight =
      value.trim().length > 0
        ? (value.match(/\n/g) || []).length > 2
        : false;
  }

  public hasMultipleLineBreaksToRight(): boolean {
    return this._hasMultipleLineBreaksToRight;
  }

  public cleanLineBreaksCounter() {
    this._hasMultipleLineBreaksToRight = false;
  }
}