import { Json } from "httl-common";
import { FileSearch } from "../../../common";
import { HttlProjectFileInfo, HttlProjectItem } from "./types";

export class HttlProjectService {

  public async resolveProjects({ search }: { search: string }): Promise<HttlProjectItem[]> {

    const files = await FileSearch.search('**/*.json', undefined, false);

    const infos: HttlProjectFileInfo[] = files
      .map(file => Json.safeParse(file))
      .filter(Boolean)
      .filter(project =>
        project.name.includes(search) ||
        project.path.includes(search) ||
        project.source?.includes(search)
      )
      .map(file => ({
        name: file.name,
        path: file,
      }));

    if (infos.length === 0 && URL.canParse(search)) {
      return [{
        name: 'Import From OpenAPI Spec',
        specUrl: search,
      }];
    }

    return infos;
  }

  public async openProject({ path }: { path: string }): Promise<any> {
    const fiels = await FileSearch.search('**/*.json', undefined, false);

    return fiels.map(file => ({
      name: file,
    }));
  }

  public async importFromOpenApiSpec({ url }: { url: string }): Promise<any> {
    const fiels = await FileSearch.search('**/*.json', undefined, false);

    return fiels.map(file => ({
      name: file,
    }));
  }
}