import * as vscode from 'vscode';
import { LLM } from './llm';
import { FindFilesTool, findFilesTool } from './tools/find-files-tool';
import { GetFileContentTool, getFileContentTool } from './tools/get-file-content-tool';

export type AgentStepType = new (llm: LLM) => AgentStepBase;

export interface AgentStepResult {
  name: string;
  result: any;
  message: string;
}

export abstract class AgentStepBase {
  private static readonly MAX_ITERATIONS = 10;

  protected response: string = '';
  protected result?: AgentStepResult;
  protected iterations = 0;

  constructor(
    protected readonly llm: LLM
  ) { }

  public start() {
    if (this.iterations > AgentStepBase.MAX_ITERATIONS) {
      throw new Error(`Max iterations reached for ${this.constructor.name}`);
    }

    if (this.iterations > 0) {
      this.nextIteration();
    } else {
      this.startMessage();
    }

    this.iterations++;
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
      const { pattern, purpose } = tool.input as { pattern: string; purpose: string; };
      const { files, message } = await FindFilesTool.invoke({ pattern });

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

  public getResult(): AgentStepResult {
    if (!this.result) {
      throw new Error('Result is not defined');
    }

    return this.result;
  }

  protected abstract startMessage(): string;

  protected parseResponse(response: string | undefined): any {
    return response;
  }

  protected nextIteration() {
    this.llm.addUserMessage("Continue");
  }

  protected resultMessage(result: any): string {
    return JSON.stringify(result, null, 2);
  }
}
