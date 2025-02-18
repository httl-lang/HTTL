import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../app.model";
import { version } from "../../../../package.json";

@Model()
export class NewsModel {
  private static readonly LAST_RELEASE = 'news-last-release';

  public show = false;
  public lastRelease = '';

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.lastRelease = this.appModel.getState(NewsModel.LAST_RELEASE);
    this.show = this.lastRelease !== version;
  }

  @Action()
  public aknowledgeReleaseNote() {
    this.lastRelease = version;
    this.appModel.saveState(NewsModel.LAST_RELEASE, this.lastRelease, true);
    this.show = false;
  }
}

const [NewsContext, useNewsModel] = connect(NewsModel);

export { NewsContext, useNewsModel };