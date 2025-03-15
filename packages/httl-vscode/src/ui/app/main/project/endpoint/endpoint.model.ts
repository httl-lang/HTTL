import { Action, Model, connect, store } from "react-storm";
import { ProjectApi } from "../project.api";
import { ApiEndpoint, ProjectModel } from "../project.model";


@Model()
export class EndpointModel {
  public endpoint!: ApiEndpoint;
  public inProgress = false;

  constructor(
    private readonly project = store(ProjectModel),
    private readonly api = new ProjectApi()
  ) { }

  public async init(endpoint: ApiEndpoint) {
    this.endpoint = endpoint;
  }

  public async update(endpoint: ApiEndpoint) {
    this.endpoint = endpoint;
  }

  @Action()
  public async runScript(scriptId: string, code?: string) {
    if (code !== undefined) {
      this.inProgress = true;

      if (code !== this.endpoint.defaultScript) {
        await this.updateScript(scriptId, code);
      }
    }
    await this.api.runScript(this.project.fileInfo!.path, scriptId);
    this.inProgress = false;
  }

  @Action()
  public showBodySchema(scriptId: string) {
    this.api.showBodySchema(this.project.fileInfo!.path, scriptId);
  }

  @Action()
  public showResponseSchema(scriptId: string) {
    this.api.showResponseSchema(this.project.fileInfo!.path, scriptId);
  }

  @Action()
  public updateScript(scriptId: string, code: string) {
    if (!this.endpoint.scripts?.length) {
      this.endpoint.scripts = [{
        id: scriptId,
        name: scriptId,
        code: ''
      }];
    }
    this.endpoint.scripts[0].code = code;
    return this.api.updateScript(this.project.fileInfo!.path, scriptId, code);
  }

  @Action()
  public async resetScript(scriptId: string) {
    this.endpoint.scripts = [];
    await this.api.resetScript(this.project.fileInfo!.path, scriptId);
    await this.generateRequest(scriptId);
  }

  @Action()
  public async generateRequest(scriptId: string) {
    const script = await this.api.generateRequestScript(this.project.fileInfo!.path, scriptId);
    this.endpoint.defaultScript = script;
  }
}

const [EndpointContext, useEndpointModel] = connect(EndpointModel);

export { EndpointContext, useEndpointModel };