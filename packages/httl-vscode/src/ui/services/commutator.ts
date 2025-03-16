import {
  SetProgressMessagePayload,
  SetResponsePayload,
  UIMessage,
  UIMessageType,
  ChangeActiveEditorMessagePayload,
  CloseResponseMessagePayload,
  SetWorkspaceApiControllersPayload,
  SetWorkspaceApiProjectsPayload,
  SetWorkspaceApiControllerSpecPayload,
  SetWorkspaceApiErrorPayload,
  HighlightViewSectionMessagePayload,
  ReloadProjectMessagePayload

} from "../../common";

export class Commutator {
  public static isUserCommand(data: any) {
    return data?.command === 'set-progress' || data?.command === 'change-active-editor' || data?.command === 'set-response';
  }

  public static createInstance() {
    const commutator = new Commutator();

    window.addEventListener('message', (event) => {
      console.log('message', event.data);

      const message = event.data as UIMessage;
      commutator.trigger(message);
    }, false);

    return commutator;
  }

  private subscribers = new Map<UIMessageType, Array<(...args: any[]) => void>>();

  public onSetProgress(cb: (message: SetProgressMessagePayload) => void) {
    this.subscribe('set-progress', cb);
  }

  public onChangeActiveEditor(cb: (message: ChangeActiveEditorMessagePayload) => void) {
    this.subscribe('change-active-editor', cb);
  }

  public onCloseResponse(cb: (message: CloseResponseMessagePayload) => void) {
    this.subscribe('close-response', cb);
  }

  public onSetResponse(cb: (message: SetResponsePayload) => void) {
    this.subscribe('set-response', cb);
  }

  public onHighlightSection(cb: (message: HighlightViewSectionMessagePayload) => void) {
    this.subscribe('highlight-section', cb);
  }

  public onReloadProject(cb: (message: ReloadProjectMessagePayload) => void) {
    this.subscribe('reload-project', cb);
  }

  public onSetWorkspaceApiProjects(cb: (message: SetWorkspaceApiProjectsPayload) => void) {
    this.subscribe('set-workspace-api-projects', cb);
  }

  public onSetWorkspaceApiControllers(cb: (message: SetWorkspaceApiControllersPayload) => void) {
    this.subscribe('set-workspace-api-controllers', cb);
  }

  public onSetWorkspaceApiControllerSpec(cb: (message: SetWorkspaceApiControllerSpecPayload) => void) {
    this.subscribe('set-workspace-api-controller-spec', cb);
  }

  public onSetWorkspaceApiError(cb: (message: SetWorkspaceApiErrorPayload) => void) {
    this.subscribe('set-workspace-api-error', cb);
  }

  private subscribe(command: UIMessageType, cb: (...args: any[]) => void) {
    const calls = this.subscribers.get(command) || [];
    calls.push(cb);
    this.subscribers.set(command, calls);
  }

  private trigger(message: UIMessage) {
    const { command, ...args } = message;
    const calls = this.subscribers.get(command) || [];
    calls.forEach(cb => {
      try {
        cb(args);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

export const commutator = Commutator.createInstance();
