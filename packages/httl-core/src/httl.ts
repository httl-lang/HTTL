import { HttlRuntime } from "./runtime";
import { HttlCompiler } from "./compiler";
import { HttlDocument } from "./document";
import { Id, Lang, Path } from "./common";
import fs from "fs";
import dotenv from 'dotenv'

export interface HttlOptions {
  workdir: string;
}

export class EnvironmentVariables {

  constructor(private readonly workdir: string) {
    this.refresh();
  }

  public refresh() {
    if (this.workdir) {
      dotenv.config({ path: Path.toAbsolutePath(this.workdir, '.env') });
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
  compiler: HttlCompiler;
  runtime: HttlRuntime;
  env: EnvironmentVariables;
  load(fileUri: string): HttlDocument;
  hasDefaultHttlFile(): boolean;
}

export default class Httl implements IHttlContext {
  private readonly documents = new Map<string, HttlDocument>();

  public readonly workdir: string;

  constructor(
    public readonly options: HttlOptions,
    public readonly compiler = new HttlCompiler(),
    public readonly runtime = new HttlRuntime(this),
    public readonly env = new EnvironmentVariables(options.workdir)
  ) {
    this.workdir = options.workdir;
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
    return fs.existsSync(Path.toAbsolutePath(this.workdir, ".httl"));
  }
}