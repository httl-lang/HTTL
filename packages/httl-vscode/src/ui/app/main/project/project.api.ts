import { HttlProjectItem, HttlProjectFileInfo, HttlProjectViewData, EndpointScriptCode } from "../../../../client/services/project";
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

  public runScript(projectFile: string, scriptId: string, code?: string): Promise<void> {
    return this.sendRequest('runScript', { projectFile, scriptId, code } satisfies EndpointScriptCode);
  }

  public updateScript(projectFile: string, scriptId: string | null, code: string): Promise<void> {
    return this.sendRequest('updateScript', { projectFile, scriptId, code } satisfies EndpointScriptCode);
  }
}