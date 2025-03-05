import * as vscode from 'vscode';
import { Agent } from '../core/agent';
import { LLM } from '../core/llm';
import { FindApiControllersStep, FindApiControllersStepResult } from './steps/find-api-controllers-step';
import { GenerateSpecStep } from './steps/generate-spec-step';
import { FindApiProjectsStep } from './steps/find-api-projects-step';

const INSTRUCTIONS_PROMPT = `
Purpose:
  You are a world-class expert at OpenApi specification and source code discovery with access to tools.
  Your goal is to generate OpenApi 3.x json specification for each controllers for the selected project in the <directory> directory.

Instructions:
  - You will be instructed along the way to find the API backend projects and their files that contain API controllers and generate OpenApi spec.
    
General Instructions:
  - Use the provided tools to find only the projects that contain an API.
  - Use the provided tools to explore the specified project's files.
  - Use the tools to get the content of each controller file.
  - For each endpoint use the tools to load dependencies and return types.
  - Split generated OpenApi 3.x across multiple responses for each controller.
  - You must return plain json without wrapping in \`\`\`json\`\`\` block!
`;

export class OpenapiSpecAgent {

  public static getWorkspaceDirectory(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].uri.fsPath; // Returns the first workspace folder's path
    }
    return undefined; // No workspace opened
  }

  public static async *run(): AsyncGenerator<any, any, any> {
    const result: any[] = [];
    const agent = new Agent({
      llm: await LLM.create(),
      instructions: INSTRUCTIONS_PROMPT.replace('<directory>', this.getWorkspaceDirectory()!),
    });

    const apiProjectResult = await agent.run(FindApiProjectsStep);
    yield apiProjectResult.result;

    const apiControllersResult = await agent.run(FindApiControllersStep);
    yield apiControllersResult.result;

    const apiControllers = apiControllersResult.result;

    for (const controller of apiControllers) {
      const controllerSpec = await agent.run(GenerateSpecStep, controller);
      result.push(controllerSpec.result);
    }

    yield result;
  }
}