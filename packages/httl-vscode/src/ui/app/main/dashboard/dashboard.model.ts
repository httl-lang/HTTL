import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { FindApiProjectsStepResult } from "../../../../ai/agents/steps/find-api-projects-step";
import { FindApiControllersStepResult } from "../../../../ai/agents/steps/find-api-controllers-step";
import { SetWorkspaceApiProjectsPayload, SetWorkspaceApiControllersPayload, SetWorkspaceApiControllerSpecPayload, SetWorkspaceApiErrorPayload } from "../../../../common";
import { ControllerSpec } from "../../../../ai/agents/api-workspace-agent";


interface ApiControllers extends FindApiControllersStepResult {
  spec?: any;
  inProgress?: boolean;
}

@Model()
export class DashboardModel {
  public projects: FindApiProjectsStepResult[] = [];
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
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    // this.rawJwt = this.appModel.getState(DashboardModel.STORE_JWT_KEY) ?? '';
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

  @Action()
  public startWorkspaceAnalyzing() {
    this.projects = [];
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

    this.projects = data;
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

const [DashboardContext, useDashboardModel] = connect(DashboardModel);

export { DashboardContext, useDashboardModel };