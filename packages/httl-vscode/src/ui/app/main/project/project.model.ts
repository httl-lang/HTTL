import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { FindApiProjectsStepResult } from "../../../../ai/agents/steps/find-api-projects-step";
import { FindApiControllersStepResult } from "../../../../ai/agents/steps/find-api-controllers-step";
import { SetWorkspaceApiProjectsPayload, SetWorkspaceApiControllersPayload, SetWorkspaceApiControllerSpecPayload, SetWorkspaceApiErrorPayload } from "../../../../common";
import { ControllerSpec } from "../../../../ai/agents/api-workspace-agent";
import { ProjectApi } from "./project.api";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData } from "../../../../client/services/project";

interface ApiEndpointGroup {
  name: string;
  inProgress: boolean;
  endpoints: HttlProjectApiEndpoint[];
}

interface ProjectUIState {
  projectPath?: string;
}

@Model()
export class ProjectModel {

  public static readonly UI_STATE = 'project-ui-state';

  public fileInfo?: HttlProjectFileInfo;
  public description?: string;
  public source?: string;
  public technologies?: string[];
  public prestart?: string;
  public endpoints: HttlProjectApiEndpoint[] = [];

  public endpointGoups: ApiEndpointGroup[] = [];

  public defaultHeight = 100;

  public declare uiState: ProjectUIState;

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
    this.uiState = this.appModel.getState(ProjectModel.UI_STATE) ?? {

    };

    if (this.uiState.projectPath) {
      this.setProject(
        await this.api.openProject(this.uiState.projectPath)
      );
    }

    commutator.onSetWorkspaceApiProjects((result: SetWorkspaceApiProjectsPayload) => {
      this.setWorkspaceApiProjects(result.payload);
    });

    commutator.onSetWorkspaceApiControllers((result: SetWorkspaceApiControllersPayload) => {
      this.setWorkspaceApiControllers(result.payload);
    });

    commutator.onSetWorkspaceApiControllerSpec((result: SetWorkspaceApiControllerSpecPayload) => {
      this.setWorkspaceApiControllerSpec(result.payload);
    });

    commutator.onSetWorkspaceApiError((result: SetWorkspaceApiErrorPayload) => {
      this.setError();
    });
  }

  public resolveProjects(search: string): Promise<HttlProjectItem[]> {
    return this.api.resolveProjects(search);
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

  @Action()
  public async selectProject(projectItem: HttlProjectItem): Promise<void> {
    const projectLoader =
      'path' in projectItem
        ? this.api.openProject(projectItem.path)
        : this.api.importFromOpenApiSpec(projectItem.specUrl);

    const project = await projectLoader;

    this.appModel.saveState(ProjectModel.UI_STATE, {
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

  @Action()
  public setWorkspaceApiProjects(data: FindApiProjectsStepResult[]) {
    // this.projectsProgress = false;
    // this.controllersProgress = true;

    // this.projects = data;
  }

  @Action()
  public setWorkspaceApiControllers(data: FindApiControllersStepResult[]) {
    // this.projectsProgress = false;
    // this.controllersProgress = false;

    // this.controllers = data;
    // this.controllers[0].inProgress = true;
  }

  @Action()
  public setWorkspaceApiControllerSpec(data: ControllerSpec) {
    // const controllerIdx = this.controllers.findIndex(c => c.tag === data.tag);
    // if (controllerIdx === -1)
    //   return;

    // const controller = this.controllers[controllerIdx];
    // controller.spec = data.spec;
    // controller.inProgress = false;

    // if (controllerIdx + 1 < this.controllers.length) {
    //   this.controllers[controllerIdx + 1].inProgress = true;
    // }
  }

  @Action()
  public setError() {
    // this.projectsProgress = false;
    // this.controllersProgress = false;

    // this.controllers = [];
  }

  @Action()
  public runScript(scriptId: string, code?: string) {
    if (code) {
      this.endpoints.find(e => e.id === scriptId)!.scripts[0].code = code;
    }
    this.api.runScript(this.fileInfo!.path, scriptId, code);
  }

  @Action()
  public updateScript(scriptId: string, code: string) {
    const endpoint = this.endpoints.find(e => e.id === scriptId)!;
    if (!endpoint?.scripts?.length) {
      endpoint.scripts = [{
        id: scriptId,
        name: scriptId,
        code: ''
      }];
    }

    endpoint.scripts[0].code = code;
    this.api.updateScript(this.fileInfo!.path, scriptId, code);
  }

  @Action()
  public updatePrestartScript(code: string) {
    this.api.updateScript(this.fileInfo!.path, null, code);
  }
}

const [ProjectContext, useProjectModel] = connect(ProjectModel);

export { ProjectContext, useProjectModel };