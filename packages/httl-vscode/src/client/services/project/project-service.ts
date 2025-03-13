import fs from "fs";
import * as fsPath from "path";
import { Json } from "httl-common";

import { FileSearch } from "../../../common";
import { EndpointScriptCode, HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData } from "./types";
import { HttlProject } from "./project";

export class HttlProjectService {
  private projects = new Map<string, HttlProject>();
  private workDir = FileSearch.getWorkspaceDirectory();

  constructor(
    private scriptRunner: { run: (script: string) => void }
  ) { }

  public async resolveProjects({ search }: { search: string }): Promise<HttlProjectItem[]> {
    try {
      const files = await FileSearch.search('**/*.json', undefined, false);

      const infos: HttlProjectFileInfo[] = files
        .map(file => {
          const fullPath = fsPath.join(this.workDir.fsPath, file);
          return {
            path: file,
            content: Json.safeParse(
              fs.readFileSync(fullPath, 'utf-8')
            )
          };
        }
        )
        .filter(({ path, content }) =>
          HttlProject.isValid(content) && (
            content.name.includes(search) ||
            content.source.includes(search) ||
            path.includes(search)
          )
        )
        .map(file => ({
          name: file.content.name,
          path: file.path,
        }));

      if (infos.length === 0 && URL.canParse(search)) {
        return [{
          name: 'Import From OpenAPI Spec',
          specUrl: search,
        }];
      }

      return infos;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async openProject({ path }: { path: string }): Promise<HttlProjectViewData> {
    let project = this.projects.get(path);

    if (project) {
      await project.sync();
    } else {
      project = HttlProject.open(path);
      this.projects.set(path, project);
    }

    return project.getViewData();
  }

  public async importFromOpenApiSpec({ url }: { url: string }): Promise<HttlProjectViewData> {
    if (!URL.canParse(url)) {
      throw new Error('Invalid URL');
    }

    const response = await fetch(url);
    const openApiSpec = await response.text();

    const project = HttlProject.fromSpec(openApiSpec, url);
    await project.save();

    return project.getViewData();
  }

  public async runScript({ projectFile, scriptId, code }: EndpointScriptCode): Promise<void> {
    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    if (!scriptId) {
      throw new Error('Script id is required');
    }

    if (code) {
      project.updateScript(scriptId, code);
      project.save();
    } else {
      code = project.props.scripts.find(s => s.id === scriptId)?.code;
    }

    if (!code) {
      throw new Error('Code is required');
    }

    const prestartScript = project.props.prestart.code;
    // TODO: temporary solution
    const fianlScript = prestartScript + '\n' + code;

    await this.scriptRunner.run(fianlScript);
  }

  public async updateScript({ projectFile, scriptId, code }: EndpointScriptCode): Promise<void> {
    if (!code) {
      throw new Error('Code is required');
    }

    const project = this.projects.get(projectFile);
    if (!project) {
      throw new Error('Project not found');
    }

    project.updateScript(scriptId, code!, true);

    await project.save();
  }
}