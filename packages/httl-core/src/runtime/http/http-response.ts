import type http from 'http';
import FormData from 'form-data';
import { HttpEventTimes } from './http-timings';
import { TokenRange, TokenSource } from '../../common';

export interface HttpRequestMessage {
  method: string;
  url: string;
  headers: object;
  body: string | FormData;
}

export interface HttpResponseMessage {
  headers: [string, string][];
  data: string;
  size: HttpSize;
}

export enum HttpWarningCode {
  SELF_SIGNED_CERTIFICATE = 'SELF_SIGNED_CERTIFICATE',
}

export interface HttpWarning {
  code: HttpWarningCode;
  message: string;
}

const utf8ByteLength = (value: string): number => new TextEncoder().encode(value).length;

export class HttpSize {
  public static sizeOf({ headers, data }: { headers: string[], data: string }) {
    const headersSize = headers.reduce((acc, curr) => acc + utf8ByteLength(curr), 0);
    const dataSize = data ? utf8ByteLength(data) : 0;

    const totalSize = headersSize + dataSize;
    const totalFormated = totalSize < 1024
      ? `${totalSize} bytes`
      : totalSize < 1024 * 1024
        ? `${Math.round(totalSize / 1024)} KB`
        : `${Math.round(totalSize / (1024 * 1024))} MB`;

    return new HttpSize(headersSize, dataSize, totalFormated);
  }

  constructor(
    public readonly headers: number,
    public readonly data: number,
    public readonly totalFormatted: string,
  ) { }

}

export class HttpResponse {
  public static ok(res: http.IncomingMessage, data: string, req: http.ClientRequest, body: string | FormData, timings: HttpEventTimes, warnings: HttpWarning[]): HttpResponse {

    const resHeaders = res.rawHeaders.reduce((acc, curr, idx) => {
      if (idx % 2 === 0) {
        acc.push([curr, res.rawHeaders[idx + 1]]);
      }
      return acc;
    }, []).toSorted((a, b) => a[0].localeCompare(b[0]));

    const defaultPorts = {
      "http:": 80,
      "https:": 443,
    };

    const response = new HttpResponse();
    Object.assign(response, {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      httpVersion: res.httpVersion,
      warnings,

      req: {
        method: req.method,
        url: `${req.protocol}//${req.host}${req.socket.remotePort !== defaultPorts[req.protocol] ? (':' + req.socket.remotePort) : ''}${req.path}`,
        headers: req.getHeaders(),
        body,
      },

      res: {
        headers: resHeaders,
        data,
        size: HttpSize.sizeOf({ headers: res.rawHeaders, data }),
      },

      timings,
    });

    return response;
  }

  public static fromFetch(input: {
    requestUrl: string;
    requestMethod: string;
    requestHeaders: object;
    requestBody: string | undefined;
    status: number;
    statusText: string;
    responseHeaders: [string, string][];
    data: string;
    totalMs: number;
  }): HttpResponse {
    const response = new HttpResponse();

    const sortedHeaders = [...input.responseHeaders]
      .sort((a, b) => a[0].localeCompare(b[0]));

    Object.assign(response, {
      statusCode: input.status,
      statusMessage: input.statusText,
      httpVersion: '1.1',
      warnings: [],

      req: {
        method: input.requestMethod,
        url: input.requestUrl,
        headers: input.requestHeaders,
        body: input.requestBody,
      },

      res: {
        headers: sortedHeaders,
        data: input.data,
        size: HttpSize.sizeOf({
          headers: input.responseHeaders.flat(),
          data: input.data,
        }),
      },

      timings: {
        dnsLookup: undefined,
        tcpConnection: undefined,
        tlsHandshake: undefined,
        firstByte: undefined,
        contentTransfer: undefined,
        total: input.totalMs,
        totalFormatted: input.totalMs.toFixed(2),
      },
    });

    return response;
  }

  public static error(error: Error | string, req?: http.ClientRequest, body?: string | FormData, timings?: HttpEventTimes): HttpResponse {
    const response = new HttpResponse();
    Object.assign(response, {
      error,
      timings,
    });

    if (req) {
      Object.assign(response, {
        req: {
          method: req.method,
          url: req.path,
          headers: req.getHeaders(),
          body,
        },
      });
    }

    return response;
  }


  public readonly statusCode: number;
  public readonly statusMessage: string;
  public readonly httpVersion: string;

  public readonly req: HttpRequestMessage;
  public readonly res: HttpResponseMessage;
  public readonly timings: HttpEventTimes;

  public readonly error: Error | string;
  public readonly warnings: HttpWarning[] = [];

  public source?: TokenSource;

  private constructor() { }

  public isError(): boolean {
    return this.error !== undefined;
  }

  public get isSelfSignedCertError(): boolean {
    const error = this.error as any;
    return error?.code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
      error?.code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
      error?.message?.includes('self signed certificate')
  }
}
