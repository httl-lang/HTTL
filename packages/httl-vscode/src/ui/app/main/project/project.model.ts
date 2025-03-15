import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { FindApiProjectsStepResult } from "../../../../ai/agents/steps/find-api-projects-step";
import { FindApiControllersStepResult } from "../../../../ai/agents/steps/find-api-controllers-step";
import { SetWorkspaceApiProjectsPayload, SetWorkspaceApiControllersPayload, SetWorkspaceApiControllerSpecPayload, SetWorkspaceApiErrorPayload } from "../../../../common";
import { ControllerSpec } from "../../../../ai/agents/api-workspace-agent";
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

@Model()
export class ProjectModel {

  public static readonly PROJECT_STATE = 'project-state';

  public fileInfo?: HttlProjectFileInfo;
  public description?: string;
  public source?: string;
  public technologies?: string[];
  public prestart?: string;
  public endpoints: ApiEndpoint[] = [];

  public endpointGoups: ApiEndpointGroup[] = [];

  public declare projectState: ProjectState;

  // public controllers: ApiControllers[] = [];

  // public projectsProgress = false;
  // public controllersProgress = false;

  // public get hasControllers() {
  //   return this.controllers.length > 0;
  // }

  // public get inProgress() {
  //   return this.projectsProgress || this.controllersProgress || this.controllers.some(c => c.inProgress);
  // }

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

    // commutator.onSetWorkspaceApiProjects((result: SetWorkspaceApiProjectsPayload) => {
    //   this.setWorkspaceApiProjects(result.payload);
    // });

    // commutator.onSetWorkspaceApiControllers((result: SetWorkspaceApiControllersPayload) => {
    //   this.setWorkspaceApiControllers(result.payload);
    // });

    // commutator.onSetWorkspaceApiControllerSpec((result: SetWorkspaceApiControllerSpecPayload) => {
    //   this.setWorkspaceApiControllerSpec(result.payload);
    // });

    // commutator.onSetWorkspaceApiError((result: SetWorkspaceApiErrorPayload) => {
    //   this.setError();
    // });
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

  // @Action()
  // public startWorkspaceAnalyzing() {
  //   this.project = undefined;
  //   this.controllers = [];
  //   this.projectsProgress = true;
  //   this.controllersProgress = false;

  //   vscode.postMessage({
  //     command: 'start-workspace-analyzing',
  //     payload: '',
  //   });
  // }

  // @Action()
  // public setWorkspaceApiProjects(data: FindApiProjectsStepResult[]) {
  //   // this.projectsProgress = false;
  //   // this.controllersProgress = true;

  //   // this.projects = data;
  // }

  // @Action()
  // public setWorkspaceApiControllers(data: FindApiControllersStepResult[]) {
  //   // this.projectsProgress = false;
  //   // this.controllersProgress = false;

  //   // this.controllers = data;
  //   // this.controllers[0].inProgress = true;
  // }

  // @Action()
  // public setWorkspaceApiControllerSpec(data: ControllerSpec) {
  //   // const controllerIdx = this.controllers.findIndex(c => c.tag === data.tag);
  //   // if (controllerIdx === -1)
  //   //   return;

  //   // const controller = this.controllers[controllerIdx];
  //   // controller.spec = data.spec;
  //   // controller.inProgress = false;

  //   // if (controllerIdx + 1 < this.controllers.length) {
  //   //   this.controllers[controllerIdx + 1].inProgress = true;
  //   // }
  // }

  // @Action()
  // public setError() {
  //   // this.projectsProgress = false;
  //   // this.controllersProgress = false;

  //   // this.controllers = [];
  // }

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


    this.endpointGoups = groupedEndpoints.entries().toArray()
      .sort(([tagA], [tagB]) => tagA.localeCompare(tagB))
      .map(([_, group]) => group);
  }
}

const [ProjectContext, useProjectModel] = connect(ProjectModel);

export { ProjectContext, useProjectModel };