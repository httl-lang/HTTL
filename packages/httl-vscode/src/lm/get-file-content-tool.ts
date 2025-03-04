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
      // purpose: {
      //   type: "string",
      //   description: "Purpose for reading the file, e.g. 'controller', 'dependency'"
      // }
    },
    required: [
      "filePath",
      // "purpose"
    ]
  }
};

export class GetFileContentTool {
  static async invoke({ filePath }: { filePath: string }) {
    const file = await vscode.workspace.fs.readFile(
      vscode.Uri.file(filePath)
    );
    const content = new TextDecoder().decode(file);


    return `Content of ${filePath}:\n${content}`;
  }
}