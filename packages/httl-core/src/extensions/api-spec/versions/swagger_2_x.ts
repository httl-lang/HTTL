import { ApiEndpoint } from "../api-endpoint";
import { IOpenApiVersionAdapter } from "../api-version-adapter";
import { SchemaResolver } from "../schema-resolver";

// Info Object
export interface Info {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: Contact;
  license?: License;
  version: string;
}

// Contact Object
export interface Contact {
  name?: string;
  url?: string;
  email?: string;
}

// License Object
export interface License {
  name: string;
  url?: string;
}

// Paths Object
export interface Paths {
  [path: string]: PathItem;
}

// Path Item Object
export interface PathItem {
  $ref?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  parameters?: Parameter[];
}

// Operation Object
export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
  operationId?: string;
  consumes?: string[];
  produces?: string[];
  parameters?: Parameter[];
  responses: Responses;
  schemes?: string[];
  deprecated?: boolean;
  security?: SecurityRequirement[];
}

// External Documentation Object
export interface ExternalDocumentation {
  description?: string;
  url: string;
}

// Parameter
export type Parameter = BodyParameter | QueryParameter | PathParameter | HeaderParameter | FormDataParameter;

// Body Parameter
export interface BodyParameter {
  name: string;
  in: "body";
  description?: string;
  required?: boolean;
  schema: SchemaObject;
}

// Query, Path, Header, and Form Data Parameter
export interface QueryParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie" | "formData";
  description?: string;
  required?: boolean;
  type: string;
  format?: string;
  items?: ItemsObject;
  collectionFormat?: string;
  default?: any;
}

export interface PathParameter extends QueryParameter {
  in: "path";
  required: true;
}

export interface HeaderParameter extends QueryParameter {
  in: "header";
}

export interface FormDataParameter extends QueryParameter {
  in: "formData";
}

// Responses Object
export interface Responses {
  [statusCode: string]: ResponseObject | undefined;
}

// Response Object
export interface ResponseObject {
  description: string;
  schema?: SchemaObject;
  headers?: HeadersObject;
  examples?: ExampleObject;
}

// Headers Object
export interface HeadersObject {
  [headerName: string]: HeaderObject;
}

export interface HeaderObject {
  type: string;
  format?: string;
}

// Example Object
export interface ExampleObject {
  [mimeType: string]: any;
}

// Definitions Object
export interface DefinitionsObject {
  [definitionName: string]: SchemaObject;
}

// Schema Object
export interface SchemaObject {
  $ref?: string;
  format?: string;
  title?: string;
  description?: string;
  default?: any;
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: boolean;
  minimum?: number;
  exclusiveMinimum?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  required?: string[];
  enum?: any[];
  type?: string | string[];
  items?: SchemaObject | SchemaObject[];
  allOf?: SchemaObject[];
  properties?: {
    [propertyName: string]: SchemaObject;
  };
  additionalProperties?: SchemaObject | boolean;
}

// Items Object
export interface ItemsObject {
  type: string;
  format?: string;
  items?: ItemsObject;
  collectionFormat?: string;
  default?: any;
}

// Parameters Definitions Object
export interface ParametersDefinitionsObject {
  [parameterName: string]: Parameter;
}

// Responses Definitions Object
export interface ResponsesDefinitionsObject {
  [responseName: string]: ResponseObject;
}

// Security Definitions Object
export interface SecurityDefinitionsObject {
  [securityName: string]: SecuritySchemeObject;
}

// Security Scheme Object
export interface SecuritySchemeObject {
  type: string;
  description?: string;
  name?: string;
  in?: string;
  flow?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  scopes?: { [scopeName: string]: string };
}

// Security Requirement
export interface SecurityRequirement {
  [securityName: string]: string[];
}

// Tag Object
export interface TagObject {
  name: string;
  description?: string;
  externalDocs?: ExternalDocumentation;
}

// Swagger 2.0 Root Object
export interface SwaggerJson {
  swagger: "2.0";
  info: Info;
  host?: string;
  basePath?: string;
  schemes?: string[]; // e.g., ["http", "https"]
  consumes?: string[];
  produces?: string[];
  paths: Paths;
  definitions?: DefinitionsObject;
  parameters?: ParametersDefinitionsObject;
  responses?: ResponsesDefinitionsObject;
  security?: SecurityRequirement[];
  securityDefinitions?: SecurityDefinitionsObject;
  tags?: TagObject[];
  externalDocs?: ExternalDocumentation;
}

export class Swagger_2_x implements IOpenApiVersionAdapter {
  public static VERSION: string = "2."; // OpenAPI version

  public static isvalid(spec: SwaggerJson): boolean {
    return spec.swagger?.startsWith(Swagger_2_x.VERSION);
  }

  constructor(
    private readonly spec: SwaggerJson
  ) {
    if (!Swagger_2_x.isvalid(spec)) {
      throw new Error(`Invalid OpenAPI version: ${spec.info.version}`);
    }
  }

  public getBasePath() {
    return this.spec.host && this.spec.schemes.length > 0
      ? `${this.spec.schemes[0]}://${this.spec.host}${this.spec.basePath}`
      : null;
  }

  public getEndpoints(): ApiEndpoint[] {
    return Object.entries(this.spec.paths).flatMap(([path, pathItem]) =>
      Object.entries(pathItem).map(([method, operation]) => {
        return new ApiEndpoint(path, method, operation, new SchemaResolver(this.spec.definitions));
      })
    );
  }
}
