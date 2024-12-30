import { SchemaResolver } from "./schema-resolver";
import { Operation, Parameter, RequestBody, SecurityRequirement, Server, Response, Example, Schema } from "./versions/open-api_3_x";

export class ApiEndpointBody {
  description?: string;
  required?: boolean;
  examples?: Record<string, Example>;
  example?: any;
  schema?: Schema;
  contentType?: string;

  constructor(
    { description, required, content }: RequestBody,
    private readonly schemaResolver: SchemaResolver
  ) {
    this.description = description;
    this.required = required;
    if (!content)
      return;

    const contentEntries = Object.entries(content);
    if (contentEntries.length === 0)
      return;

    const [contentType, model] = contentEntries[0];

    const { schema, examples, example } = model || {};
    if (!schema)
      return;

    this.examples = examples;
    this.example = example;
    this.schema = schema;
    this.contentType = contentType;
  }

  public generateBodyString() {
    // TODO: return example if exists
    const json = this.generateExample(this.schema);

    if (this.contentType === 'multipart/form-data') {
      return "formdata " + JSON.stringify(json, null, 2);
    }

    return JSON.stringify(json, null, 2);
  }

  private generateExample(schema) {
    if (!schema || typeof schema !== "object") return null;

    const { type, properties, items, $ref } = schema;

    if ($ref) {
      const resolvedSchema = this.schemaResolver.get($ref);
      if (resolvedSchema) {
        return this.generateExample(resolvedSchema);
      }

      return null;
    }

    switch (type) {
      case "object":
        const exampleObject = {};
        for (const [key, propertySchema] of Object.entries(properties || {})) {
          exampleObject[key] = this.generateExample(propertySchema);
        }
        return exampleObject;

      case "array":
        return [this.generateExample(items)];

      case "string":
        return schema.example || "string_example";

      case "integer":
        return schema.example || 123;

      case "number":
        return schema.example || 123.45;

      case "boolean":
        return schema.example !== undefined ? schema.example : true;

      default:
        return null;
    }
  }
}
export class ApiEndpoint {

  public readonly method: string;
  public readonly path: string;

  public readonly summary?: string;
  public readonly description?: string;
  public readonly operationId?: string;

  public readonly parameters: Parameter[];
  public readonly requestBody: ApiEndpointBody;
  public readonly responses: Record<string, Response>;

  public readonly deprecated?: boolean;
  public readonly security?: SecurityRequirement[];
  public readonly servers?: Server[];

  public readonly tags?: string[];

  constructor(path: string, method: string, operation: Operation, schemaResolver: SchemaResolver) {
    this.method = method;
    this.path = path;

    this.summary = operation.summary;
    this.description = operation.description;
    this.operationId = operation.operationId;

    this.parameters = operation.parameters || [];
    this.requestBody = operation.requestBody && new ApiEndpointBody(operation.requestBody, schemaResolver);
    this.responses = operation.responses;

    this.deprecated = operation.deprecated;
    this.security = operation.security;
    this.servers = operation.servers;
    this.tags = operation.tags;
  }

  public getMethodAndPath() {
    return `${this.method} ${this.path}`;
  }
}
