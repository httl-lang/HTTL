import * as vscode from 'vscode';
import { findFilesTool, FindFilesTool } from './tools/find-files-tool';
import { GetFileContentTool, getFileContentTool } from './tools/get-file-content-tool';
import { LLM } from './llm';
import { AgentStepBase } from './agent-step-base';

export class ControllerContentStep extends AgentStepBase {
  protected override startMessage = () => "Get the content of each controller file.";

  public done() {
    return true;
    this.llm.addMessage(
      vscode.LanguageModelChatMessage.User("Continue")
    );
  }
}