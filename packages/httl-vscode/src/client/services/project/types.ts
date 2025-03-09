export interface HttlProjectFileInfo {
  name: string;
  path: string;
}

export interface OpenApiSpecImport {
  name: string;
  specUrl: string;
}

export type HttlProjectItem = HttlProjectFileInfo | OpenApiSpecImport;