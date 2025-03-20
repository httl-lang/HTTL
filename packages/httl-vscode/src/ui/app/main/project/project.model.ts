import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { AgentAnalysisEventPayload } from "../../../../common";
import { ProjectApi } from "./project.api";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData } from "../../../../client/views/main/services/project";

interface ApiEndpointGroup {
  name: string;
  inProgress: boolean;
  endpoints: ApiEndpoint[];
}

export interface ApiEndpoint extends HttlProjectApiEndpoint {
  defaultScript?: string;
}

interface ProjectState {
  projectPath?: string;
  prestartEditorHeight: string;
}

type AgentProgressType = 'project' | 'tags' | 'endpoints' | 'error';

@Model()
export class ProjectModel {
  public static readonly PROJECT_STATE = 'project-state';

  private agentTagsProgress: ApiEndpointGroup[] = [];
  public agentProgress?: AgentProgressType;

  public fileInfo?: HttlProjectFileInfo;
  public description?: string;
  public source?: string;
  public technologies?: string[];
  public prestart?: string;
  public endpoints: ApiEndpoint[] = [];
  public endpointGoups: ApiEndpointGroup[] = [];

  public declare projectState: ProjectState;

  constructor(
    private readonly appModel = store(AppModel),
    private readonly api = new ProjectApi()
  ) { }

  public async init() {
    this.projectState = this.appModel.getState(ProjectModel.PROJECT_STATE) ?? {
      prestartEditorHeight: '100px'
    };

    if (this.projectState.projectPath) {
      this.setProject(
        await this.api.openProject(this.projectState.projectPath)
      );
    }

    commutator.onAgentAnalysisEvent((result: AgentAnalysisEventPayload) => {
      this.onAgentAnalysisEvent(result.payload);
    });
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
    const projectLoader =
      'path' in projectItem
        ? this.api.openProject(projectItem.path)
        : this.api.importFromOpenApiSpec(projectItem.specUrl);

    const project = await projectLoader;

    this.setProjectState({
      projectPath: project.fileInfo.path
    });

    this.setProject(project);
  }

  @Action()
  public async openProject(filePath: string): Promise<void> {
    const project = await this.api.openProject(filePath);

    this.setProjectState({
      projectPath: project.fileInfo.path
    });

    this.setProject(project);
  }

  @Action()
  public async startAgentAnalysis() {
    this.setAgentProgress('project');
    try {
      await this.api.runAgentAnalysis(this.fileInfo?.path);
      this.setAgentProgress(false);
      this.agentTagsProgress = [];
    }
    catch (error) {
      this.setAgentProgress('error');
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
  public setProjectState(state: Partial<ProjectState>) {
    this.projectState = {
      ...this.projectState,
      ...state
    };

    this.appModel.saveState(ProjectModel.PROJECT_STATE, this.projectState);
  }

  @Action()
  public async reloadProject() {
    this.setProject(
      await this.api.openProject(this.fileInfo!.path)
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

    this.setProjectState({
      projectPath: undefined
    });
  }

  @Action()
  public showOpenApiSpec() {
    this.api.showOpenApiSpec(this.fileInfo!.path);
  }

  private async setProject(project: HttlProjectViewData): Promise<void> {
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