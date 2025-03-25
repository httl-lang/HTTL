import * as vscode from "vscode";
import fs from "fs";
import * as fsPath from "path";
import { Json } from "httl-common";

import { FileService, HttlExtensionContext, UIMessageType } from "../../../../../common";
import { HttlProjectItem, HttlProjectViewData, EndpointScriptId, UpdateEndpointScriptCode, UpdatePrestartScriptCode } from "./types";
import { HttlProject } from "./project";
import { ApiControllerListResult, ApiControllerSpecResult, ApiProjectListResult, ProjectAgent } from "../../../../../ai/agents/project-agent";
import { RequestAgent } from "../../../../../ai/agents/request-agent";
import { ProjectFileWatcher } from "./project-file-watcher";

export class HttlProjectService {
  private projects = new Map<string, HttlProject>();
  private disableProjectSync = false;
  private readonly projectAgent: ProjectAgent;
  private readonly requestAgent: RequestAgent;
  private readonly workDir: string;

  constructor(
    private readonly context: HttlExtensionContext,
    private webProvider: {
      run: (script: string, source: string) => void,
      postMessage: (command: UIMessageType, ...args: any[]) => void,
    }
  ) {
    this.projectAgent = new ProjectAgent(this.context);
    this.requestAgent = new RequestAgent(this.context);
    this.workDir = this.context.getWorkspaceDirectory()!;

    ProjectFileWatcher.register(context, '**/*.json')({
      onDidChange: this.onProjectFileChange
    });
  }

  private onProjectFileChange = async (filePath: string) => {
    if (this.disableProjectSync) {
      return;
    }

    if (this.isSync(filePath) === false) {
      await this.webProvider.postMessage('reload-project', {
        file: filePath,
      });
    }
  };

  public async resolveProjects({ search }: { search: string }): Promise<HttlProjectItem[]> {
    try {
      const files = await FileService.search('**/*.json', undefined, false);

      const infos: HttlProjectItem[] = files
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

      if (URL.canParse(search)) {
        infos.unshift({
          id: search,
          name: 'Import from OpenAPI Spec',
          specUrl: search,
          divider: infos.length > 0
        });
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

  public async openProject({ path, fullSync }: { path: string, fullSync?: boolean }): Promise<HttlProjectViewData> {
    let project = this.projects.get(path);

    if (project) {
      await project.sync(fullSync);
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

    const project = await HttlProject.fromSpecUrl(url);
    await project.save();

    this.projects.set(project.filePath, project);

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

  public async generateAiRequestScript({ projectFile, scriptId }: EndpointScriptId): Promise<string> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    const endpoint = project.getEndpoint(scriptId);

    if (!endpoint.hasBodySchema()) {
      throw new Error('Endpoint has no body schema');
    }

    const generatedBody = await this.requestAgent.generateRequest(endpoint.getBodyModel());

    const result = `${endpoint.getMethodAndPath()} ${JSON.stringify(generatedBody, null, 2)}`;

    return result;
  }

  public async stopGenerateAiRequestScript() {
    this.requestAgent.stop();
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

  public async showOpenApiSpec({ projectFile }: EndpointScriptId): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    if (project.props.spec) {
      const document = await vscode.workspace.openTextDocument({
        content: JSON.stringify(project.props.spec, null, 2),
        language: 'json',
      });

      vscode.window.showTextDocument(document);
    }
  }

  public async runAgentAnalysis({ projectFile }: { projectFile?: string }): Promise<void> {
    let project!: HttlProject;

    try {
      this.disableProjectSync = true;

      if (projectFile) {
        project = this.projects.get(projectFile)!;

        if (!project) {
          throw new Error(`Project ${projectFile} not found`);
        }
      }

      for await (const result of this.projectAgent.analyze(project?.props.source)) {

        if (result instanceof ApiProjectListResult) {
          if (result.projects.length === 0) {
            throw new Error('No API projects found');
          }

          if (project) {

            if (result.projects.length > 1) {
              throw new Error('Multiple projects found in the same directory');
            }

            if (FileService.relative(this.workDir, result.projects[0].path) !== project.props.source) {
              throw new Error('Project path mismatch');
            }

            project.setDefaultSpec();
            await project.save();
          } else {

            for (const foundProject of result.projects) {
              const newProject = HttlProject.create(foundProject.name, {
                name: foundProject.name,
                source: foundProject.path.startsWith('http')
                  ? foundProject.path
                  : FileService.relative(this.workDir, foundProject.path),
              });

              await newProject.save();

              // Take the first project
              project ??= newProject;
            }

            if (!project) {
              throw new Error('Project not found');
            }

            this.projects.set(project.filePath, project);
          }

          await this.webProvider.postMessage('agent-analysis-event', {
            payload: {
              type: 'project-setup',
              data: project.filePath
            }
          });
        }

        if (result instanceof ApiControllerListResult) {
          project.updateTags(result.controllers);
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
    } finally {
      this.disableProjectSync = false;
    }
  }

  public stopAgentAnalysis() {
    this.projectAgent.stop();
  }
}