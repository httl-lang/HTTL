import { AgentStepBase } from './agent-step-base';
import { LLM } from './llm';

interface ApiProjectStepResult {
  name: string;
  path: string;
  technology: string; // e.g. NodeJs - NestJs, Python - FastApi, etc.
}

export class ApiProjectStep extends AgentStepBase {

  protected override startMessage = () =>
    `Instructions:
  - Use the tools to find the root projects based on the footprint.
    e.g. package.json for Node.js, .csproj for .NET, pyproject.toml for Python etc.
  - Use the tools to load the entry files to find out only the projects that contain the API frameworks.
  - Return the information only for the API backend based projects
  - Provide final response in a plain json format { name: <project_name>, path: <project_path>, technology: <NodeJs - NestJs, Python - FastApi, etc.> }
`;

  protected override parseResponse(response: string | undefined): any {
    try {
      return JSON.parse(response!);
    } catch (error) {
      const errorMessage = `Error parsing response: ${response}`;
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  protected override resultMessage(projects: ApiProjectStepResult[]): string {
    const projectsText = projects.map((p) => `  - ${p.name}, path: ${p.path}, technology: ${p.technology}`).join('\n');

    return `Found API projects:\n${projectsText}`;
  }
}