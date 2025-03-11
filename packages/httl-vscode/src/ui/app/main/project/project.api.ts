import { HttlProjectItem, HttlProjectFileInfo, HttlProjectViewData } from "../../../../client/services/project";
import { Api } from "../../../services/api";

export class ProjectApi extends Api {

  public resolveProjects(search: string): Promise<HttlProjectItem[]> {
    return this.sendRequest('resolveProjects', { search });
  }

  public openProject(path: string): Promise<HttlProjectViewData> {
    return this.sendRequest('openProject', { path });
  }

  public importFromOpenApiSpec(url: string): Promise<HttlProjectViewData> {
    return this.sendRequest('importFromOpenApiSpec', { url });
  }

  public runScript(project: string, script: string): Promise<void> {
    return this.sendRequest('runScript', { project, script });
  }
}