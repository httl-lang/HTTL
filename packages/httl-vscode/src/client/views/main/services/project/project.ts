import * as vscode from 'vscode';
import { Json } from "httl-common";
import { HttlProjectApiEndpoint, HttlProjectFileInfo, HttlProjectProps, HttlProjectViewData } from "./types";
import * as fs from 'fs';
import * as fsPath from 'path';
import * as asyncFs from 'node:fs/promises';
import { ApiSpec } from "httl-core";
import { HttlUrl } from "httl-core/dist/common/url";
import { FileService } from "../../../../../common";
import { FindApiControllersStepResult } from "../../../../../ai/agents/steps/find-api-controllers-step";


export class HttlProject {

  private static FILE_EXTENSION = '.httl.json';

  private static getFileName(name: string): string {
    let intendedFileName = './' + name.replace(/[<>:"/\\|?*\s]/g, '_').toLowerCase();

    for (let index = 0; index < 100; index++) {
      const validFileName = intendedFileName + (index ? `-${index}` : '');
      const fullPath = fsPath.join(FileService.getWorkspaceDirectory().fsPath, validFileName + HttlProject.FILE_EXTENSION);
      if (!fs.existsSync(fullPath)) {
        intendedFileName = validFileName + HttlProject.FILE_EXTENSION;
        break;
      }
    }

    return intendedFileName;
  }

  public static isValid(obj: any) {
    return obj &&
      typeof obj === 'object' &&
      typeof obj.name === 'string' &&
      typeof obj.source === 'string' &&
      typeof obj.prestart === 'object' &&
      Array.isArray(obj.scripts);
  }

  public static create(name: string, props: Partial<HttlProjectProps>): HttlProject {
    const newProjectFileName = this.getFileName(name);

    const project = new HttlProject(
      newProjectFileName,
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
      fullPath = fsPath.join(FileService.getWorkspaceDirectory().fsPath, path);
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

  public static fromSpec(spec: string | ApiSpec, url: string) {
    const apiSpec = typeof spec === 'string'
      ? ApiSpec.fromString(spec, HttlUrl.parse(url))
      : spec;

    const apiInfo = apiSpec.getApiInfo();

    const filename = this.getFileName(apiInfo.title);

    const project = new HttlProject(
      filename,
      {
        name: apiInfo.title,
        description: apiInfo.description,
        source: url.toLowerCase(),
        technologies: [],
        spec: apiSpec.getRaw(),
        prestart: {
          code: '@base: ' + apiSpec.getBasePath().fullUrl,
        },
        scripts: [],
      },
    );

    return project;
  }

  public static async fromSpecUrl(url: string) {
    const spec = await ApiSpec.fromUrl(url);
    return this.fromSpec(spec, url);
  }

  public spec!: ApiSpec;
  public fullPath!: string;

  private workdir!: vscode.Uri;

  constructor(
    public readonly filePath: string,
    public readonly props: HttlProjectProps,
    private content?: string
  ) {
    if (!filePath) {
      throw new Error('Invalid file path');
    }

    this.workdir = FileService.getWorkspaceDirectory();

    this.fullPath = fsPath.isAbsolute(filePath)
      ? filePath
      : fsPath.join(this.workdir.fsPath, filePath);

    this.spec = ApiSpec.fromSpec(props.spec, HttlUrl.parse(props.source));
  }

  public getInfo(): HttlProjectFileInfo {
    return {
      id: this.filePath,
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

  public async sync(fullSync = false) {
    if (!fs.existsSync(this.fullPath)) {
      throw new Error(`File not found: ${this.fullPath}`);
    }

    this.content = await asyncFs.readFile(this.fullPath, 'utf-8');
    const rawJson = Json.safeParse(this.content);

    if (!HttlProject.isValid(rawJson)) {
      throw new Error(`Invalid project file: ${this.fullPath}`);
    }

    Object.assign(this.props, rawJson);

    if (fullSync && this.props.source.startsWith('http')) {
      this.spec = await ApiSpec.fromUrl(this.props.source);
      this.props.spec = this.spec.getRaw();
      await this.save();
    } else {
      this.spec = ApiSpec.fromSpec(this.props.spec, HttlUrl.parse(this.props.source));
    }
  }

  public setDefaultSpec() {
    this.props.spec = {
      openapi: '3.0.0',
      info: {
        title: this.props.name,
        version: '1.0.0',
      },
      tags: [],
      paths: {},
      definitions: {},
    };
    this.spec = ApiSpec.fromSpec(this.props.spec, HttlUrl.parse(''));
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
        const endpointId = `${endpoint.method} ${endpoint.path}`.toLowerCase();
        return {
          endpointId,
          method: endpoint.method,
          path: endpoint.path,
          tag: endpoint.tags?.[0] || 'default',
          description: endpoint.description,
          operationId: endpoint.operationId,
          scripts: this.props.scripts.filter(script => script.id === endpointId),
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

  public updateTags(controllers: FindApiControllersStepResult[]) {
    this.props.spec ??= { tags: [] };

    this.props.spec.tags = controllers.map(controller => ({
      name: controller.tag,
    }));
  }
}
