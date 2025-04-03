import { Action, Model, connect } from "react-storm";
import { appRouter } from "./app.routes";

@Model()
export class AppModel {
  private static APP_STATE = 'app-state';

  private router = appRouter;

  public init() {
    vscode.postMessage({
      command: 'ready'
    });
  }

  public subscribeOnRouteChangedEvent() {
    this.router.subscribe(({ location }) => {
      this.saveState('view', location.pathname);
    });
  }

  public navigateMain(path?: string) {
    const route = path ? `/main/${path}` : '/main';
    this.router.navigate(route);
  }

  public navigateResponse(path: string) {
    this.router.navigate(`/response/show`);
  }

  public navigateNoRequestsYet() {
    this.router.navigate('/response/no-requests-yet');
  }

  public navigateDefault() {
    this.router.navigate('/' + appData.view);
  }

  public saveState(key: string, value: any, global = false) {
    (appData as any)[key] = value;
    vscode.postMessage({
      command: 'save-state',
      payload: {
        global,
        state: { key, value }
      }
    });
  }

  public getState(key: string) {
    return (appData as any)[key];
  }

  public getAppState(): AppState {
    return this.getState(AppModel.APP_STATE) ?? {} as AppState;
  }

  public setAppState(state: AppState) {
    return this.saveState(AppModel.APP_STATE, state);
  }

  @Action()
  public clearAppState() {
    for (const key in appData) {
      if (key !== 'baseUri' && key !== 'view') {
        delete (appData as any)[key];
      }
    }
    vscode.postMessage({
      command: 'clear-state',
    });
    this.goHome();
  }

  @Action()
  public goHome() {
    this.router.navigate('/');
  }
}

export interface AppState {
  projectPath?: string;
}

const [AppContext, useAppModel] = connect(AppModel);

export { AppContext, useAppModel };