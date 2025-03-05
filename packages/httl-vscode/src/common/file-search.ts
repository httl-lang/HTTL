import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ignore, { Ignore } from 'ignore';
import { glob, globSync, globStream, globStreamSync, Glob } from 'glob'


export class FileSearch {

  private static instance: FileSearch;
  public static search(pattern: string | string[], root?: string): Promise<string[]> {
    if (!this.instance) {
      this.instance = new FileSearch();
      this.instance.init();
    }

    return this.instance.search(pattern, root);
  }

  private ignoreRules!: Ignore;
  private workDir!: vscode.Uri;

  private init() {
    this.workDir = this.getWorkspaceDirectory();
    // this.ignoreRules = this.loadGitignoreRules(this.workDir.fsPath);
  }

  private search(pattern: string | string[], root?: string): Promise<string[]> {
    return glob(pattern, {
      cwd: root || this.workDir.toString(),
      absolute: true,
      nodir: true,
      ignore: ["**/node_modules/**", "**/.git/**", "**/.vscode/**", "**/.idea/**", "**/dist/**", "**/build/**"],
      // ignore: {
      //   ignored: (p) => {
      //     return this.ignoreRules.ignores(p.fullpath());
      //   },
      // }
    });
  }

  private loadGitignoreRules(dir: string): Ignore {
    const gitignorePath = path.join(dir, '.gitignore');
    const ig = ignore({ ignoreCase: true, allowRelativePaths: true });

    try {
      if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
        ig.add(gitignoreContent);
      }
    } catch (error) {
      console.warn('Could not read .gitignore file:', error);
    }

    return ig;
  }

  private getWorkspaceDirectory(): vscode.Uri {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
      return workspaceFolders[0].uri;
    }

    throw new Error('No workspace opened');
  }
}