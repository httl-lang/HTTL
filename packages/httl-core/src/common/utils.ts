import { fileURLToPath } from 'url';
import path from 'path';
import yaml from 'yaml'
import { Err, Ok, Result } from 'oxide.ts';
import { Guard } from './guard';
import { Symbols } from './constants';



export class Path {
  public static isAbsolute(path: string): boolean {
    return path.startsWith("/");
  }

  public static toAbsolutePath(workdir: string | undefined, filePath: string): string {
    const _workdir = workdir ? Path.fileUriToAbsolutePath(workdir) : process.cwd();
    const _filePath = Path.fileUriToAbsolutePath(filePath);

    return path.isAbsolute(_filePath) ? _filePath : path.resolve(_workdir, _filePath);
  }

  public static join(origin: string, file: string): string {
    const dir = path.dirname(
      Path.fileUriToAbsolutePath(origin)
    )
    const filePath = Path.fileUriToAbsolutePath(file);

    return path.isAbsolute(filePath) ? filePath : path.resolve(dir, filePath);
  }

  public static fileUriToAbsolutePath(fileUri: string): string {
    if (!fileUri.startsWith("file://")) {
      return fileUri;
    }

    const filePath = fileURLToPath(fileUri);
    const decodedPath = decodeURIComponent(filePath);
    return path.resolve(decodedPath);
  }
}

export class String {
  public static unquote(str): string {
    return (str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))
      ? str.slice(1, -1)
      : str;
  }
}

export class VAR {
  private static objectPathRegexp = /(?:\.?(?<field>\w+)|\[(?<item>\d+|(["'])(.*?)\3)\])/g

  public static resolve(name: string, obj: Map<string, any>, safeGet = false, onlyRoot = false): any {
    Guard.notNull(name, "name");
    Guard.notNull(obj, "obj");

    const [varName, ...paths] = Array.from(
      name.matchAll(VAR.objectPathRegexp)
    ).map((m) => m.groups.field || m.groups.item);

    if (!safeGet && !obj.has(varName)) {
      throw new Error(`Variable ${varName} not found`);
    }

    let val = obj.get(varName);
    if (onlyRoot) {
      return val
    }

    if (paths.length > 0) {
      if (!val[Symbols.NESTED_VARIABLE]) {
        throw new Error(`Variable ${varName} is not destructurable`);
      }

      paths.forEach((path) => {
        val = val[path];
      });
    }

    return val;
  }

  public static has(name: string, obj: Map<string, any>): any {
    Guard.notNull(name, "name");
    Guard.notNull(obj, "obj");

    const [varName, ...paths] = Array.from(
      name.matchAll(VAR.objectPathRegexp)
    ).map((m) => m.groups.field || m.groups.item);

    return obj.has(varName)
  }
}

export class Json {
  public static safeParse(data: any): Result<any, Error> {
    try {
      return Ok(JSON.parse(data));
    } catch (err) {
      return Err(err);
    }
  }

  public static compare(obj1, obj2): Map<string, [any, any]> {
    const differences = new Map<string, [any, any]>();

    const findDifferences = (keyPath, value1, value2) => {
      if (typeof value1 === "object" && value1 !== null && typeof value2 === "object" && value2 !== null) {
        const allKeys = Object.keys(value1);
        for (const key of allKeys) {
          findDifferences(
            keyPath ? `${keyPath}.${key}` : key,
            value1[key],
            value2[key]
          );
        }
      } else if (value1 !== value2) {
        differences.set(keyPath, [value1, value2]);
      }
    };

    findDifferences("", obj1, obj2);

    return differences;
  };
}

export class Id {
  public static generate(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export class Yaml {
  private static yamlPattern = /^[\s\w-]+:\s.*$/m;
  public static isYaml(content) {
    return this.yamlPattern.test(content);
  }

  public static safeParse(data: any): Result<any, Error> {
    try {
      return Ok(yaml.parse(data));
    } catch (err) {
      return Err(err);
    }
  }
}