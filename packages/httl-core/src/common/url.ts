export interface HttlUrlParams {
  protocol: string;
  auth?: string;
  host: string;
  port?: number;
  path?: string;
  query?: string;
  fragment?: string;
}

export class HttlUrl {
  private static readonly urlRegex = /^(?:(?<protocol>https?):\/\/)?(?:(?:(?<auth>[\w.-]+(?::[^@]*)?)@)?(?<host>(?:\[[0-9a-fA-F:]+\])|(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})|(?:[a-zA-Z0-9.-]+))?(?::(?<port>\d{1,5}))?)?(?<path>\/[^\s?#]*)?(?:\?(?<query>[^#\s]+))?(?:#(?<fragment>[^\s]+))?$/;

  public static parse(rawUrl: string): HttlUrl {
    const { groups } = rawUrl.trim().match(this.urlRegex);

    let { protocol, auth, host, port: portStr, path, query, fragment } = groups

    host ??= 'localhost';

    protocol ??= (
      host.toLowerCase() === 'localhost' ||
      host === '127.0.0.1' ||
      host === '[::1]'
    )
      ? 'http'
      : 'https';

    const port = portStr ? parseInt(portStr, 10) : null;

    return new HttlUrl({ protocol, auth, host, port, path, query, fragment });

    // let protocol = null;
    // let hostname = null;
    // let port = null;
    // let path = null;

    // let urlString = rawUrl.trim();

    // // Handle protocol
    // if (rawUrl.includes('://')) {
    //   const [protocolPart, ...rest] = rawUrl.split('://');
    //   protocol = protocolPart;
    //   urlString = rest.join('://');
    // }

    // // Handle path
    // if (urlString.includes('/')) {
    //   const [hostPart, ...pathParts] = urlString.split('/');
    //   urlString = hostPart;
    //   path = '/' + pathParts.join('/');
    // } else if (urlString.includes('?')) {
    //   const [hostPart, ...pathParts] = urlString.split('?');
    //   urlString = hostPart;
    //   path = '?' + pathParts.join('?');
    // }

    // if (urlString.startsWith('[')) {
    //   const [hostPart, ...pathParts] = urlString.split(']');
    //   hostname = hostPart + ']';
    //   urlString = pathParts.join(']');
    // }

    // // Handle port
    // if (urlString.includes(':')) {
    //   const [hostPart, portPart] = urlString.split(':');
    //   if (hostPart) hostname = hostPart;
    //   port = parseInt(portPart, 10);
    // } else if (urlString && !hostname) {
    //   hostname = urlString;
    // }

    // hostname ??= "localhost"

    // if (!protocol) {
    //   protocol = (
    //     hostname.toLowerCase().startsWith('localhost') ||
    //     hostname.toLowerCase().startsWith('127.0.0.1') ||
    //     hostname.toLowerCase().startsWith('[::1]')
    //   )
    //     ? 'http'
    //     : 'https';
    // }

    // return new HttlUrl(protocol, hostname, port, path);
  }

  public readonly fullUrl: URL;
  public readonly protocol: string;
  public readonly hostname: string;
  public readonly port: number;
  public readonly path: string;

  constructor(
    { protocol, auth, host, port, path, query, fragment }: HttlUrlParams
  ) {

    this.protocol = protocol;
    this.port = port;
    this.hostname = auth ? `${auth}@${host}` : host;
    let pathSegment = path ?? '';
    if (query) pathSegment += `?${query}`;
    if (fragment) pathSegment += `#${fragment}`;

    this.path = pathSegment ? pathSegment : null
    const portSegement = port ? `:${port}` : '';

    this.fullUrl = new URL(`${protocol}://${this.hostname}${portSegement}${pathSegment}`);
  }
}