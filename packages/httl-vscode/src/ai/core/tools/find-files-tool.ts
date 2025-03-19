import * as vscode from 'vscode';
import fs from "fs";
import path from "path";
import ignore, { Ignore } from "ignore";
import { FileService } from '../../../common';


export const findFilesTool = {
  name: 'find-files-tool',
  description: 'Find files in the SELECTED DIRECTORY',
  inputSchema: {
    type: "object",
    properties: {
      baseUri: {
        type: "string",
        description: "Base folder URI to search files in"
      },
      pattern: {
        type: "string",
        description: "Search for files that match the Glob pattern, e.g.: **​/*.{ts,js}, *.cs, package.json etc."
      },
      purpose: {
        type: "string",
        description: "Purpose for searching files, e.g. 'controller', 'dependency'"
      }
    },
    required: [
      "baseUri",
      "pattern",
      "purpose"
    ]
  }
};

export class FindFilesTool {
  static async invoke({ pattern, baseUri }: { pattern: string, baseUri: string }) {

    // const files = await vscode.workspace.findFiles(
    //   new vscode.RelativePattern(baseUri, pattern),
    //   "**/node_modules/**",
    //   undefined
    // );
    const files = await FileService.search(pattern, baseUri);

    // const filePaths = files.map(x => x.fsPath);
    return {
      message: `Found ${files.length} files matching "${pattern}":\n${files.join('\n')}`,
      files: files
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

