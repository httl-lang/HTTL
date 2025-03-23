import { Action, Model, connect, store } from "react-storm";
import { AppModel } from "../../app.model";
import { HttlProjectFileInfo } from "../../../../client/views/main/services/project";
import { ProjectModel } from "./project.model";

export interface EndpointState {
  height?: string
  expanded?: boolean
}

export interface ProjectState {
  prestartHeight: string;
  activeEndpoint?: string;
  endpoints: Record<string, EndpointState>;
}

function merge<T>(a: T, b: Partial<T>): T {
  for (const key in b) {
    if (b.hasOwnProperty(key)) {
      const element = b[key];
      if (element === undefined) {
        delete a[key];
      } else if (typeof element === 'object') {
        a[key] ??= {} as any;
        a[key] = merge(a[key], element);
      } else {
        a[key] = element;
      }
    }
  }

  return a;
}

@Model()
export class ProjectStateModel implements ProjectState {
  public static readonly PROJECT_STATE = (path: string) => `project:${path}:state`;

  public filePath?: string;

  public prestartHeight: string = '70px';
  public endpoints: Record<string, EndpointState> = {};
  public activeEndpoint?: string;

  constructor(
    private readonly app = store(AppModel),
  ) { }

  public async init({ path }: { path: string }) {
    if (path === undefined) {
      this.filePath = undefined;
      return;
    }

    this.filePath = path;

    const savedProjectState = this.app.getState(ProjectStateModel.PROJECT_STATE(this.filePath));
    if (savedProjectState) {
      this.prestartHeight = savedProjectState.prestartHeight;
      this.endpoints = savedProjectState.endpoints;
      this.activeEndpoint = savedProjectState.activeEndpoint;
    } else {
      this.prestartHeight = '70px';
      this.endpoints = {};
      this.activeEndpoint = undefined;
    }
  }

  public async update(props: { path: string }) {
    await this.init(props);
  }

  @Action()
  public updateState(state: Partial<ProjectState>) {
    merge(this, state);

    this.app.saveState(ProjectStateModel.PROJECT_STATE(this.filePath!), {
      prestartHeight: this.prestartHeight,
      endpoints: this.endpoints,
      activeEndpoint: this.activeEndpoint
    } satisfies ProjectState);
  }
}

const [ProjectStateContext, useProjectStateModel] = connect(ProjectStateModel);

export { ProjectStateContext, useProjectStateModel };