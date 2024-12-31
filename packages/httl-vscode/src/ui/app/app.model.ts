import { Model, connect } from "react-storm";
import { appRouter } from "./app.routes";

@Model()
export class AppModel {
  private router = appRouter;

  public init() { }

  public displayResponse(path: string) {
    this.router.navigate(`/response/show`);
  }

  public displayDefault() {
    this.router.navigate('/' + appData.view);
  }
}

const [AppContext, useAppModel] = connect(AppModel);

export { AppContext, useAppModel };