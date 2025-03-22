import * as vscode from 'vscode';

export class FindDepTool {
  public static AGENT_INSTRUCTION = {
    name: 'find-dep-tool',
    description: 'Find dependencies in the workspace',
    inputSchema: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Pahttern to search for dependencies"
        },
      },
      required: [
        "pattern",
      ]
    }
  };

  static async invoke({ pattern }: { pattern: string }) {
    const files = await vscode.workspace.findFiles(
      pattern,
      "**/node_modules/**",
      undefined
    );

    const filePaths = files.map(x => x.fsPath);

    return {
      message: `Found ${files.length} files matching "${pattern}":\n${filePaths.join('\n')}`,
      files: filePaths
    };
  }
}