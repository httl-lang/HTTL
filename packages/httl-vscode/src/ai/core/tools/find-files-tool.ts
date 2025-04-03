import { FileService } from '../../../common';

export class FindFilesTool {
  public static AGENT_INSTRUCTION = {
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

  public static async invoke({ pattern, baseUri }: { pattern: string, baseUri: string }) {
    const files = await FileService.search(pattern, baseUri);

    return {
      message: `Found ${files.length} files matching "${pattern}":\n${files.join('\n')}`,
      files: files
    };
  }
}