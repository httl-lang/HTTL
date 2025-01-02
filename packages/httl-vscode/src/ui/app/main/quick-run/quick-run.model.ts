import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";

@Model()
export class QuickRunModel {
  private static readonly STORE_SCRIPT_KEY = 'quick-run-script';

  public script =
    `# Uncomment and press F5 or Ctrl|CMD+Enter to run the script
# get https://jsonplaceholder.typicode.com/todos/1`;

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.script = (appData as any)[QuickRunModel.STORE_SCRIPT_KEY] ?? this.script;
  }

  @Action()
  public setScript(script: string) {
    this.script = script;
    this.appModel.saveState(QuickRunModel.STORE_SCRIPT_KEY, script);
  }

  @Action()
  public run(script: string) {
    this.setScript(script);
    vscode.postMessage({
      command: 'run-script',
      payload: script,
    });
  }
}

const [QuickRunContext, useQuickRunModel] = connect(QuickRunModel);

export { QuickRunContext, useQuickRunModel };