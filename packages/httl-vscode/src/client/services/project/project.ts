import { Json } from "httl-common";
import { HttlProjectFileInfo, HttlProjectProps, HttlProjectScript, HttlProjectViewData } from "./types";
import * as fs from 'fs';
import { ApiSpec } from "httl-core";
import { HttlUrl } from "httl-core/dist/common/url";

export class HttlProject {
  public static isValid(obj: any) {
    return obj &&
      typeof obj === 'object' &&
      typeof obj.name === 'string' &&
      typeof obj.source === 'string' &&
      typeof obj.prestart === 'object' &&
      Array.isArray(obj.scripts);
  }

  public static open(path: string) {
    if (!fs.existsSync(path)) {
      throw new Error(`File not found: ${path}`);
    }

    const rawJson = Json.safeParse(
      fs.readFileSync(path, 'utf-8')
    );

    if (!HttlProject.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${path}`);
    }

    return new HttlProject(
      path,
      rawJson,
      ApiSpec.fromString(rawJson.spec, HttlUrl.parse(rawJson.source))
    );
  }

  public static fromSpec(specContent: string, url: string) {
    const spec = ApiSpec.fromString(specContent, HttlUrl.parse(url));
    const apiInfo = spec.getApiInfo();

    const filename = apiInfo.title.replace(/\s/g, '-').toLowerCase() + '-httl-project';

    const project = new HttlProject(
      filename + '.json',
      {
        name: apiInfo.title,
        description: apiInfo.description,
        source: url,
        technologies: [],
        spec: spec.getRaw(),
        prestart: {
          code: '@base: ' + spec.getBasePath(),
        },
        scripts: [],
      },
      spec
    );

    return project;
  }

  constructor(
    public readonly filePath: string,
    public readonly props: HttlProjectProps,
    public readonly spec: ApiSpec,
  ) {
    if (!filePath) {
      throw new Error('Invalid file path');
    }
  }

  public getInfo(): HttlProjectFileInfo {
    return {
      name: this.props.name,
      path: this.filePath,
    };
  }

  public save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.props, null, 2));
  }

  public getViewData(): HttlProjectViewData {
    const endpoints = this.spec.getEndpoints();
    t[0].method

    return {
      fileInfo: this.getInfo(),
      description: this.props.description,
      source: this.props.source,
      technologies: this.props.technologies,
      prestart: this.props.prestart.code,
      endpoints: [],
    };
  }
}
