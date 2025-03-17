import { Json } from "httl-common";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectProps, HttlProjectScript, HttlProjectViewData } from "./types";
import * as fs from 'fs';
import * as fsPath from 'path';
import * as asyncFs from 'node:fs/promises';
import { ApiSpec } from "httl-core";
import { HttlUrl } from "httl-core/dist/common/url";
import { FileSearch } from "../../../../../common";
import { FindApiControllersStepResult } from "../../../../../ai/agents/steps/find-api-controllers-step";
import { ControllerSpec } from "../../../../../ai/agents/project-agent";

export class HttlProject {


  public static isValid(obj: any) {
    return obj &&
      typeof obj === 'object' &&
      typeof obj.name === 'string' &&
      typeof obj.source === 'string' &&
      typeof obj.prestart === 'object' &&
      Array.isArray(obj.scripts);
  }

  public static create(name: string, props: Partial<HttlProjectProps>): HttlProject {
    const newFileName = './' + name.replace(/[<>:"/\\|?*\s]/g, '_').toLowerCase() + '_httl.json';

    const project = new HttlProject(
      newFileName,
      {
        name,
        description: '',
        source: '',
        technologies: [],
        spec: {
          openapi: '3.0.0',
          info: {
            title: name,
            version: '1.0.0',
          },
          tags: [],
          paths: {},
          definitions: {},
        },
        prestart: { code: '# e.g. @base: :3000' },
        scripts: [],
        ...props,
      },
    );

    return project;
  }

  public static open(path: string) {
    let fullPath = path;
    if (!fsPath.isAbsolute(path)) {
      fullPath = fsPath.join(FileSearch.getWorkspaceDirectory().fsPath, path);
    }

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const rawJson = Json.safeParse(content);

    if (!this.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${fullPath}`);
    }

    return new HttlProject(
      path,
      rawJson,
      content
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
  private fullPath!: string;

  constructor(
    public readonly filePath: string,
    public readonly props: HttlProjectProps,
    private content?: string
  ) {
    if (!filePath) {
      throw new Error('Invalid file path');
    }

    this.fullPath = fsPath.isAbsolute(filePath)
      ? filePath
      : fsPath.join(FileSearch.getWorkspaceDirectory().fsPath, filePath);

    this.spec = ApiSpec.fromSpec(props.spec, HttlUrl.parse(props.source));
  }

  public getInfo(): HttlProjectFileInfo {
    return {
      name: this.props.name,
      path: this.filePath,
    };
  }

  public equals(updated: HttlProject) {
    return this.content === updated.content;
  }

  public async save() {
    this.content = JSON.stringify(this.props, null, 2);
    await asyncFs.writeFile(this.fullPath, this.content, 'utf-8');
  }

  public async sync() {
    if (!fs.existsSync(this.fullPath)) {
      throw new Error(`File not found: ${this.fullPath}`);
    }

    this.content = await asyncFs.readFile(this.fullPath, 'utf-8');
    const rawJson = Json.safeParse(this.content);

    if (!HttlProject.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${this.fullPath}`);
    }

    Object.assign(this.props, rawJson);
    this.spec = ApiSpec.fromSpec(this.props.spec, HttlUrl.parse(this.props.source));
  }

  public updatePrestartScript(code: string) {
    this.props.prestart = { code };
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

  public resetScript(scriptId: string) {
    this.props.scripts = this.props.scripts.filter(s => s.id !== scriptId);
  }

  public getEndpoint(scriptId: string) {
    const [method, path] = scriptId.split(' ');
    const endpoint = this.spec.getEndpoints({ method, path })?.[0];
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${scriptId}`);
    }

    return endpoint;
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
          hasBodySchema: endpoint.hasBodySchema(),
          hasResponseSchema: endpoint.hasResponseSchema(),
        } satisfies HttlProjectApiEndpoint;
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

  public generateRequestScript(scriptId: string) {
    const [method, path] = scriptId.split(' ');
    const [endpoint] = this.spec.getEndpoints({ method, path }) || [];
    if (!endpoint) {
      throw new Error(`Endpoint not found: ${scriptId}`);
    }

    return endpoint.generateFullRequest();
  }

  public mergeSpecForTag(tag: string, spec: any) {
    this.props.spec ??= {};

    // Validate spec
    ApiSpec.parseSpec(spec);

    // Merge paths
    if (spec.paths) {
      this.props.spec.paths ??= {};
      this.props.spec.paths = {
        ...this.props.spec.paths,
        ...spec.paths,
      };
    }

    // Merge components
    if (spec.components) {
      this.props.spec.components ??= { schemas: {} };
      this.props.spec.components.schemas = {
        ...this.props.spec.components.schemas,
        ...spec.components.schemas,
      };
    }

    // Merge definitions
    if (spec.definitions) {
      this.props.spec.definitions ??= {};
      this.props.spec.definitions = {
        ...this.props.spec.definitions,
        ...spec.definitions,
      };
    }

    // Merge paths
    if (spec.securityDefinitions) {
      this.props.spec.securityDefinitions ??= {};
      this.props.spec.securityDefinitions = {
        ...this.props.spec.securityDefinitions,
        ...spec.securityDefinitions,
      };
    }
  }

  public addTags(controllers: FindApiControllersStepResult[]) {
    this.props.spec ??= { tags: [] };

    this.props.spec.tags = controllers.map(controller => ({
      name: controller.tag,
    }));
  }
}
