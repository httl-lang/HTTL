import * as vscode from 'vscode';
import { findFilesTool, FindFilesTool } from './tools/find-files-tool';
import { getFileContentTool } from './tools/get-file-content-tool';
import { LLM } from './llm';
import { AgentStepBase } from './agent-step-base';

export class ApiControllersStep extends AgentStepBase {
  public controllers: string[] = [];

  protected override startMessage = () => "Find all files in the workspace that contain API controllers.";

  public async execute(tool: vscode.LanguageModelToolCallPart): Promise<string | undefined> {
    if (tool.name === findFilesTool.name) {
      const { pattern, purpose } = tool.input as { pattern: string, purpose: string };
      const { files, message } = await FindFilesTool.invoke({ pattern });

      this.controllers = files;
      return message;
    }
  }

  // public done() {
  //   return this.controllers.length > 0;

  //   // if (this.controllers.length === 0) {
  //   //   this.llm.addMessage(
  //   //     vscode.LanguageModelChatMessage.User("Continue")
  //   //   );
  //   // }
  // }
}