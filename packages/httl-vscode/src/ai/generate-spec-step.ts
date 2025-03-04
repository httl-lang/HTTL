import * as vscode from 'vscode';
import { AgentStepBase } from './agent-step-base';

export class GenerateSpecStep extends AgentStepBase {

  protected override startMessage = () => `1. For each endpoints in the 'user.controller.ts' file use the tools to load input and return dependence types.
2. Load tsconfig.json
3. Make sure you resolve the imports of such dependencies correctly, considering aliases and relative paths.
    If required use the tool to load any metadata files (e.g. package.json, webpack.js, tsconfig.json) that help you resolve aliases.
3. Generate me OpenApi 3.x json specification for 'user.controller.ts' controller file.`;

  public done() {
    this.llm.addMessage(
      vscode.LanguageModelChatMessage.User("Continue")
    );
    return this.response !== '';
  }
}