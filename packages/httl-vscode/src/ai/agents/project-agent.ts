import * as vscode from 'vscode';
import { Agent } from '../core/agent';
import { LLM } from '../core/llm';
import { FindApiControllersStep, FindApiControllersStepResult } from './steps/find-api-controllers-step';
import { GenerateSpecStep } from './steps/generate-spec-step';
import { FindApiProjectsStep, FindApiProjectsStepResult } from './steps/find-api-projects-step';
import { HttlExtensionContext } from '../../common';

const INSTRUCTIONS_PROMPT = `
Purpose:
  - You are an API that responds strictly in VALID JSON format without any markdown, explanations, line breaks, or formatting.
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

export interface ControllerSpec {
  tag: string;
  spec: any;
}

export class ApiProjectListResult {
  constructor(
    public readonly projects: FindApiProjectsStepResult[]
  ) { }
}

export class ApiControllerListResult {
  constructor(
    public readonly controllers: FindApiControllersStepResult[]
  ) { }
}

export class ApiControllerSpecResult {
  constructor(
    public readonly tag: string,
    public readonly spec: any
  ) { }
}

// export class ProjectAgentResult {
//   public static apiProjects(projects: FindApiProjectsStepResult[]) {
//     return new ProjectAgentResult('set-workspace-api-projects', projects);
//   }

//   public static apiControllers(controllers: FindApiControllersStepResult[]) {
//     return new ProjectAgentResult('set-workspace-api-controllers', controllers);
//   }

//   public static controllerSpec(controllerSpec: ControllerSpec) {
//     return new ProjectAgentResult('set-workspace-api-controller-spec', controllerSpec);
//   }

//   constructor(
//     public readonly command: string,
//     public readonly payload: any,
//   ) { }
// }

export class ProjectAgent {

  constructor(
    private readonly context: HttlExtensionContext,
  ) { }

  public async *analyze(): AsyncGenerator<any, any, any> {

    const workDir = this.context.getWorkspaceDirectory();
    if (!workDir) {
      vscode.window.showErrorMessage('No workspace opened.');
      return;
    }

    const instructions = INSTRUCTIONS_PROMPT.replace('<directory>', workDir);

    const agent = new Agent({
      llm: await LLM.create(),
      instructions,
    });

    const apiProjectsResult = await agent.run(FindApiProjectsStep);
    yield new ApiProjectListResult(apiProjectsResult.result);

    const apiControllersResult = await agent.run(FindApiControllersStep);
    const apiControllers = apiControllersResult.result.sort((a, b) => a.tag.localeCompare(b.tag));
    yield new ApiControllerListResult(apiControllers);

    const result: any[] = [];
    for (const controller of apiControllers) {
      const controllerSpec = await agent.run(GenerateSpecStep, controller);
      result.push(controllerSpec.result);

      yield new ApiControllerSpecResult(
        controller.tag,
        controllerSpec.result,
      );
    }
  }
}