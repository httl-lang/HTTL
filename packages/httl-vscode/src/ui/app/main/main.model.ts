import { Model, connect, store } from "react-storm";
import { AppModel } from "../app.model";

@Model()
export class MainModel {

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.appModel.subscribeOnRouteChangedEvent();
  }
}

const [MainContext, useMainModel] = connect(MainModel);

export { MainContext, useMainModel };