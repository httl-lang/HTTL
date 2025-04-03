import { ApiEndpoint } from "../api-endpoint";
import { IApiInfo, IOpenApiVersionAdapter } from "../api-version-adapter";
import { SchemaResolver } from "../schema-resolver";

export type HTTPMethod = "get" | "post" | "put" | "delete" | "patch" | "head" | "options" | "trace";

export interface Info {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
  version: string;
}

export interface Server {
  url: string;
  description?: string;
  variables?: Record<string, {
    default: string;
    description?: string;
    enum?: string[];
  }>;
}

export type MethodOperations = {
  [method in HTTPMethod]?: Operation;
};

export interface PathItem extends MethodOperations {
  summary?: string;
  description?: string;
  servers?: Server[];
  parameters?: Parameter[];
}

export interface Parameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: Schema;
}

export interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
  callbacks?: Record<string, PathItem>;
  deprecated?: boolean;
  security?: SecurityRequirement[];
  servers?: Server[];
}

export interface RequestBody {
  description?: string;
  content: Record<string, MediaType>;
  required?: boolean;
}

export interface MediaType {
  schema?: Schema;
  examples?: Record<string, Example>;
  example?: any;
}

export interface Response {
  description: string;
  headers?: Record<string, Header>;
  content?: Record<string, MediaType>;
  links?: Record<string, Link>;
}

export interface Header {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: Schema;
}

export interface Link {
  operationId?: string;
  parameters?: Record<string, any>;
  requestBody?: any;
  description?: string;
}

export interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  enum?: any[];
  required?: string[];
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  not?: Schema;
  description?: string;
  format?: string;
}

export interface Example {
  summary?: string;
  description?: string;
  value?: any;
  externalValue?: string;
}

export interface SecurityRequirement {
  [name: string]: string[];
}

export interface Components {
  schemas?: Record<string, Schema>;
  responses?: Record<string, Response>;
  parameters?: Record<string, Parameter>;
  requestBodies?: Record<string, RequestBody>;
  headers?: Record<string, Header>;
  securitySchemes?: Record<string, SecurityScheme>;
  links?: Record<string, Link>;
  callbacks?: Record<string, PathItem>;
}

export interface SecurityScheme {
  type: "apiKey" | "http" | "oauth2" | "openIdConnect";
  description?: string;
  name?: string; // Used for "apiKey"
  in?: "query" | "header" | "cookie"; // Used for "apiKey"
  scheme?: string; // Used for "http"
  bearerFormat?: string; // Used for "http"
  flows?: {
    implicit?: OAuthFlow;
    password?: OAuthFlow;
    clientCredentials?: OAuthFlow;
    authorizationCode?: OAuthFlow;
  };
  openIdConnectUrl?: string; // Used for "openIdConnect"
}

export interface OAuthFlow {
  authorizationUrl?: string;
  tokenUrl?: string;
  refreshUrl?: string;
  scopes: Record<string, string>;
}

export interface OpenAPIJson {
  openapi: string;
  info: Info;
  servers?: Server[];
  paths: Record<string, PathItem>;
  components?: Components;
  security?: SecurityRequirement[];
  tags?: { name: string; description?: string }[];
  externalDocs?: { description?: string; url: string };
}

export class OpenAPI_3_x implements IOpenApiVersionAdapter {
  public static VERSION: string = "3."; // OpenAPI version

  public static isvalid(data: OpenAPIJson): boolean {
    return data.openapi?.startsWith(OpenAPI_3_x.VERSION);
  }

  constructor(
    private readonly spec: OpenAPIJson
  ) {
    if (!OpenAPI_3_x.isvalid(spec)) {
      throw new Error(`Invalid OpenAPI version: ${spec.info.version}`);
    }
  }

  public getRaw(): object {
    return this.spec;
  }

  public getApiInfo(): IApiInfo {
    return {
      title: this.spec.info.title,
      version: this.spec.info.version,
      description: this.spec.info.description,
      termsOfService: this.spec.info.termsOfService,
      contact: this.spec.info.contact,
      license: this.spec.info.license,
    };
  }

  public getBasePath() {
    // TODO: handle multiple servers
    return this.spec.servers?.[0]?.url;
  }

  public getEndpoints(): ApiEndpoint[] {
    return Object.entries(this.spec.paths).flatMap(([path, pathItem]) =>
      Object.entries(pathItem).map(([method, operation]) => {
        return new ApiEndpoint(path, method, operation, new SchemaResolver(this.spec.components));
      })
    );
  }
}
