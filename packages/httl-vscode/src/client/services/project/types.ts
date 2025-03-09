
export interface HttlProjectFileInfo {
  name: string;
  path: string;
}

export interface OpenApiSpecImport {
  name: string;
  specUrl: string;
}

export type HttlProjectItem = HttlProjectFileInfo | OpenApiSpecImport;

export interface HttlProjectScript {
  id: string;
  name: string;
  code: string;
}

export interface HttlProjectProps {
  name: string;
  description: string;
  source: string;
  technologies: string[];
  spec: any;
  prestart: {
    code: string;
  };
  scripts: HttlProjectScript[];
}


export interface HttlProjectViewData {
  fileInfo: HttlProjectFileInfo
  description: string;
  source: string;
  technologies: string[];
  prestart: string;

  endpoints: HttlProjectApiEndpoint[];
}

export interface HttlProjectApiEndpoint {
  method: string;
  path: string;
  scripts: HttlProjectScript[];
}
