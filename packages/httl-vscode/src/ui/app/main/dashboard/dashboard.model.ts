import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";

@Model()
export class DashboardModel {
  public data?: any;
  public inProgress = false;

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    // this.rawJwt = this.appModel.getState(DashboardModel.STORE_JWT_KEY) ?? '';
    commutator.onRunLmResult((result: any) => {
      this.setResult(result);
    });
  }

  @Action()
  public run() {
    this.inProgress = true;
    vscode.postMessage({
      command: 'run-api-spec-gen',
      payload: '',
    });
  }

  @Action()
  public setResult(data: any) {
    this.inProgress = false;
    this.data = data.payload;
  }
}

const [DashboardContext, useDashboardModel] = connect(DashboardModel);

export { DashboardContext, useDashboardModel };