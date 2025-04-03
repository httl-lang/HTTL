import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ignore, { Ignore } from 'ignore';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'


export class FileService {

  private static instance: FileService;
  public static search(pattern: string | string[], root?: string, absolute = true): Promise<string[]> {
    if (!this.instance) {
      this.instance = new FileService();
      this.instance.init();
    }

    return this.instance.search(pattern, root, absolute);
  }

  private ignoreRules!: Ignore;
  private workDir!: vscode.Uri;

  private init() {
    this.workDir = FileService.getWorkspaceDirectory();
    // this.ignoreRules = this.loadGitignoreRules(this.workDir.fsPath);
  }

  private search(pattern: string | string[], root?: string, absolute?: boolean): Promise<string[]> {
    return glob(pattern, {
      cwd: root || this.workDir.toString(),
      absolute,
      dotRelative: !absolute,
      nodir: true,
      dot: true,
      posix: true,
      ignore: ["**/node_modules/**", "**/.git/**", "**/.vscode/**", "**/.idea/**", "**/dist/**", "**/build/**"],
      // ignore: {
      //   ignored: (p) => {
      //     return this.ignoreRules.ignores(p.fullpath());
      //   },
      // }
    });
  }

  // private loadGitignoreRules(dir: string): Ignore {
  //   const gitignorePath = path.join(dir, '.gitignore');
  //   const ig = ignore({ ignoreCase: true, allowRelativePaths: true });

  //   try {
  //     if (fs.existsSync(gitignorePath)) {
  //       const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  //       ig.add(gitignoreContent);
  //     }
  //   } catch (error) {
  //     console.warn('Could not read .gitignore file:', error);
  //   }

  //   return ig;
  // }

  public static getWorkspaceDirectory(): vscode.Uri {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].uri;
    }

    throw new Error('No workspace opened');
  }

  public static relative(base: string, absolute: string) {
    const final = path.posix.relative(
      base.split(path.sep).join(path.posix.sep).toLowerCase(),
      absolute.split(path.sep).join(path.posix.sep).toLowerCase()
    );

    return final.startsWith('.') ? final : './' + final;
  }
}