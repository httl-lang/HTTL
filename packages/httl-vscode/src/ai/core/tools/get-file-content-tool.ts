import * as vscode from 'vscode';
import fs from "fs";
import path from "path";
import ignore, { Ignore } from "ignore";


export const getFileContentTool = {
  name: 'get-file-content-tool',
  description: 'Get the content of a file or dependency',
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "Path to the file to read"
      },
    },
    required: [
      "filePath",
    ]
  }
};

export class GetFileContentTool {
  static async invoke({ filePath }: { filePath: string }) {
    try {
      const file = await vscode.workspace.fs.readFile(
        vscode.Uri.file(filePath)
      );
      const content = new TextDecoder().decode(file);

      return `Content of \`${filePath}\`:\n${content}\n`;
    } catch (error) {
      return `Error reading file: ${filePath}\n${error}`;
    }
  }
}