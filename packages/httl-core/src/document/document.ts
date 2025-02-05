import * as fs from 'fs';

import { Lang, Position } from "../common";
import { IHttlContext } from "../httl";
import { IRuntimeExecutor } from "../runtime";
import { CompletionItem } from "../code/completion/completion-item";
import { CompletionService, FormattingService, FormattingOptions } from '../code';
import { HttlDocumentOutput } from './document-output';

export class HttlDocument {
  private text: string;
  private results: HttlDocumentOutput[] = [];

  constructor(
    public readonly filePath: string,
    private readonly context: IHttlContext,
    private readonly content?: string,
  ) { }

  public sync(text?: string): HttlDocument {
    this.text = text || fs.readFileSync(this.filePath, 'utf-8');
    return this;
  }

  public async validate(parent?: IRuntimeExecutor): Promise<IRuntimeExecutor> {
    const program = this.compile(parent);

    const executor = await this.context.runtime.validate(program, this, parent);
    return executor;
  }

  public async run(parent?: IRuntimeExecutor): Promise<HttlDocumentOutput> {
    const program = this.compile(parent);

    const executor = await this.context.runtime.run(program, this, parent);

    const result = new HttlDocumentOutput(executor);

    this.results.push(result);

    return result;
  }

  public async completion(position: Position, inline = false): Promise<CompletionItem[]> {
    const executor = await this.validate();
    const provider = new CompletionService(executor);

    return provider.completion(position, inline)
  }

  public async format(options: FormattingOptions): Promise<string> {
    const program = this.context.compiler.compile(this.text);
    if (program.errorExpr == null) {
      const provider = new FormattingService(program);
      return provider.format(options);
    }

    return this.text;
  }

  private compile(parent?: IRuntimeExecutor) {
    const program = this.context.compiler.compile(this.text);

    if (!parent && !Lang.isDefaultHttlFile(this.filePath) && this.context.hasDefaultHttlFile()) {
      program.addDefaultApi();
    }

    return program;
  }
}
