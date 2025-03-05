import * as vscode from 'vscode';
import { LLM } from './llm';
import { FindFilesTool, findFilesTool } from './tools/find-files-tool';
import { GetFileContentTool, getFileContentTool } from './tools/get-file-content-tool';

export type AgentStepType<TResult> = new (llm: LLM, args: any[]) => AgentStepBase<TResult>;

export interface AgentStepResult<TResult> {
  name: string;
  result: TResult;
  message: string;
}

export abstract class AgentStepBase<TResult> {
  public static readonly MAX_ITERATIONS = 10;

  protected response: string = '';
  protected result?: AgentStepResult<TResult>;
  protected iterations = NaN;

  constructor(
    protected readonly llm: LLM,
    protected readonly args: any[] = []
  ) { }

  public async start() {
    this.iterations = Number.isNaN(this.iterations) ? 0 : this.iterations + 1;

    if (this.iterations > AgentStepBase.MAX_ITERATIONS) {
      throw new Error(`Max iterations reached for ${this.constructor.name}`);
    }

    if (this.iterations > 0) {
      this.nextIteration(this.iterations);
    } else {
      await this.startAction();
    }
  }

  protected async startAction() {
    this.llm.addUserMessage(
      this.startMessage()
    );
  }

  public getOptions(): vscode.LanguageModelChatRequestOptions {
    return {
      toolMode: vscode.LanguageModelChatToolMode.Auto,
      tools: [
        findFilesTool,
        getFileContentTool,
      ],
    };
  }

  public addResponse(value: string) {
    this.response += value;
  }

  public async execute(tool: vscode.LanguageModelToolCallPart): Promise<string | undefined> {
    if (tool.name === findFilesTool.name) {
      const { pattern, baseUri, purpose } = tool.input as { pattern: string; baseUri: string, purpose: string; };
      const { files, message } = await FindFilesTool.invoke({ pattern, baseUri });

      return message;
    }

    if (tool.name === getFileContentTool.name) {
      const tool_result = await GetFileContentTool.invoke(tool.input as any);
      return tool_result;
    }
  }

  public processResponse(): boolean {
    if (!this.response) {
      return false;
    }

    const parsedResponse = this.parseResponse(this.response);

    this.result = {
      name: this.constructor.name,
      result: parsedResponse,
      message: this.resultMessage(parsedResponse)
    };

    return true;
  }

  public isDone(): boolean {
    return this.result !== undefined;
  }

  public getResult(): AgentStepResult<TResult> {
    if (!this.result) {
      throw new Error('Result is not defined');
    }

    return this.result;
  }

  protected abstract startMessage(): string;

  protected parseResponse(response: string | undefined): any {
    return response;
  }

  protected nextIteration(iteration: number) {
    this.llm.addUserMessage("Continue");
  }

  protected resultMessage(result: any): string {
    return JSON.stringify(result, null, 2);
  }
}
