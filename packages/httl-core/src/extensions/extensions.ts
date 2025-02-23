import { HttlUrl } from "../common/url";
import { ApiSpec } from "./api-spec/api-spec";

export type ApplicableType = 'api' | 'request';

export interface IExtension {
  applicable: ApplicableType | ApplicableType[];
  call: (...args: string[]) => Promise<any>;
}

export const extensions: Record<string, IExtension> = {
  base: {
    applicable: 'api',
    call: async (url: string) => {
      // Validate
      new URL(url);

      return {
        baseUrl: url,
      }
    }
  },
  "auth-basic": {
    applicable: ['request', 'api'],
    call: async (username: string, password: string) => {
      const str = `${username}:${password}`;
      const uint8Array = new TextEncoder().encode(str);
      const hash = btoa(String.fromCharCode(...uint8Array));

      return {
        headers: {
          Authorization: `Basic ${hash}`
        },
      }
    }
  },
  spec: {
    applicable: 'api',
    call: async (url: string) => {
      const apiSpec = await ApiSpec.fromUrl(HttlUrl.parse(url));

      return {
        baseUrl: apiSpec.getBasePath(),
        spec: apiSpec,
      }
    }
  },
}