import { Json, Yaml } from "../../common";
import { HttlUrl } from "../../common/url";
import { HttpClient } from "../../runtime/http";
import { ApiEndpoint } from "./api-endpoint";
import { IApiInfo, IOpenApiVersionAdapter } from "./api-version-adapter";
import { OpenAPI_3_x } from "./versions/open-api_3_x";
import { Swagger_2_x } from "./versions/swagger_2_x";

export interface IApiEndpointFilter {
  path?: string,
  method?: string,
}

export class ApiSpec {

  public static async fromUrl(url: HttlUrl): Promise<ApiSpec> {
    const response = await HttpClient.request(url, { method: 'GET', headers: {}, rejectUnauthorized: false });
    if (response.statusCode !== 200) {
      throw new Error('Failed to fetch spec');
    }

    if (!response.res.data) {
      throw new Error('Empty spec');
    }

    return this.fromString(response.res.data, url);
  }

  public static fromString(data: string, url: HttlUrl): ApiSpec {
    let specRes = Yaml.isYaml(data)
      ? Yaml.safeParse(data)
      : Json.safeParse(data);

    if (specRes.isErr()) {
      throw new Error('Failed to parse spec');
    }

    return ApiSpec.fromSpec(specRes.unwrap(), url);
  }

  public static fromSpec(specJson: any, url: HttlUrl): ApiSpec {
    const spec = ApiSpec.parseSpec(specJson);
    return new ApiSpec(url, spec);
  }

  public static parseSpec(json: any) {
    if (OpenAPI_3_x.isvalid(json))
      return new OpenAPI_3_x(json);

    if (Swagger_2_x.isvalid(json))
      return new Swagger_2_x(json);

    throw new Error('Unsupported OpenAPI version');
  }

  private readonly endpoints: ApiEndpoint[] = [];

  private constructor(
    private readonly specUrl: HttlUrl,
    private readonly spec: IOpenApiVersionAdapter
  ) {

    this.endpoints = spec.getEndpoints();
  }

  public getApiInfo(): IApiInfo {
    return this.spec.getApiInfo();
  }

  public getRaw(): object {
    return this.spec.getRaw();
  }

  public getBasePath(): HttlUrl {
    return HttlUrl.parse(this.spec.getBasePath() || this.specUrl.origin);
  }

  public getEndpoints(filter?: IApiEndpointFilter): ApiEndpoint[] {
    return this.endpoints.filter(endpoint => {
      if (filter === undefined) {
        return true;
      }

      return (
        (!filter.method || endpoint.method === filter.method) &&
        (!filter.path || endpoint.path.toLocaleLowerCase().includes(filter.path.toLocaleLowerCase()))
      )
    });
  }
}