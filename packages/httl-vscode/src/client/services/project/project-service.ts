import { Json } from "httl-common";
import { FileSearch } from "../../../common";
import { HttlProjectFileInfo, HttlProjectItem } from "./types";
import fs from "fs";

export class HttlProjectService {

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
        .filter(({ path, content: { name, source, prestart, scripts } = {} }) =>
          name && source && prestart && scripts && (
            name.includes(search) ||
            path.includes(search) ||
            source.includes(search)
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