import * as vscode from 'vscode';
import { Agent } from '../core/agent';
import { LLM } from '../core/llm';
import { FindApiControllersStep } from './steps/find-api-controllers-step';
import { GenerateSpecStep } from './steps/generate-spec-step';
import { FindApiProjectsStep } from './steps/find-api-projects-step';
import { HttlExtensionContext } from '../../common';

const INSTRUCTIONS_PROMPT = `
Purpose:
  - You are an API that responds strictly in MINIFIED VALID JSON format without any markdown, explanations, line breaks, or formatting.
  - JSON.parse() must be able to parse the output without any errors.
  - You are a world-class expert at OpenApi specification and source code discovery with access to tools.
  - Your goal is to generate OpenApi 3.x json specification for each controllers for the selected project in the <directory> directory.

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

  constructor(
    private readonly context: HttlExtensionContext,
  ) { }

  public async *run(): AsyncGenerator<any, any, any> {

    const workDir = this.context.getWorkspaceDirectory();
    if (!workDir) {
      vscode.window.showErrorMessage('No workspace opened.');
      return;
    }

    const result: any[] = [];
    const instructions = INSTRUCTIONS_PROMPT.replace('<directory>', workDir);

    const agent = new Agent({
      llm: await LLM.create(),
      instructions,
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