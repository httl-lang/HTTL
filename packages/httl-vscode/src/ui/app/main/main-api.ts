import { Api } from "../../services/api";

export class MainApi extends Api {

  public findProjects(dir: string) {
    this.sendRequest('find-projects', { dir });
  }
}