import { Json } from "httl-common";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectProps, HttlProjectScript, HttlProjectViewData } from "./types";
import * as fs from 'fs';
import * as asyncFs from 'node:fs/promises';
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

    if (!this.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${path}`);
    }

    return new HttlProject(
      path,
      rawJson,
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
    );

    return project;
  }

  public spec!: ApiSpec;

  constructor(
    public readonly filePath: string,
    public readonly props: HttlProjectProps,
  ) {
    if (!filePath) {
      throw new Error('Invalid file path');
    }

    this.spec = ApiSpec.fromSpec(props.spec, HttlUrl.parse(props.source));
  }

  public getInfo(): HttlProjectFileInfo {
    return {
      name: this.props.name,
      path: this.filePath,
    };
  }

  public async save() {
    await asyncFs.writeFile(this.filePath, JSON.stringify(this.props, null, 2));
  }

  public async sync() {
    if (!fs.existsSync(this.filePath)) {
      throw new Error(`File not found: ${this.filePath}`);
    }

    const rawJson = Json.safeParse(
      await asyncFs.readFile(this.filePath, 'utf-8')
    );

    if (!HttlProject.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${this.filePath}`);
    }

    Object.assign(this.props, rawJson);
    this.spec = ApiSpec.fromSpec(this.props.spec, HttlUrl.parse(this.props.source));
  }

  public updateScript(scriptId: string, code: string, upsert = false) {
    const script = this.props.scripts.find(s => s.id === scriptId);

    if (script) {
      script.code = code;
    } else if (upsert) {
      this.props.scripts.push({
        id: scriptId,
        name: 'default',
        code,
      });
    } else {
      throw new Error(`Script not found: ${scriptId}`);
    }
  }

  public getViewData(): HttlProjectViewData {
    const endpoints = this.spec
      .getEndpoints()
      .map(endpoint => {
        const id = `${endpoint.method} ${endpoint.path}`.toLowerCase();
        return {
          id,
          method: endpoint.method,
          path: endpoint.path,
          tag: endpoint.tags?.[0] || 'default',
          description: endpoint.description,
          operationId: endpoint.operationId,
          scripts: this.props.scripts.filter(script => script.id === id),
        } as HttlProjectApiEndpoint;
      });

    return {
      fileInfo: this.getInfo(),
      description: this.props.description,
      source: this.props.source,
      technologies: this.props.technologies,
      prestart: this.props.prestart.code,
      endpoints,
    };
  }
}
