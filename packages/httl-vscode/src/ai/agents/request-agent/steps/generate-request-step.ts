import { AgentStepBase } from '../../../core/agent-step-base';

export class GenerateRequestStep extends AgentStepBase<any> {

  protected override startMessage = () =>
    `Instructions:

  - Generate a request body using this JSON object \`${this.args[0]}\`.
  - You must return plain **VALID JSON** string without wrapping in \`\`\`json\`\`\` block!
`;
}