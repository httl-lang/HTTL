import { ApiEndpoint } from "./api-endpoint";

export interface IApiInfo {
  title: string;
  version: string;
  description: string;
  termsOfService: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
}

export interface IOpenApiVersionAdapter {
  getRaw(): object;
  getBasePath(): string;
  getApiInfo(): IApiInfo;
  getEndpoints(): ApiEndpoint[];
}