import * as vscode from 'vscode';
import { LLM } from "./llm";
import { AgentStepBase, AgentStepResult, AgentStepType } from './agent-step-base';

export class Agent {
  private readonly llm: LLM;
  private readonly instructions: string;
  private readonly context: AgentStepResult<any>[] = [];

  constructor(
    {
      llm,
      instructions,
    }: { llm: LLM, instructions: string }
  ) {
    this.llm = llm;
    this.instructions = instructions;

    this.llm.addMessage(vscode.LanguageModelChatMessage.User(instructions));
  }

  public async run<TResult>(stepType: AgentStepType<TResult>, ...args: any[]): Promise<AgentStepResult<TResult>> {
    const step = new stepType(this.llm, args);
    while (!step.isDone()) {
      step.start();

      const chatResponse = await this.llm.sendRequest(
        step,
        new vscode.CancellationTokenSource().token
      );

      for await (const chunk of chatResponse.stream) {
        if (chunk instanceof vscode.LanguageModelTextPart) {
          step.addResponse(chunk.value);
        } else if (chunk instanceof vscode.LanguageModelToolCallPart) {
          this.llm.addMessage(
            vscode.LanguageModelChatMessage.Assistant([
              new vscode.LanguageModelToolCallPart(chunk.callId, chunk.name, chunk.input),
            ]),
          );

          const tool_result = await step.execute(chunk);

          if (tool_result === undefined) {
            throw new Error('Tool result is undefined');
          }

          this.llm.addMessage(
            vscode.LanguageModelChatMessage.User([
              new vscode.LanguageModelToolResultPart(chunk.callId, [
                new vscode.LanguageModelTextPart(tool_result),
              ]),
            ]),
          );
        }
      }

      const result = step.processResponse();
      if (result) {
        this.context.push(step.getResult());
        this.llm.addUserMessage(step.getResult().message);
      }
    }

    return step.getResult();
  }

  // public async run() {
  //   for (const stepType of this.stepTypes) {
  //     this.runStep(stepType); 
  //   }

  //   const lastResponse = this.context.at(-1);
  //   if (!lastResponse) {
  //     throw new Error('Response is undefined');
  //   }

  //   return lastResponse.result;
  // }
}