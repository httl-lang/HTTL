import * as vscode from 'vscode';
import fs from "fs";
import path from "path";
import ignore, { Ignore } from "ignore";


export const findFilesTool = {
  name: 'find-files-tool',
  description: 'Find files in the workspace',
  inputSchema: {
    type: "object",
    properties: {
      pattern: {
        type: "string",
        description: "Search for files that match this glob pattern"
      },
      purpose: {
        type: "string",
        description: "Purpose for searching files, e.g. 'controller', 'dependency'"
      }
    },
    required: [
      "pattern",
      "purpose"
    ]
  }
};

export class FindFilesTool {
  static async invoke({ pattern }: { pattern: string }) {
    // await vscode.workspace.workspaceFile
    // const gitignore = await vscode.workspace.findFiles(
    //   '.gitignore',
    // );
    // const gitignoreContent = fs.readFileSync(gitignore.at(-1)!.fsPath, "utf-8");

    const t = getWorkspaceDirectory();


    const files = await vscode.workspace.findFiles(
      // path.join(t!, "./apps/srv-api", pattern),
      pattern,
      "**/node_modules/**",
      undefined
    );

    // const files = getFilteredFiles(t!);

    const filePaths = files.map(x => x.fsPath);
    return {
      message: `Found ${files.length} files matching "${pattern}":\n${filePaths.join('\n')}`,
      files: filePaths
    };
  }
}

function getWorkspaceDirectory(): string | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0].uri.fsPath; // Returns the first workspace folder's path
  }
  return undefined; // No workspace opened
}
// Load and parse .gitignore
function loadGitignore(directory: string): Ignore {
  const gitignorePath = path.join(directory, ".gitignore");
  if (!fs.existsSync(gitignorePath)) return ignore(); // Return empty filter if .gitignore is missing
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
  return ignore()
    .add(gitignoreContent)
    .add(".git"); // Always ignore .git directory
}

// Recursively retrieve all files in a directory
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Get filtered files based on .gitignore rules
function getFilteredFiles(directory: string): string[] {
  const ig = loadGitignore(directory);
  const allFiles = getAllFiles(directory);
  const filteredFiles = ig.filter(allFiles.map(f => path.relative(directory, f)));
  return filteredFiles;
}

