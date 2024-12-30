import { Action, Model, connect, store } from "react-storm";
import { HttpResponse } from "httl-core";
import { HttlResponseListProps } from "./httl-response-list";
import { HttlOutputModel } from "./httl-output.model";
import { AppModel } from "./app.model";



export interface ResponseItem {
  key: number;
  method: string;
  url: string;
  active: boolean;
  source?: { start: number, end: number, line: number };
}

@Model()
export class HttlResponseListModel {
  public requestListExpanded = false;
  public responses: HttpResponse[] = [];

  public currentResponseIndex = 0;

  public get currentResponse() {
    return this.responses[this.currentResponseIndex];
  }

  public get responseItems(): ResponseItem[] {
    return this.responses.map((response, index) => ({
      key: index,
      method: response.req.method,
      url: response.req.url,
      source: response.source,
      active: index === this.currentResponseIndex,
    }));
  };

  public get multipleResponses() {
    return this.responses?.length > 1;
  }

  constructor(
    private readonly httlOutputModel = store(HttlOutputModel),
    private readonly appModel = store(AppModel)
  ) { }

  public init({ responses }: HttlResponseListProps) {
    this.refresh(responses);
  }

  public update({ responses }: HttlResponseListProps) {
    this.refresh(responses);
  }

  @Action()
  public selectResponse(index: number) {
    this.currentResponseIndex = index;
    this.httlOutputModel.selectResponse(index);
    this.requestListExpanded = false;
    this.highlightCode(index, true);
  }

  public highlightCode(index?: number, scroll = false) {
    const currentIndex = index ?? this.currentResponseIndex;
    const source = this.responses?.[currentIndex]?.source;
    if (source) {
      this.appModel.highlightCode(source, scroll);
    }
  }

  @Action()
  public setExpanded(expanded: boolean) {
    this.requestListExpanded = expanded;
  }

  private refresh(responses: HttpResponse[]) {
    this.responses = responses;
    if (this.responses.length > 0) {
      this.currentResponseIndex = this.responses.length - 1;
    }
  }
}

const [HttlResponseListContext, useHttlResponseListModel] = connect(HttlResponseListModel);

export { HttlResponseListContext, useHttlResponseListModel };