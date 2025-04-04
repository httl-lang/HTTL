import { SchemaResolver } from "./schema-resolver";
import { Operation, Parameter, RequestBody, SecurityRequirement, Server, Response, Example, Schema } from "./versions/open-api_3_x";

class ApiEndpointBody {
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
        return schema.example || "string";

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

class ApiEndpointResponse {
  constructor(
    private readonly responses: Record<string, Response>,
    private readonly schemaResolver: SchemaResolver
  ) {
    if (Object.keys(responses).length === 0)
      return;
  }

  public hasResponse() {
    return !!this.responses &&
      Object.entries(this.responses)
        .some(([statusCode, response]) =>
          !!response.content?.['application/json']?.schema
        );
  }

  public generateResponseString() {
    const entries = Object.entries(this.responses)
      .map(([statusCode, response]) => {
        const schema = response.content?.['application/json']?.schema

        if (schema) {
          const json = this.generateExample(response.content?.['application/json']?.schema);
          return [
            statusCode,
            json
          ]
        }
      })
      .filter(Boolean);

    return entries.length > 0
      ? JSON.stringify(Object.fromEntries(entries), null, 2)
      : null;
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
        return schema.example || "string";

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
  public readonly queryParameters: Parameter[];
  
  public readonly requestBody: ApiEndpointBody;
  public readonly responses: ApiEndpointResponse;

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
    this.queryParameters = this.parameters.filter(x => x.in.toLowerCase() === 'query');
    this.requestBody = operation.requestBody && new ApiEndpointBody(operation.requestBody, schemaResolver);
    this.responses = operation.responses && new ApiEndpointResponse(operation.responses, schemaResolver);

    this.deprecated = operation.deprecated;
    this.security = operation.security;
    this.servers = operation.servers;
    this.tags = operation.tags;
  }

  public getMethodAndPath() {
    return `${this.method} ${this.path}`;
  }

  public generateFullRequest() {
    let result = this.getMethodAndPath();

    if (this.queryParameters?.length > 0) {
      const params = this.queryParameters.map(param => {
        return `${param.name}={${param.name}}`;
      }).join('&');

      result += `?${params}`;
    }

    if (!!this.requestBody) {
      result += ` ${this.requestBody.generateBodyString()}`;
    }

    return result;
  }

  public hasBodySchema() {
    return !!this.requestBody;
  }

  public getBodyModel(): string {
    return this.requestBody?.generateBodyString();
  }

  public hasResponseSchema() {
    return !!this.responses?.hasResponse();
  }

  public getResponseModel(): string {
    return this.responses?.generateResponseString();
  }
}
