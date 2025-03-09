import fs from "fs";
import { Json } from "httl-common";

import { FileSearch } from "../../../common";
import { HttlProjectFileInfo, HttlProjectItem, HttlProjectViewData } from "./types";
import { HttlProject } from "./project";

export class HttlProjectService {

  private projects = new Map<string, HttlProject>();

  public async resolveProjects({ search }: { search: string }): Promise<HttlProjectItem[]> {
    try {
      const files = await FileSearch.search('**/*.json');

      const infos: HttlProjectFileInfo[] = files
        .map(file => ({
          path: file,
          content: Json.safeParse(
            fs.readFileSync(file, 'utf-8')
          )
        }))
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
    const project = this.projects.get(path) || HttlProject.open(path);

    this.projects.set(path, project);

    return project.getViewData();
  }

  public async importFromOpenApiSpec({ url }: { url: string }): Promise<HttlProjectViewData> {
    if (!URL.canParse(url)) {
      throw new Error('Invalid URL');
    }

    const response = await fetch(url);
    const openApiSpec = await response.text();

    const project = HttlProject.fromSpec(openApiSpec, url);
    project.save();

    return project.getViewData();
  }
}