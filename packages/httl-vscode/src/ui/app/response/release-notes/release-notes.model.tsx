import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
// import { version } from "../../../../../package.json";

@Model()
export class ReleaseNotesModel {
  private static readonly LAST_RELEASE = 'news-last-release';

  public show = false;
  public lastRelease = '';
  public currentVersion = '0.1.9'; //version; // TOOD: temporary hardcoded version

  constructor(
    private readonly appModel = store(AppModel)
  ) { }

  public init() {
    this.lastRelease = this.appModel.getState(ReleaseNotesModel.LAST_RELEASE);
    const lastReleaseParts = (this.lastRelease || '0.0.0').split('.');
    const currentVersionParts = this.currentVersion.split('.');

    for (let i = 0; i < currentVersionParts.length; i++) {
      if (currentVersionParts[i] > lastReleaseParts[i]) {
        this.show = true;
        break;
      }
    }
  }

  @Action()
  public aknowledgeReleaseNote() {
    this.lastRelease = this.currentVersion;
    this.appModel.saveState(ReleaseNotesModel.LAST_RELEASE, this.lastRelease, true);
    this.show = false;
  }
}

const [ReleaseNotesContext, useReleaseNotesModel] = connect(ReleaseNotesModel);

export { ReleaseNotesContext, useReleaseNotesModel };