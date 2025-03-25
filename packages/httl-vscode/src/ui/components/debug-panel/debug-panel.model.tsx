import { Action, Model, connect, store } from "react-storm";

import { AppModel } from "../../app/app.model";

@Model()
export class DebugPanelModel {

  constructor(
    private readonly app = store(AppModel)
  ) { }

  public init() {
  }

  @Action()
  public clearAppState() {
    this.app.clearAppState();
  }
}

const [DebugPanelContext, useDebugPanelModel] = connect(DebugPanelModel);

export { DebugPanelContext, useDebugPanelModel };