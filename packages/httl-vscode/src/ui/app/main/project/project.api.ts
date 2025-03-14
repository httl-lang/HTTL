import {
  HttlProjectItem,
  HttlProjectViewData,
  EndpointScriptId,
  UpdateEndpointScriptCode,
  UpdatePrestartScriptCode
} from "../../../../client/services/project";
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

  public runScript(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('runScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public updateScript(projectFile: string, scriptId: string, code: string): Promise<void> {
    return this.sendRequest('updateScript', { projectFile, scriptId, code } satisfies UpdateEndpointScriptCode);
  }

  public updatePrestartScript(projectFile: string, code: string): Promise<void> {
    return this.sendRequest('updatePrestartScript', { projectFile, code } satisfies UpdatePrestartScriptCode);
  }

  public resetScript(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('resetScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public generateRequestScript(projectFile: string, scriptId: string): Promise<string> {
    return this.sendRequest('generateRequestScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public showBodySchema(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('showBodySchema', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public showResponseSchema(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('showResponseSchema', { projectFile, scriptId } satisfies EndpointScriptId);
  }
}