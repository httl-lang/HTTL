import * as vscode from 'vscode';
import { FindFilesTool, findFilesTool } from './find-files-tool';
import { GetFileContentTool, getFileContentTool } from './get-file-content-tool';
import { FindDepTool, findDepTool } from './find-dep-tool';
import { LLM } from '../ai/llm';

// const ANNOTATION_PROMPT =
//   `You are the world class expert in OpenApi specification and your task to create a new OpenApi 3.x json specification based on provided block of NestJS codes. You must return plain json wihtout wrapping in \`\`\`json\`\`\` block!`;

// const ANNOTATION_PROMPT =
//   `You are a world-class expert at OpenApi specification with access to tools and you must to create a new OpenApi 3.x json specification for NestJS  projects in the current work directory. 
// Instead of providing a final result, break down the task on smaller steps:
// 1. Find all controllers in the project
// 2. For each controller, extract the methods and their relevant metadata.
// 3. Generate OpenApi paths and definitions based on the extracted information.
// 4. Combine the results into a single OpenApi 3.x json specification.`;


const ANNOTATION_PROMPT = `
Purpose:
    You are a world-class expert at OpenApi specification and source code discovery with access to tools.
    Your goal is to generate OpenApi 3.x json specification for each controller in the NestJs project.

Instructions:
    - Use the provided tools to explore the current NestJs project's files that contain API.
    - Use the tools to get the content of each controller file.
    - For each endpoint use the tools to load dependencies and return types.
    - Split generated OpenApi 3.x across multiple responses for each controller.
    - You must return plain json without wrapping in \`\`\`json\`\`\` block!
`;

// - You must return plain json without wrapping in \`\`\`json\`\`\` block!


export class LmTest {

  private model!: vscode.LanguageModelChat;


  public async start(query: string): Promise<any> {
    const llm = await LLM.create();

    this.model = llm.model;

    return await this.pipeline();
  }

  private async pipeline() {

    const lmOptions = {
      toolMode: vscode.LanguageModelChatToolMode.Auto,
      tools: [
        findFilesTool,
        // findDepTool,
        getFileContentTool,
      ],
    };

    const messages = [
      vscode.LanguageModelChatMessage.User(ANNOTATION_PROMPT),
      // vscode.LanguageModelChatMessage.User("Generate me OpenApi 3.x json specification for current work directory."),
    ];

    let compute_iterations = 0;
    let accumulatedResponses = [];

    let controllerFiles: { file: string, content?: string }[] = [];
    const processedFiles: string[] = [];

    while (true) {
      try {

        compute_iterations++;

        const chatResponse = await this.model.sendRequest(
          messages,
          lmOptions,
          new vscode.CancellationTokenSource().token
        );

        for await (const chunk of chatResponse.stream) {
          if (chunk instanceof vscode.LanguageModelTextPart) {
            console.log("TEXT", chunk);
            accumulatedResponses.push(chunk.value);
          } else if (chunk instanceof vscode.LanguageModelToolCallPart) {
            console.log("TOOL CALL", chunk);

            messages.push(
              vscode.LanguageModelChatMessage.Assistant([
                new vscode.LanguageModelToolCallPart(chunk.callId, chunk.name, chunk.input),
              ]),
            );

            let tool_result = "";

            if (chunk.name === findFilesTool.name) {
              const { pattern, purpose } = chunk.input as { pattern: string, purpose: string };

              const { files, message } = await FindFilesTool.invoke({ pattern });
              tool_result = message;

              if (purpose === 'controller') {
                controllerFiles = files.map(file => ({
                  file,
                  content: undefined
                }));
              }
            }

            if (chunk.name === getFileContentTool.name) {
              tool_result = await GetFileContentTool.invoke(chunk.input as any);
              const controller = controllerFiles.find(x => x.file === (chunk.input as any).filePath);
              if (controller) {
                controller.content = tool_result;
              }
            }

            // if (chunk.name === findDepTool.name) {
            //   const { pattern } = chunk.input as { pattern: string };
            //   const { files, message } = await FindDepTool.invoke({ pattern });
            //   tool_result = message;
            // }

            messages.push(
              vscode.LanguageModelChatMessage.User([
                new vscode.LanguageModelToolResultPart(chunk.callId, [
                  new vscode.LanguageModelTextPart(tool_result),
                ]),
              ]),
            );
          }
        }

        let processingMode = false;

        if (processedFiles.length > 0) {
          processingMode = true;
          const file = processedFiles.shift()!;
          messages.push(
            vscode.LanguageModelChatMessage.User(
              `You already provided me OpenApi 3.x json specification for '${file}' controller file.`
            )
          );
        }

        if (processingMode && controllerFiles.length === 0) {
          return accumulatedResponses.join('');
        }

        if (controllerFiles.every(x => x.content !== undefined)) {
          const { file } = controllerFiles.shift()!;
          processedFiles.push(file);

          messages.push(
            vscode.LanguageModelChatMessage.User(
              `Generate me OpenApi 3.x json specification for '${file}' controller file.`
            )
          );

          // prompt = 'You already provided specificatioin for Tenant Controller, now provide specification for User Controller'
        } else {
          messages.push(
            vscode.LanguageModelChatMessage.User("Continue")
          );
        }

        // if (controllerFiles.length > 0) {
        //   const t = controllerFiles.pop();
        //   messages.push(
        //     vscode.LanguageModelChatMessage.User(`Generate me OpenApi 3.x json specification for '${t}' file.`)
        //   );

        // } else {

        // }

        // if (compute_iterations >= 2) {

        //   if (controllerFiles.length === 0) {
        //     return accumulatedResponses.join('');
        //   }

        //   const t = controllerFiles.pop();
        //   messages.push(
        //     vscode.LanguageModelChatMessage.User(`Generate me OpenApi 3.x json specification for '${t}' file.`)
        //   );
        // }
        // else {

        // }

        // messages.push(
        //   vscode.LanguageModelChatMessage.User(
        //     accumulatedResponses.length > 0 ? `Next file` : "Continue"
        //   ),
        // );

        // return response;
      } catch (error) {
        console.error(error);
        throw new Error('Error during pipeline execution');
      }
    }
  }
}