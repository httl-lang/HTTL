import {
  HttlProjectItem,
  HttlProjectViewData,
  EndpointScriptId,
  UpdateEndpointScriptCode,
  UpdatePrestartScriptCode
} from "../../../../client/views/main/services/project";
import { Api } from "../../../services/api";

export class ProjectApi extends Api {

  public resolveProjects(search: string): Promise<HttlProjectItem[]> {
    return this.sendRequest('project.resolveProjects', { search });
  }

  public openProject(path: string): Promise<HttlProjectViewData> {
    return this.sendRequest('project.openProject', { path });
  }

  public importFromOpenApiSpec(url: string): Promise<HttlProjectViewData> {
    return this.sendRequest('project.importFromOpenApiSpec', { url });
  }

  public runScript(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('project.runScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public updateScript(projectFile: string, scriptId: string, code: string): Promise<void> {
    return this.sendRequest('project.updateScript', { projectFile, scriptId, code } satisfies UpdateEndpointScriptCode);
  }

  public updatePrestartScript(projectFile: string, code: string): Promise<void> {
    return this.sendRequest('project.updatePrestartScript', { projectFile, code } satisfies UpdatePrestartScriptCode);
  }

  public resetScript(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('project.resetScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public generateRequestScript(projectFile: string, scriptId: string): Promise<string> {
    return this.sendRequest('project.generateRequestScript', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public showBodySchema(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('project.showBodySchema', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public showResponseSchema(projectFile: string, scriptId: string): Promise<void> {
    return this.sendRequest('project.showResponseSchema', { projectFile, scriptId } satisfies EndpointScriptId);
  }

  public showOpenApiSpec(projectFile: string) {
    return this.sendRequest('project.showOpenApiSpec', { projectFile });
  }

  public runAgentAnalysis(projectFile?: string): Promise<void> {
    return this.sendRequest('project.runAgentAnalysis', { projectFile });
  }

  public stopAgentAnalysis(projectFile?: string): Promise<void> {
    return this.sendRequest('project.stopAgentAnalysis', { projectFile });
  }
}