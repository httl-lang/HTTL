import { Action, Model, connect, store } from "react-storm";
import { ProjectApi } from "../project.api";
import { ApiEndpoint, ProjectModel } from "../project.model";
import { debounce } from "../../../../utils/misc";

@Model()
export class EndpointModel {
  private readonly debouncedUpdateScript;

  public endpoint!: ApiEndpoint;
  public inProgress = false;
  public expanded = false;
  public height = '70px';
  public focused = false;

  constructor(
    private readonly project = store(ProjectModel),
    private readonly api = new ProjectApi(),
  ) {
    this.debouncedUpdateScript = debounce(this.api.updateScript.bind(this.api), 2000);
  }

  public async init(endpoint: ApiEndpoint) {
    this.endpoint = endpoint;

    const state = this.project.projectState?.endpoints[endpoint.endpointId] || {};

    this.expanded = state.expanded || false;
    this.height = state.height || '70px';
    this.focused = this.project.sessionState?.focusedEndpoint === endpoint.endpointId;
    // TODO: temporary fix for focused endpoint
    this.project.focusedEndpoint = this.focused ? this : this.project.focusedEndpoint;

    if (this.expanded && !this.endpoint.scripts.length) {
      this.generateRequest(this.endpoint.endpointId);
    }
  }

  public async update(endpoint: ApiEndpoint) {
    await this.init(endpoint);
  }

  @Action()
  public async runScript(scriptId: string, code?: string) {
    const currentScriptCode = this.endpoint.scripts?.[0]?.code;
    this.inProgress = true;
    if (code !== undefined && code !== this.endpoint.defaultScript) {
      await this.updateScript(scriptId, code, true);
    } else if (currentScriptCode !== undefined) {
      this.debouncedUpdateScript.cancel();
      await this.updateScript(scriptId, currentScriptCode, true);
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
  public onFocus() {
    this.project.setFocusedEndpoint(this);
    vscode.postMessage({
      command: 'set-focus',
      file: `project::${this.project.fileInfo!.path}::${this.endpoint.endpointId}` // TODO: move to common place
    });
  }

  @Action()
  public focus() {
    this.focused = true;
  }

  @Action()
  public blur() {
    this.focused = false;
  }

  @Action()
  public async toggleExpand() {
    this.setExpand(!this.expanded);
  }

  @Action()
  public async setExpand(expanded: boolean) {
    if (this.expanded === expanded) {
      return;
    }

    this.expanded = expanded;

    this.project.updateState({
      endpoints: {
        [this.endpoint.endpointId]: {
          expanded: this.expanded
        }
      }
    });

    if (this.expanded && !this.endpoint.scripts.length) {
      // setEditorBusy(true);
      await this.generateRequest(this.endpoint.endpointId);
      // setEditorBusy(false);
    }
  }

  @Action()
  public setHeight(height: string) {
    this.height = height;
    this.project.updateState({
      endpoints: {
        [this.endpoint.endpointId]: {
          height
        }
      }
    });
  }

  @Action()
  public updateScript(scriptId: string, code: string, immediate = false) {
    if (!this.endpoint.scripts?.length) {
      this.endpoint.scripts = [{
        id: scriptId,
        name: scriptId,
        code: ''
      }];
    }
    this.endpoint.scripts[0].code = code;
    if (immediate) {
      return this.api.updateScript(this.project.fileInfo!.path, scriptId, code);
    } else {
      this.debouncedUpdateScript(this.project.fileInfo!.path, scriptId, code);
    }
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

  @Action()
  public async generateAiRequest(scriptId: string) {
    const code = await this.api.generateAiRequestScript(this.project.fileInfo!.path, scriptId);
    if (!this.endpoint.scripts?.length) {
      this.endpoint.scripts = [{
        id: scriptId,
        name: 'AI',
        code: ''
      }];
    }

    this.endpoint.scripts[0].code = code;
    return await this.api.updateScript(this.project.fileInfo!.path, scriptId, code);
  }

  @Action()
  public async stopGeneratingAiRequest() {
    await this.api.stopGenerateAiRequestScript(this.project.fileInfo!.path);
  }
}

const [EndpointContext, useEndpointModel] = connect(EndpointModel);

export { EndpointContext, useEndpointModel };