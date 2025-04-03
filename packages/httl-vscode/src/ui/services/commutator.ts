import {
  SetProgressMessagePayload,
  SetResponsePayload,
  UIMessage,
  UIMessageType,
  ChangeActiveEditorMessagePayload,
  CloseResponseMessagePayload,
  AgentAnalysisEventPayload,
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

  public onAgentAnalysisEvent(cb: (message: AgentAnalysisEventPayload) => void) {
    this.subscribe('agent-analysis-event', cb);
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
