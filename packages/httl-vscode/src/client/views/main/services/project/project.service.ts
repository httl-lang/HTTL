import * as vscode from "vscode";
import fs from "fs";
import * as fsPath from "path";
import { Json } from "httl-common";

import { FileSearch, HttlExtensionContext, UIMessageType } from "../../../../../common";
import { HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData, EndpointScriptId, UpdateEndpointScriptCode, UpdatePrestartScriptCode } from "./types";
import { HttlProject } from "./project";
import { ApiControllerListResult, ApiControllerSpecResult, ApiProjectListResult, ProjectAgent } from "../../../../../ai/agents/project-agent";

export class HttlProjectService {
  private projects = new Map<string, HttlProject>();
  private readonly projectAgent: ProjectAgent;
  private readonly workDir: string;

  constructor(
    private readonly context: HttlExtensionContext,
    private webProvider: {
      run: (script: string, source: string) => void,
      postMessage: (command: UIMessageType, ...args: any[]) => void,
    }
  ) {
    this.projectAgent = new ProjectAgent(this.context);
    this.workDir = this.context.getWorkspaceDirectory()!;
  }

  public async resolveProjects({ search }: { search: string }): Promise<HttlProjectItem[]> {
    try {
      const files = await FileSearch.search('**/*.json', undefined, false);

      const infos: HttlProjectFileInfo[] = files
        .map(file => {
          const fullPath = fsPath.join(this.workDir, file);
          return {
            path: file,
            content: Json.safeParse(
              fs.readFileSync(fullPath, 'utf-8')
            )
          };
        }
        )
        .filter(({ path, content }) =>
          HttlProject.isValid(content) && (
            content.name.includes(search) ||
            content.source.includes(search) ||
            path.includes(search)
          )
        )
        .map(file => ({
          id: file.path,
          name: file.content.name,
          path: file.path,
        }));

      if (infos.length === 0 && URL.canParse(search)) {
        return [{
          id: search,
          name: 'Import From OpenAPI Spec',
          specUrl: search,
        }];
      }

      return infos;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public isSync(path: string): boolean | undefined {
    const original = this.projects.get(path);
    if (!original) {
      return undefined;
    }

    const updated = HttlProject.open(path);
    return original.equals(updated);
  }

  public async openProject({ path }: { path: string }): Promise<HttlProjectViewData> {
    let project = this.projects.get(path);

    if (project) {
      await project.sync();
    } else {
      project = HttlProject.open(path);
      this.projects.set(path, project);
    }

    return project.getViewData();
  }

  public async importFromOpenApiSpec({ url }: { url: string }): Promise<HttlProjectViewData> {
    if (!URL.canParse(url)) {
      throw new Error('Invalid URL');
    }

    const response = await fetch(url);
    const openApiSpec = await response.text();

    const project = HttlProject.fromSpec(openApiSpec, url);
    await project.save();

    return project.getViewData();
  }

  public async runScript({ projectFile, scriptId }: EndpointScriptId): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    if (!scriptId) {
      throw new Error('Script id is required');
    }

    const code =
      project.props.scripts.find(s => s.id === scriptId)?.code ??
      project.generateRequestScript(scriptId);

    if (!code) {
      throw new Error('Code is required');
    }

    // TODO: temporary solution
    const prestartScript = project.props.prestart.code;
    const finalScript = prestartScript + '\n' + code;

    await this.webProvider.run(finalScript, `project::${project.filePath}::${scriptId}`);
  }

  public async updateScript({ projectFile, scriptId, code }: UpdateEndpointScriptCode): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    project.updateScript(scriptId, code!, true);

    await project.save();
  }

  public async updatePrestartScript({ projectFile, code }: UpdatePrestartScriptCode): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    project.updatePrestartScript(code);

    await project.save();
  }

  public async resetScript({ projectFile, scriptId }: EndpointScriptId): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    project.resetScript(scriptId);

    await project.save();
  }

  public async generateRequestScript({ projectFile, scriptId }: EndpointScriptId): Promise<string> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    return project.generateRequestScript(scriptId);
  }

  public async showBodySchema({ projectFile, scriptId }: EndpointScriptId): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    const endpoint = project.getEndpoint(scriptId);
    if (endpoint.hasBodySchema()) {
      const document = await vscode.workspace.openTextDocument({
        content: endpoint.getBodyModel(),
        language: 'json',
      });

      vscode.window.showTextDocument(document);
    }
  }

  public async showResponseSchema({ projectFile, scriptId }: EndpointScriptId): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    const endpoint = project.getEndpoint(scriptId);
    if (endpoint.hasResponseSchema()) {
      const document = await vscode.workspace.openTextDocument({
        content: endpoint.getResponseModel(),
        language: 'json',
      });

      vscode.window.showTextDocument(document);
    }
  }

  public async runAgentAnalysis({ projectFile }: { projectFile?: string }): Promise<void> {
    // const project = this.projects.get(projectFile);
    // if (!project) {
    //   throw new Error('Project not found');
    // }

    let project!: HttlProject;

    for await (const result of this.projectAgent.analyze()) {

      if (result instanceof ApiProjectListResult) {
        if (result.projects.length === 0) {
          throw new Error('No API projects found');
        }

        for (const foundProject of result.projects) {
          const newProject = HttlProject.create(foundProject.name, {
            name: foundProject.name,
            source: foundProject.path,
          });

          await newProject.save();
          
          // Take the first project
          project ??= newProject;
        }

        if (!project) {
          throw new Error('Project not found');
        }
        
        await this.webProvider.postMessage('agent-analysis-event', {
          payload: {
            type: 'project-created',
            data: project.filePath
          }
        });
      }

      if (result instanceof ApiControllerListResult) {
        project.addTags(result.controllers);
        await project.save();
        await this.webProvider.postMessage('agent-analysis-event', {
          payload: {
            type: 'spec-tags-updated',  
            data: result.controllers
          }
        });
      }

      if (result instanceof ApiControllerSpecResult) {
        project.mergeSpecForTag(result.tag, result.spec);
        await project.save();
        await this.webProvider.postMessage('agent-analysis-event', {
          payload: {
            type: 'spec-tag-endpoints-completed',
            data: result.tag
          }
        });
      }
    }
  }
}