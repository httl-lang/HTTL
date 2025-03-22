import * as vscode from 'vscode';

export class GetFileContentTool {

  public static AGENT_INSTRUCTION = {
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

  public static async invoke({ filePath }: { filePath: string }) {
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