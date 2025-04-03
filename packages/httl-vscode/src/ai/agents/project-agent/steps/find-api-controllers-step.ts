import { AgentStepBase } from '../../../core/agent-step-base';

export interface FindApiControllersStepResult {
  name: string;
  tag: string;
  path: string;
}

export class FindApiControllersStep extends AgentStepBase<FindApiControllersStepResult[]> {
  public controllers: string[] = [];

  protected override startMessage = () =>
    `Instructions:
  - Find all API controllers files in the SELECTED PROJECT.
  - Prioritize TypeScript over JavaScript files.
  - Provide final response in a plain json array of elements in a format { name: <controller_file_name>, tag: <controller_api_tag>, path: <controller_path> }
`;

  protected override resultMessage(controllers: FindApiControllersStepResult[]): string {
    const controllersText = controllers.map((p) => `  - ${p.name}, path: ${p.path};`).join('\n');

    return `Found API controllers:\n${controllersText}`;
  }
}