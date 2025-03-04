import { Action, Model, connect, store } from "react-storm";
import jwt from 'jsonwebtoken';
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";

@Model()
export class RuntimerModel {
  // private static readonly STORE_JWT_KEY = 'utils-jwt-decode';

  public data?: any;

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    // this.rawJwt = this.appModel.getState(RuntimerModel.STORE_JWT_KEY) ?? '';
    commutator.onRunLmResult((result: any) => {
      this.setResult(result);
    });
  }

  @Action()
  public run() {
    vscode.postMessage({
      command: 'run-lm',
      payload: '',
    });
  }

  @Action()
  public setResult(data: any) {
    this.data = data.payload;
  }
}

const [RuntimerContext, useRuntimerModel] = connect(RuntimerModel);

export { RuntimerContext, useRuntimerModel };