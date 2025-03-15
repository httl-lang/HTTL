import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
import { commutator } from "../../../services/commutator";
import { QuickRunApi } from "./quick-run.api";

@Model()
export class QuickRunModel {
  private static readonly STORE_SCRIPT_KEY = 'quick-run-script';
  private static readonly STORE_SIZE_KEY = 'quick-run-size';

  public script =
    `# Uncomment and press F5 or Ctrl|CMD+Enter to run the script
# @base: https://jsonplaceholder.typicode.com
# get /todos/1`;

  public size = "100px";
  public inProgress = false;

  constructor(
    private readonly appModel = store(AppModel),
    private readonly api = new QuickRunApi()
  ) { }

  public init() {
    this.script = this.appModel.getState(QuickRunModel.STORE_SCRIPT_KEY) ?? this.script;
    this.size = this.appModel.getState(QuickRunModel.STORE_SIZE_KEY) ?? "100px";
    commutator.onSetResponse(({ payload, file }) => {
      if (file === "quick-run-document") {
        // this.setProgress(false);
      }
    });
  }

  @Action()
  public setScript(script: string) {
    this.script = script;
    this.appModel.saveState(QuickRunModel.STORE_SCRIPT_KEY, script);
  }

  @Action()
  public saveSize(size: string) {
    this.size = size;
    this.appModel.saveState(QuickRunModel.STORE_SIZE_KEY, size);
  }

  @Action()
  public async run(script?: string) {
    if (script) {
      this.inProgress = true;
      this.setScript(script);
    } else {
      script = this.script;
    }
    await this.api.runScript(script);
    this.inProgress = false;
  }

  @Action()
  public setFocus() {
    vscode.postMessage({
      command: 'set-focus',
    });
  }
}

const [QuickRunContext, useQuickRunModel] = connect(QuickRunModel);

export { QuickRunContext, useQuickRunModel };