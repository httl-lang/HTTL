import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { FindApiProjectsStepResult } from "../../../../ai/agents/steps/find-api-projects-step";
import { FindApiControllersStepResult } from "../../../../ai/agents/steps/find-api-controllers-step";
import { SetWorkspaceApiProjectsPayload, SetWorkspaceApiControllersPayload, SetWorkspaceApiControllerSpecPayload, SetWorkspaceApiErrorPayload } from "../../../../common";
import { ControllerSpec } from "../../../../ai/agents/api-workspace-agent";
import { MainApi } from "../main-api";


interface ApiControllers extends FindApiControllersStepResult {
  spec?: any;
  inProgress?: boolean;
}

interface ApiProject {
  name: string;
  path: string;
  technology: string;
}

@Model()
export class WorkspaceModel {
  public project?: ApiProject;//FindApiProjectsStepResult[] = [{ name: '@test/app', technology: 'NestJs', path: './app/src' }];
  public controllers: ApiControllers[] = [];

  public projectsProgress = false;
  public controllersProgress = false;

  public get hasControllers() {
    return this.controllers.length > 0;
  }

  public get inProgress() {
    return this.projectsProgress || this.controllersProgress || this.controllers.some(c => c.inProgress);
  }

  constructor(
    private readonly appModel = store(AppModel),
    private readonly api = new MainApi()
  ) { }

  public init() {
    // this.rawJwt = this.appModel.getState(WorkspaceModel.STORE_JWT_KEY) ?? '';
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

  public async resolveProjects(search: string): Promise<ApiProject[]> {
    // this.api.findProjects();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { name: '@test/app', technology: 'NestJs', path: './app/src' },
          { name: '@server/app', technology: 'NestJs', path: './server/app/src' }
        ]);
      }, 1000);
    })
    // return [{ name: '@test/app', technology: 'NestJs', path: './app/src' }];
  }

  @Action()
  public async selectProject(project: ApiProject): Promise<void> {
    // this.api.findProjects();
    this.project = project;
  }

  @Action()
  public startWorkspaceAnalyzing() {
    this.project = undefined;
    this.controllers = [];
    this.projectsProgress = true;
    this.controllersProgress = false;

    vscode.postMessage({
      command: 'start-workspace-analyzing',
      payload: '',
    });
  }

  @Action()
  public setWorkspaceApiProjects(data: FindApiProjectsStepResult[]) {
    this.projectsProgress = false;
    this.controllersProgress = true;

    // this.projects = data;
  }

  @Action()
  public setWorkspaceApiControllers(data: FindApiControllersStepResult[]) {
    this.projectsProgress = false;
    this.controllersProgress = false;

    this.controllers = data;
    this.controllers[0].inProgress = true;
  }

  @Action()
  public setWorkspaceApiControllerSpec(data: ControllerSpec) {
    const controllerIdx = this.controllers.findIndex(c => c.tag === data.tag);
    if (controllerIdx === -1)
      return;

    const controller = this.controllers[controllerIdx];
    controller.spec = data.spec;
    controller.inProgress = false;

    if (controllerIdx + 1 < this.controllers.length) {
      this.controllers[controllerIdx + 1].inProgress = true;
    }
  }

  @Action()
  public setError() {
    this.projectsProgress = false;
    this.controllersProgress = false;

    this.controllers = [];
  }
}

const [WorkspaceContext, useWorkspaceModel] = connect(WorkspaceModel);

export { WorkspaceContext, useWorkspaceModel };