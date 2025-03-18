
export interface HttlProjectFileInfo {
  id: string
  name: string;
  path: string;
}

export interface OpenApiSpecImport {
  id: string
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
  id: string;
  method: string;
  path: string;
  tag: string;
  description?: string;
  operationId?: string;
  scripts: HttlProjectScript[];
  hasBodySchema: boolean;
  hasResponseSchema: boolean;
}

export interface UpdateEndpointScriptCode {
  projectFile: string,
  scriptId: string,
  code: string
}

export interface UpdatePrestartScriptCode {
  projectFile: string,
  code: string
}

export interface EndpointScriptId {
  projectFile: string,
  scriptId: string
}