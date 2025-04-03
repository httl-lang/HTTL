import * as vscode from 'vscode';
import { AgentStepBase } from './agent-step-base';

export class LLM {
  private static MAX_ATTEMPTS = 10;
  // gpt-4o, gpt-4o-mini, o1, o1-mini, claude-3.5-sonnet, o3-mini
  private static MODEL = 'gpt-4o-mini'; //'gpt-4o'; //'o3-mini'

  public static async create() {
    for (let attempts = 0; attempts < this.MAX_ATTEMPTS; attempts++) {
      const model = await this._create();
      if (model) {
        return new LLM(model);
      }
    }

    throw new Error('Model not found');
  }

  private static async _create(): Promise<vscode.LanguageModelChat | undefined> {
    try {
      const [model] = await vscode.lm.selectChatModels({
        vendor: 'copilot',
        family: this.MODEL
      });

      if (model) {
        return model;
      }
    } catch (error) {
      console.error(error);
    }

    return new Promise<undefined>((resolve) => setTimeout(resolve, 500));
  }

  private messages: vscode.LanguageModelChatMessage[] = [];

  private constructor(
    public readonly model: vscode.LanguageModelChat
  ) {
  }

  public async sendRequest(
    step: AgentStepBase<any>,
    token: vscode.CancellationToken
  ) {

    return this.model.sendRequest(this.messages, {
      justification: "Generate OpenAPI 3.x specification for current work directory.",
      modelOptions: {
        temperature: 0.0,
      },
      ...step.getOptions(),
    }, token);
  }

  public async addMessage(message: vscode.LanguageModelChatMessage) {
    this.messages.push(message);
  }

  public async addUserMessage(message: string) {
    this.messages.push(
      vscode.LanguageModelChatMessage.User(message)
    );
  }
}