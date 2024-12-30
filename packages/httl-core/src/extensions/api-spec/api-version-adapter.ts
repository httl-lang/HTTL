import { ApiEndpoint } from "./api-endpoint";

export interface IOpenApiVersionAdapter {
  getBasePath(): string;
  getEndpoints(): ApiEndpoint[];
}