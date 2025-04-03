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
        ? `${payload.panel}?scriptId=${payload.paths[1]}&scriptId_random=${Math.random()}`
        : payload.panel;

      this.appModel.navigateMain(path);
    });

    commutator.onReloadProject(({ file }) => {
      this.appModel.navigateMain(`project?project=${file}&project_random=${Math.random()}`);
    });
  }
}

const [MainContext, useMainModel] = connect(MainModel);

export { MainContext, useMainModel };