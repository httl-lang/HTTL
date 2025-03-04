import * as vscode from 'vscode';
import { Agent } from './agent';
import { LLM } from './llm';
import { ApiControllersStep } from './api-controllers-step';
import { GenerateSpecStep } from './generate-spec-step';
import { ApiProjectStep } from './api-project-step';
import { ControllerContentStep } from './controller-content-step';

// const ANNOTATION_PROMPT = `
// Purpose:
//     You are a world-class expert at OpenApi specification and source code discovery with access to tools.
//     Your goal is to generate OpenApi 3.x json specification for each controller in the NestJs project.

// Instructions:
//     - Use the provided tools to explore the current NestJs project's files that contain API.
//     - Use the tools to get the content of each controller file.
//     - For each endpoint use the tools to load dependencies and return types.
//     - Split generated OpenApi 3.x across multiple responses for each controller.
//     - You must return plain json without wrapping in \`\`\`json\`\`\` block!
// `;

const ANNOTATION_PROMPT = `
Purpose:
    You are a world-class expert at OpenApi specification and source code discovery with access to tools.
    Your goal is to generate OpenApi 3.x json specification for each controller in the project.

Instructions:
  - You will be instructed along the way to find the projects and their files that contain API controllers and generate OpenApi spec.
    
General Instructions:
    - Use the provided tools to find only the projects that contain an API.
    - Use the provided tools to explore the specified project's files.
    - Use the tools to get the content of each controller file.
    - For each endpoint use the tools to load dependencies and return types.
    - Split generated OpenApi 3.x across multiple responses for each controller.
    - You must return plain json without wrapping in \`\`\`json\`\`\` block!
`;

export class OpenapiSpecAgent {

  public static async run() {
    const agent = new Agent({
      llm: await LLM.create(),
      instructions: ANNOTATION_PROMPT
    })
      .pipe(ApiProjectStep)
      .pipe(ApiControllersStep)
      .pipe(ControllerContentStep)
      .pipe(GenerateSpecStep);

    // .pipe(findControllers)
    // .pipe(findDependencies)
    // .pipe(findDependencies)


    const result = await agent.run();

    return result;
  }
}