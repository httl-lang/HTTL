import { Action, Model, connect, store } from "react-storm";
import { ProjectApi } from "../project.api";
import { ApiEndpoint, ProjectModel } from "../project.model";
import { ProjectStateModel } from "../project-state.model";

function debounce<T extends (...args: any[]) => any>(fn: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>): any => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
}

@Model()
export class EndpointModel {
  private readonly debouncedUpdateScript: typeof ProjectApi.prototype.updateScript;

  public endpoint!: ApiEndpoint;
  public inProgress = false;
  public expanded = false;
  public height = '70px';
  public focused = false;

  constructor(
    private readonly project = store(ProjectModel),
    private readonly api = new ProjectApi(),
    private readonly state = store(ProjectStateModel),
  ) {
    this.debouncedUpdateScript = debounce(this.api.updateScript.bind(this.api), 2000);
  }

  public async init(endpoint: ApiEndpoint) {
    this.endpoint = endpoint;

    const state = this.state.endpoints[endpoint.id] || {};

    this.expanded = state.expanded || false;
    this.height = state.height || '70px';

    if (this.expanded && !this.endpoint.scripts.length) {
      this.generateRequest(this.endpoint.id);
    }
  }

  public async update(endpoint: ApiEndpoint) {
    await this.init(endpoint);
  }

  @Action()
  public async runScript(scriptId: string, code?: string) {
    if (code !== undefined) {
      this.inProgress = true;

      if (code !== this.endpoint.defaultScript) {
        await this.updateScript(scriptId, code, true);
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
  public onFocus() {
    this.project.setFocusedEndpoint(this);
    vscode.postMessage({
      command: 'set-focus',
      file: `project::${this.project.fileInfo!.path}::${this.endpoint.id}` // TODO: move to common place
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
  public async onExpand() {
    this.expanded = !this.expanded;

    this.onFocus();

    this.state.updateState({
      endpoints: {
        [this.endpoint.id]: {
          expanded: this.expanded
        }
      }
    });

    if (this.expanded && !this.endpoint.scripts.length) {
      // setEditorBusy(true);
      await this.generateRequest(this.endpoint.id);
      // setEditorBusy(false);
    }
  }

  @Action()
  public onResize(height: string) {
    this.state.updateState({
      endpoints: {
        [this.endpoint.id]: {
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
}

const [EndpointContext, useEndpointModel] = connect(EndpointModel);

export { EndpointContext, useEndpointModel };