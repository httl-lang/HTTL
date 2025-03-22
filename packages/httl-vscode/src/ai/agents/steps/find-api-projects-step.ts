import * as vscode from 'vscode';
import { FileService } from '../../../common';
import { AgentStepBase } from '../../core/agent-step-base';
import { PROJECT_FOOTPRINTS } from './common';

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
  - Identify only the projects that contain API frameworks.
  - Return information only for API backend-based projects.
  - Provide the final response as a plain JSON array, where each element follows the format:
    { "name": "<project_name>", "path": "<project_path>", "technology": "<NodeJs - NestJs, Python - FastAPI, etc.>" }
  `;

  // protected override startMessage = () =>
  //   `Instructions:
  // - Use the tools to find the root projects based on the footprint.
  //   e.g. package.json for Node.js, .csproj for .NET, pyproject.toml for Python etc.
  // - Always use **wildcard patterns ('**/filename')** to locate relevant project footprint files.
  // - Use the tools to load the entry files to find out only the projects that contain the API frameworks.
  // - Return the information only for the API backend based projects
  // - Provide final response in a plain json array of elements in a format { name: <project_name>, path: <project_path>, technology: <NodeJs - NestJs, Python - FastApi, etc.> }
  // `;

  //   protected override startMessage = () =>
  //     `### Objective:
  // Identify all API backend projects in the current workspace using a **global pattern search** based on project footprints and technology stack.

  // ### Instructions:
  // 1. **Perform a global search** across all directories to identify potential API backend projects.
  //   - Always use **wildcard patterns ('**/filename')** to locate relevant project footprint files.
  //   - Search must be **fully recursive**, covering all subdirectories.

  // 2. **Detect root project directories** based on standard footprint files:
  //   - **Node.js:** Locate '**/package.json'
  //   - **.NET:** Locate '**/*.csproj'
  //   - **Python:** Locate '**/pyproject.toml'
  //   - **Go:** Locate '**/go.mod'
  //   - **Java:** Locate '**/pom.xml', '**/build.gradle'
  //   - **Ruby:** Locate '**/Gemfile'
  //   - **PHP:** Locate '**/composer.json'
  //   - **Rust:** Locate '**/Cargo.toml'
  //   - **Other languages:** Search for similar footprint files.

  // 3. **Validate API backend projects**:
  //    - Load entry files to determine if the project contains an API framework.
  //    - Identify API frameworks for each technology:
  //      - **Node.js:** Check for 'express', '@nestjs/core', 'fastify'
  //      - **Python:** Check for 'fastapi', 'flask', 'djangorestframework'
  //      - **.NET:** Check for 'Microsoft.AspNetCore'
  //      - **Java:** Check for 'spring-boot-starter-web'
  //      - **Go:** Check for 'github.com/gin-gonic/gin', 'github.com/labstack/echo'
  //      - **Ruby:** Check for 'rails'
  //      - **PHP:** Check for 'laravel/framework'
  //      - **Rust:** Check for 'axum', 'actix-web'

  // 4. **Return only API backend projects** in the response.

  // 5. **Format the response as a minified JSON array** without any markdown, explanations, or extra text:
  //    - Each project should be structured as:
  //      \`\`\`json
  //      {"name":"<project_name>","path":"<project_path>","technology":"<Node.js - Express, Python - FastAPI, etc.>"}
  //      \`\`\`
  //    - Example Response:
  //      \`\`\`json
  //      [
  //        {"name":"auth-service","path":"/projects/auth-service","technology":"Node.js - NestJS"},
  //        {"name":"user-api","path":"/projects/user-api","technology":"Python - FastAPI"}
  //      ]
  //      \`\`\`

  // 6. **Ensure a minified JSON response**:
  //    - The output must not contain new lines, spaces, indentation, or be wrapped in markdown (' \`\`\`json ').
  // `;

  protected override resultMessage(projects: FindApiProjectsStepResult[]): string {
    const projectsText = projects.map((p) => `  - ${p.name}, path: ${p.path}, technology: ${p.technology};`).join('\n');

    return `Found API projects:
${projectsText}

I select the project: ${projects[0].name} for further exploration.
`;
  }
}