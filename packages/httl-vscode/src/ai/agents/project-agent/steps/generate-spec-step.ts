import { AgentStepBase } from '../../../core/agent-step-base';

export class GenerateSpecStep extends AgentStepBase<any> {

  protected override startMessage = () =>
    `Instructions:

  - Parse the API controller file ${this.args[0].name}.
  - Identify all endpoints along with their input parameters and return type dependencies.
  - Generate an OpenAPI tag based on the provided class name. If no special directive is given, use the class name as the tag but exclude from the name any technical specific parts e.g. Controller etc. If a special directive is provided, follow the directive accordingly.
  - Generate an OpenAPI operationId based on the provided method name. If no special directive is given, use the method name as the operationId in a camelCase format. If a special directive is provided, follow the directive accordingly.
  - Resolve imports for such dependencies correctly, considering framework technology, aliases and relative paths.
    - If necessary, use available tool to load metadata files (e.g., package.json, webpack.config.js, tsconfig.json) to resolve aliases.
  - Generate a valid OpenAPI 3.x JSON specification for the ${this.args[0].name} controller file.
  - You must return plain **VALID JSON** string without wrapping in \`\`\`json\`\`\` block!
`;
}