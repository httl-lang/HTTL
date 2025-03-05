import * as vscode from 'vscode';
import { AgentStepBase, AgentStepResult } from '../../core/agent-step-base';
import { FindApiControllersStep, FindApiControllersStepResult } from './find-api-controllers-step';
import { LLM } from '../../core/llm';

// 2. Load tsconfig.json

export class GenerateSpecStep extends AgentStepBase<any> {

  protected override startMessage = () =>
    `1. For each endpoints in the '${this.args[0].name}' file use the tools to load input and return dependence types.
3. Make sure you resolve the imports of such dependencies correctly, considering aliases and relative paths.
    If required use the tool to load any metadata files (e.g. package.json, webpack.js, tsconfig.json) that help you resolve aliases.
3. Generate me OpenApi 3.x json specification for '${this.args[0].name}' controller file.`;


  protected override parseResponse(response: string | undefined): any {
    try {
      return JSON.parse(response!);
    } catch (error) {
      const errorMessage = `Error parsing response: ${response}`;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
}