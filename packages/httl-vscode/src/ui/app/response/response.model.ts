import { Action, Model, connect, store } from "react-storm";
import { commutator } from "../../services/commutator";
import { HttlOutputViewProps } from "./httl-output";
import { AppModel } from "../app.model";

@Model()
export class ResponseModel {

  public viewData?: HttlOutputViewProps;

  public map = new Map<string, HttlOutputViewProps>();
  public currentFile?: string;

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    commutator.onSetProgress(({ file, payload: active }) => {
      this.currentFile = file;
      let viewData = this.map.get(file);
      viewData = { inProgress: active, output: viewData?.output };
      this.setViewData(viewData);
    });

    commutator.onChangeActiveEditor(({ file }) => {
      this.currentFile = file;
      const res = file ? this.map.get(file) : undefined;
      this.setViewData(res);
    });

    commutator.onSetResponse(({ payload, file }) => {
      this.currentFile = file;
      const viewData = { inProgress: false, output: payload };
      this.map.set(file, viewData);
      this.setViewData(viewData);
    });

    commutator.onCloseResponse(({ file }) => {
      this.map.delete(file);
    });
  }

  @Action()
  public setViewData(viewData?: HttlOutputViewProps) {
    this.viewData = viewData;
    if (!!viewData) {
      console.log('setViewData', viewData);
      this.appModel.navigateResponse(this.currentFile!);
    } else {
      this.appModel.navigateDefault();
    }
  }

  public highlightCode(source?: { start: number, end: number }, scroll = false) {
    if (this.currentFile?.includes('::')) {
      return;
    }

    vscode.postMessage({
      command: "code-highlight",
      file: this.currentFile,
      payload: source
    });

    if (scroll && source) {
      this.scrollToCode(source);
    }
  }

  public scrollToCode(source: { start: number, end: number }) {
    vscode.postMessage({
      command: "code-scroll",
      file: this.currentFile,
      payload: source
    });
  }
}

const [ResponseContext, useResponseModel] = connect(ResponseModel);

export { ResponseContext, useResponseModel };