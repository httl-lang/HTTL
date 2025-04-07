import { AgentStepBase } from '../../../core/agent-step-base';

export class GenerateSpecStep extends AgentStepBase<any> {

  protected override startMessage = () =>
    `Instructions:

- Read the API controller file ${this.args[0].name}.

- Identify all API endpoints in this file and generate OpenAPI specification for each endpoint, using the following instructions:
  1. Generate an OpenAPI tag based on the provided class name. Remove technical suffixes like "Controller" from the tag name unless a special directive specifies otherwise.
  2. Preserve the order of endpoints as they appear in the file.
  3. For endpoints with special directives, follow those directives for OpenAPI specification generation.
  4. For endpoints without special directives, apply default OpenAPI specification rules and use the method name in camelCase format as the operationId.
  5. For endpoints with input parameters:
     - Determine the parameter type and use it in the OpenAPI specification
     - For object parameters, use the object name as the schema name and include all object properties in the specification
  6. For endpoints with response parameters:
     - Determine the response type and use it in the OpenAPI specification
     - For object responses, use the object name as the schema name and include all object properties in the specification
  7. For any input or response objects defined in different files:
     - Use available tools to correctly import dependencies, considering the framework technology, aliases, and relative paths
     - If needed, use available tools to load metadata files (e.g., package.json, webpack.config.js, tsconfig.json) to resolve aliases

- Generate a valid OpenAPI 3.x JSON specification for the ${this.args[0].name} controller file.
- The return object should be a single JSON object, not an array.
- Return ONLY a valid JSON string without code block formatting (no \`\`\`json\`\`\` wrappers).
`;
}