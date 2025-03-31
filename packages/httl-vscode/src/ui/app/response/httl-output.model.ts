import { Action, Model, connect } from "react-storm";
import { HttlDiagnostic, HttpResponse } from "httl-core";
import { HttlOutputViewProps } from "./httl-output";

@Model()
export class HttlOutputModel {
  public responses: HttpResponse[] = [];
  public inProgress?: boolean;
  public errors: HttlDiagnostic[] = [];
  public currentResponseIndex = 0;

  public get currentResponse() {
    return this.responses[this.currentResponseIndex];
  }

  public init(viewData: HttlOutputViewProps) {
    this.refresh(viewData);
  }

  public update(viewData: HttlOutputViewProps) {
    this.refresh(viewData);
  }

  @Action()
  public selectResponse(index: number) {
    this.currentResponseIndex = index;
  }

  private refresh({ inProgress, output }: HttlOutputViewProps) {
    this.errors = [];
    this.responses = [];
    this.inProgress = inProgress;

    if (!output) {
      this.currentResponseIndex = 0;
      return;
    }

    this.errors = output.errors;
    this.responses = output.result || [];

    if (this.responses.length > 0) {
      this.currentResponseIndex = this.responses.length - 1;
    }

  }
}

const [HttlOutputContext, useHttlOutputModel] = connect(HttlOutputModel);

export { HttlOutputContext, useHttlOutputModel };