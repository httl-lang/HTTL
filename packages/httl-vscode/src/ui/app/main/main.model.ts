import { Model, connect, store } from "react-storm";
import { AppModel } from "../app.model";
import { commutator } from "../../services/commutator";

@Model()
export class MainModel {

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.appModel.subscribeOnRouteChangedEvent();

    commutator.onHighlightSection(({ payload }) => {
      const path = payload.panel === 'project'
        ? `${payload.panel}?project=${payload.paths[0]}&scriptId=${payload.paths[1]}&random=${Math.random()}`
        : payload.panel;

      this.appModel.navigateMain(path);
    });
  }
}

const [MainContext, useMainModel] = connect(MainModel);

export { MainContext, useMainModel };