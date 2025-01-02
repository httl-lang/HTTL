import { Model, connect } from "react-storm";
import { appRouter } from "./app.routes";

@Model()
export class AppModel {
  private router = appRouter;

  public init() { 
    this.router.subscribe(({ location }) => {
      this.saveState('view', location.pathname);
    });
  }

  public navigateMain(path: string) {
    this.router.navigate(`/main/${path}`);
  }

  public navigateResponse(path: string) {
    this.router.navigate(`/response/show`);
  }

  public navigateDefault() {
    this.router.navigate('/' + appData.view);
  }

  public saveState(key: string, value: any, global = false) {
    vscode.postMessage({
      command: 'save-state',
      payload: {
        global,
        state: { key, value }
      }
    });
  }
}

const [AppContext, useAppModel] = connect(AppModel);

export { AppContext, useAppModel };