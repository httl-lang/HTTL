import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { AgentAnalysisEventPayload } from "../../../../common";
import { ProjectApi } from "./project.api";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData } from "../../../../client/views/main/services/project";
import { EndpointModel } from "./endpoint/endpoint.model";

interface ApiEndpointGroup {
  name: string;
  inProgress: boolean;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint extends HttlProjectApiEndpoint {
  defaultScript?: string;
}

type AgentProgressType = 'project' | 'tags' | 'endpoints';

@Model()
export class ProjectModel {
  private agentTagsProgress: ApiEndpointGroup[] = [];
  public agentProgress?: AgentProgressType;

  public fileInfo?: HttlProjectFileInfo;
  public description?: string;
  public source?: string;
  public technologies?: string[];
  public prestart?: string;
  public endpoints: ApiEndpoint[] = [];
  public endpointGoups: ApiEndpointGroup[] = [];

  public error?: string;
  public focusedEndpoint?: EndpointModel;

  constructor(
    private readonly app = store(AppModel),
    private readonly api = new ProjectApi()
  ) { }

  public async init() {
    commutator.onAgentAnalysisEvent((result: AgentAnalysisEventPayload) => {
      this.onAgentAnalysisEvent(result.payload);
    });

    await this.restoreProjectState();
  }

  private async restoreProjectState() {
    // Get last opened project
    const { projectPath } = this.app.getAppState();
    if (!projectPath) {
      return;
    }

    try {
      const project = await this.api.openProject(projectPath);
      this.setProject(project);
    }
    catch (error) {
      this.closeProject();
      this.showError(`Failed to open project: ${projectPath}`);
    }
  }

  @Action()
  public showError(error: string) {
    this.error = error;
    setTimeout(() => {
      if (this.error === error) {
        this.closeError();
      }
    }, 5000);
  }

  @Action()
  public closeError() {
    this.error = undefined;
  }

  public setFocusedEndpoint(endpoint: EndpointModel) {
    this.focusedEndpoint?.blur();
    this.focusedEndpoint = endpoint;
    this.focusedEndpoint.focus();
  }

  public get sourceType() {
    return this.source?.startsWith('http') ? 'OpenApi' : 'Project';
  }

  public get supportAgentAnalysis() {
    return !this.source?.startsWith('http');
  }

  public resolveProjects(search: string): Promise<HttlProjectItem[]> {
    return this.api.resolveProjects(search);
  }

  @Action()
  public async selectProject(projectItem: HttlProjectItem): Promise<void> {
    try {
      const projectLoader =
        'path' in projectItem
          ? this.api.openProject(projectItem.path)
          : this.api.importFromOpenApiSpec(projectItem.specUrl);

      const project = await projectLoader;
      this.setProject(project);
    } catch (error) {
      this.showError(`Failed to open project: ${error}`);
    }
  }

  @Action()
  public async openProject(filePath: string): Promise<void> {
    const project = await this.api.openProject(filePath);
    this.setProject(project);
  }

  @Action()
  public async startAgentAnalysis() {
    this.setAgentProgress('project');
    try {
      await this.api.runAgentAnalysis(this.fileInfo?.path);
    }
    catch (error) {
      this.showError(`Oops! Something went wrong. Please try running the analysis again.: ${error}`);
    }
    finally {
      this.setAgentProgress(false);
      this.agentTagsProgress = [];
    }
  }

  @Action()
  public async stopAgentAnalysis() {
    await this.api.stopAgentAnalysis(this.fileInfo?.path);
    this.setAgentProgress(false);
    this.agentTagsProgress = [];
    this.endpointGoups.forEach(group => group.inProgress = false);
  }

  @Action()
  public setAgentProgress(type?: AgentProgressType | boolean) {
    this.agentProgress = type !== false ? type as AgentProgressType : undefined;
  }

  @Action()
  private async onAgentAnalysisEvent(event: { type: string, data: any }) {
    switch (event.type) {
      case 'project-setup': {
        await this.openProject(event.data);
        this.setAgentProgress('tags');

        break;
      }
      case 'spec-tags-updated': {
        this.agentTagsProgress = event.data.map((group: any, index: number) => ({
          name: group.tag,
          inProgress: index === 0,
          endpoints: []
        }));
        await this.reloadProject();
        this.setAgentProgress('endpoints');
        break;
      }
      case 'spec-tag-endpoints-completed': {
        const tagIndex = this.agentTagsProgress.findIndex(c => c.name === event.data);
        if (tagIndex !== -1) {
          const group = this.agentTagsProgress[tagIndex];
          group.inProgress = false;

          if (tagIndex + 1 < this.agentTagsProgress.length) {
            this.agentTagsProgress[tagIndex + 1].inProgress = true;
          }
        }

        await this.reloadProject();

        break;
      }
    }
  }

  @Action()
  public updatePrestartScript(code: string) {
    this.api.updatePrestartScript(this.fileInfo!.path, code);
  }

  @Action()
  public async reloadProject(fullSync?: boolean) {
    this.setProject(
      await this.api.openProject(this.fileInfo!.path, fullSync)
    );
  }

  @Action()
  public closeProject() {
    this.description = undefined;
    this.fileInfo = undefined;
    this.source = undefined;
    this.technologies = undefined;
    this.prestart = undefined;
    this.endpoints = [];
    this.endpointGoups = [];
    this.agentTagsProgress = [];
    this.agentProgress = undefined;

    this.app.setAppState({
      projectPath: undefined
    });
  }

  @Action()
  public showOpenApiSpec() {
    this.api.showOpenApiSpec(this.fileInfo!.path);
  }

  private async setProject(project: HttlProjectViewData): Promise<void> {
    this.app.setAppState({
      projectPath: project.fileInfo.path
    });

    this.fileInfo = project.fileInfo;
    this.description = project.description;
    this.source = project.source;
    this.technologies = project.technologies;
    this.prestart = project.prestart;
    this.endpoints = project.endpoints;

    const groupedEndpoints = project.endpoints.reduce((acc, endpoint) => {
      const group = acc.get(endpoint.tag) || {
        name: endpoint.tag,
        inProgress: false,
        endpoints: []
      };

      group.endpoints.push(endpoint);
      acc.set(endpoint.tag, group);

      return acc;
    }, new Map<string, ApiEndpointGroup>);

    this.agentTagsProgress.forEach((agentGroup) => {
      const tag = groupedEndpoints.get(agentGroup.name);
      if (tag) {
        tag.inProgress = agentGroup.inProgress;
      }
      else {
        groupedEndpoints.set(agentGroup.name, agentGroup);
      }
    });

    this.endpointGoups = [...groupedEndpoints.entries()]
      .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
      .map(([_, group]) => group);
  }
}

const [ProjectContext, useProjectModel] = connect(ProjectModel);

export { ProjectContext, useProjectModel };