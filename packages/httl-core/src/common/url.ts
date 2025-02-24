export interface HttlUrlParams {
  protocol?: string;
  auth?: string;
  host?: string;
  port?: number;
  path?: string;
  query?: string;
  fragment?: string;
  isAbsolute: boolean;
}

export class HttlUrl {
  public static readonly INVALID = new HttlUrl({ isAbsolute: false });
  private static readonly urlRegex =
    /^(?:(?<protocol>https?):\/\/)?(?:(?:(?<auth>[\w.-]+(?::[^@]*)?)@)?(?<host>(?:\[[0-9a-fA-F:]+\])|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:[a-zA-Z0-9.-]+))?(?::(?<port>\d{0,5}))?)?(?<path>\/[^\s?#]*)?(?:\?(?<query>[^#\s]+))?(?:#(?<fragment>[^\s]+))?$/;

  public static parse(rawUrl: string): HttlUrl {
    try {
      const match = rawUrl.trim().match(this.urlRegex);
      if (!match) {
        return HttlUrl.INVALID;
      }

      let { protocol, auth, host, port: portStr, path, query, fragment } = match.groups

      const isAbsolute = host !== undefined || portStr !== undefined;
      if (isAbsolute) {
        host ??= 'localhost';

        protocol ??= (
          host.toLowerCase() === 'localhost' ||
          host === '127.0.0.1' ||
          host === '[::1]'
        )
          ? 'http'
          : 'https';

        const port = portStr ? parseInt(portStr, 10) : null;

        return new HttlUrl({ protocol, auth, host, port, path, query, fragment, isAbsolute });
      } else {
        return new HttlUrl({ path, query, fragment, isAbsolute });
      }
    } catch (error) {
      return HttlUrl.INVALID;
    }
  }

  public readonly origin: string;
  public readonly protocol: string;
  public readonly hostname: string;
  public readonly port: number;
  public readonly path: string;

  public readonly fullUrl: string;
  public readonly isAbsolute: boolean;

  constructor(
    { protocol, auth, host, port, path, query, fragment, isAbsolute }: HttlUrlParams
  ) {
    this.isAbsolute = isAbsolute;

    let pathSegment = path ?? '';
    if (query) pathSegment += `?${query}`;
    if (fragment) pathSegment += `#${fragment}`;

    this.path = pathSegment ? pathSegment : null

    if (isAbsolute) {
      this.protocol = protocol;
      this.port = port;
      this.hostname = auth ? `${auth}@${host}` : host;
      const portSegement = port ? `:${port}` : '';
      this.origin = `${protocol}://${this.hostname}${portSegement}`;
      this.fullUrl = `${this.origin}${pathSegment}`;
    } else {
      this.protocol = null;
      this.port = null;
      this.hostname = null;
      this.fullUrl = pathSegment;
    }
  }

  public join(url: HttlUrl): HttlUrl {
    // Can't join to non-absolute urls
    if (!this.isAbsolute) {
      return HttlUrl.INVALID;
    }

    // Can't join absolute urls
    if (url.isAbsolute) {
      return HttlUrl.INVALID;
    }

    const fixedParts = [this.fullUrl, url.fullUrl].map(part => part.replace(/^\/|\/$/g, ""));

    return HttlUrl.parse(fixedParts.join("/"));
  }

  public toNodeUrl() {
    return new URL(this.fullUrl);
  }
}