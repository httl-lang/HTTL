import { HttlRuntime } from "./runtime";
import { HttlCompiler } from "./compiler";
import { HttlDocument } from "./document";
import { Id, Lang, Path } from "./common";
import fs from "fs";
import dotenv from 'dotenv'
import { IHttpClient } from "./runtime/http/http-client.types";
import { NodeHttpClient } from "./runtime/http/node-http-client";

export interface HttlOptions {
  workdir: string;
  httpClient?: IHttpClient;
}

export class EnvironmentVariables {

  constructor(private readonly workdir: string) {
    this.refresh();
  }

  public refresh() {
    const isNode = typeof process !== 'undefined' && !!process.versions?.node;
    if (this.workdir && isNode) {
      try {
        dotenv.config({ path: Path.toAbsolutePath(this.workdir, '.env') });
      } catch {
        // no filesystem available (browser) — ignore
      }
    }
  }

  public get(key: string): string | undefined {
    return process.env[`${Lang.ENV_VAR_PREFIX}${key}`];
  }

  public getAllNames() {
    return Object.keys(process.env).filter(key => key.startsWith(Lang.ENV_VAR_PREFIX)).map(key => key.replace(Lang.ENV_VAR_PREFIX, ''));
  }

  public has(key: string): boolean {
    return `${Lang.ENV_VAR_PREFIX}${key}` in process.env;
  }
}

export interface IHttlContext {
  workdir: string;
  httpClient: IHttpClient;
  compiler: HttlCompiler;
  runtime: HttlRuntime;
  env: EnvironmentVariables;
  load(fileUri: string): HttlDocument;
  hasDefaultHttlFile(): boolean;
}

export default class Httl implements IHttlContext {
  private readonly documents = new Map<string, HttlDocument>();

  public readonly workdir: string;
  public readonly httpClient: IHttpClient;

  constructor(
    public readonly options: HttlOptions,
    public readonly compiler = new HttlCompiler(),
    public readonly runtime = new HttlRuntime(this),
    public readonly env = new EnvironmentVariables(options.workdir)
  ) {
    this.workdir = options.workdir;
    this.httpClient = options.httpClient ?? new NodeHttpClient();
  }


  public load(fileUri: string): HttlDocument {
    this.env.refresh();
    const absolutePath = Path.toAbsolutePath(this.workdir, fileUri);
    let doc = this.documents.get(absolutePath);
    if (!doc) {
      doc = new HttlDocument(absolutePath, this);
      this.documents.set(absolutePath, doc);
    }

    return doc;
  }

  public createDocument(script: string): HttlDocument {
    this.env.refresh();
    const absolutePath = Path.toAbsolutePath(this.workdir, Id.generate() + ".httl");
    const doc = new HttlDocument(absolutePath, this, script);

    return doc;
  }

  public hasDefaultHttlFile(): boolean {
    // In the browser there is no filesystem (webpack stubs `fs`), so
    // `fs.existsSync` is undefined. There is no default .httl file there.
    if (typeof fs.existsSync !== 'function') {
      return false;
    }
    return fs.existsSync(Path.toAbsolutePath(this.workdir, ".httl"));
  }
}