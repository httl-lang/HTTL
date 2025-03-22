import { AgentStepBase } from '../../core/agent-step-base';

export class GenerateSpecStep extends AgentStepBase<any> {

  //   protected override startMessage = () =>
  //     `1. For each endpoints in the '${this.args[0].name}' file use the tools to load input and return dependence types.
  // 3. Make sure you resolve the imports of such dependencies correctly, considering aliases and relative paths.
  //     If required use the tool to load any metadata files (e.g. package.json, webpack.js, tsconfig.json) that help you resolve aliases.
  // 3. Generate me OpenApi 3.x json specification for '${this.args[0].name}' controller file.`;
  // - You must return plain json without wrapping in \`\`\`json\`\`\` block!
  protected override startMessage = () =>
    `Instructions:

  - Parse the API controller file ${this.args[0].name}.
  - Identify all endpoints along with their input parameters and return type dependencies.
  - Resolve imports for such dependencies correctly, considering framework technology, aliases and relative paths.
    - If necessary, use available tool to load metadata files (e.g., package.json, webpack.config.js, tsconfig.json) to resolve aliases.
  - Generate a valid OpenAPI 3.x JSON specification for the ${this.args[0].name} controller file.
  - You must return plain **VALID JSON** string without wrapping in \`\`\`json\`\`\` block!
`;
}