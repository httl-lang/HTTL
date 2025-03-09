import { HttlProjectItem } from "../../../../client/services/project";
import { Api } from "../../../services/api";

export class ProjectApi extends Api {

  public resolveProjects(search: string): Promise<HttlProjectItem[]> {
    return this.sendRequest('resolveProjects', { search });
  }

  public openProject(path: string): Promise<any> {
    return this.sendRequest('openProject', { path });
  }

  public importFromOpenApiSpec(url: string): Promise<any> {
    return this.sendRequest('importFromOpenApiSpec', { url });
  }
}