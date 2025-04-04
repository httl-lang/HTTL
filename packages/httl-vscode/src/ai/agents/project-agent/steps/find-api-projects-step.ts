import * as vscode from 'vscode';
import { FileService } from '../../../../common';
import { AgentStepBase } from '../../../core/agent-step-base';

const PROJECT_FOOTPRINTS = {
  nodejs: 'package.json',
  dotnet: '*.csproj',
  python: 'pyproject.toml',
  go: 'go.mod',
  java: ['pom.xml', 'build.gradle'],
  ruby: 'Gemfile',
  php: 'composer.json',
  rust: 'Cargo.toml'
};

export interface FindApiProjectsStepResult {
  name: string;
  path: string;
  technology: string; // e.g. NodeJs - NestJs, Python - FastApi, etc.
}

export class FindApiProjectsStep extends AgentStepBase<FindApiProjectsStepResult[]> {
  private get projectPath() {
    return this.args.length > 0
      ? this.args[0]
      : undefined;
  }

  private getSearchPattern(file: string) {
    return this.projectPath
      ? `${this.projectPath}/${file}`
      : `**/${file}`;
  }

  protected override async startAction() {
    this.llm.addUserMessage(
      this.startMessage()
    );

    const searches = Object.entries(PROJECT_FOOTPRINTS).flatMap(([technology, pattern]) => {
      return Array.isArray(pattern)
        ? pattern.map(x => FileService.search(this.getSearchPattern(x)))
        : FileService.search(this.getSearchPattern(pattern));
    });

    const findings = await Promise.all(searches);

    const rootFiles = findings
      .filter(f => f.length > 0)
      .flatMap(f => f);

    if (rootFiles.length === 0) {
      throw new Error('No root project files found');
    }

    const filesMessage = rootFiles.map(async (filePath) => {
      const file = await vscode.workspace.fs.readFile(
        vscode.Uri.file(filePath)
      );
      const content = new TextDecoder().decode(file);

      return `Content of ${filePath}:\n'${content}'`;
    });

    for await (const message of filesMessage) {
      this.llm.addUserMessage(message);
    }

    this.llm.addUserMessage("Provide the final response");
  }

  protected override startMessage = () =>
    `Instructions:
  - The next messages will contain root project files and their contents, based on the footprint.
  - Identify only the projects that contain API frameworks including NextJS.
  - Return information only for API backend-based projects.
  - Provide the final response as a plain JSON array, where each element follows the format:
    { "name": "<project_name>", "path": "<project_path>", "technology": "<NodeJs - NestJs, Python - FastAPI, etc.>" }
  `;

  protected override resultMessage(projects: FindApiProjectsStepResult[]): string {
    if (projects?.length === 0) {
      return `No API projects found.`;
    }

    const projectsText = projects.map((p) => `  - ${p.name}, path: ${p.path}, technology: ${p.technology};`).join('\n');

    return `Found API projects:
${projectsText}

I select the project: ${projects[0].name} for further exploration.
`;
  }
}