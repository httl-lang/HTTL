import { Action, Model, connect, store } from "react-storm";

@Model()
export class QuickRunModel {
  public init() { }

  @Action()
  public run(script: string) {
    vscode.postMessage({
      command: 'run-script',
      payload: script,
    });
  }
}

const [QuickRunContext, useQuickRunModel] = connect(QuickRunModel);

export { QuickRunContext, useQuickRunModel };