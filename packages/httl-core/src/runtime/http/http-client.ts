import http from 'http';
import https from 'https';
import FormData from 'form-data';
import tls from 'tls';

import { constants } from '../../common/constants';
import { HttpTimings } from './http-timings';
import { HttpResponse, HttpWarning, HttpWarningCode } from './http-response';
import { HttlUrl } from '../../common/url';

export interface HttpRequestOptions {
  method: string;
  body?: string | FormData;
  headers: http.OutgoingHttpHeaders;
}

export class HttpClient {

  public static async request(url: HttlUrl | string, options: HttpRequestOptions): Promise<HttpResponse> {
    const httlUrl = typeof url === 'string'
      ? HttlUrl.parse(url)
      : url;

    const finalURL = httlUrl.toNodeUrl();

    const reqOptions = {
      method: options.method.toUpperCase(),
      protocol: finalURL.protocol,
      family: 4, // IPv4 - (https://github.com/httl-lang/HTTL/issues/10)
      headers: {
        ...options.headers,
        'User-Agent': constants.HTTP_AGENT_NAME,
      },
      timeout: constants.DEFAULT_INSTRUCTION_TIMEOUT,
      // @ts-ignore
      rejectUnauthorized: false,
    } satisfies http.RequestOptions;

    const textualBodySent = options.body instanceof FormData
      ? options.body.getBuffer().toString()
      : options.body;

    return new Promise((resolve, reject) => {
      try {
        // Choose the right client
        const client = reqOptions.protocol.toLowerCase() === 'https:' ? https : http;

        const timings = HttpTimings.start();
        const req = client.request(finalURL, reqOptions, (res) => {
          const warnings: HttpWarning[] = [];

          if (res.socket instanceof tls.TLSSocket) {
            const cert = res.socket.getPeerCertificate();
            if (cert && !!cert.subject?.CN && (cert.subject?.CN === cert.issuer?.CN)) {
              warnings.push({
                message: "Self-signed certificate detected",
                code: HttpWarningCode.SELF_SIGNED_CERTIFICATE,
              });
            }
          }

          let responseData = '';

          res.once('readable', () => {
            timings.setFirstByte();
          })

          res.on('data', (chunk) => {
            responseData += chunk;
          });

          res.on('end', () => {
            timings.end();
          });

          res.on('close', () => {
            client.globalAgent.removeAllListeners();
            resolve(
              HttpResponse.ok(
                res,
                responseData,
                req,
                textualBodySent,
                timings.getTimings(),
                warnings,
              )
            );
          });
        });

        req.on('socket', (socket) => {
          socket.once('lookup', () => {
            timings.setDnsLookup()
          })
          socket.once('connect', () => {
            timings.setTcpConnection()
          })
          socket.once('secureConnect', () => {
            timings.setTlsHandshake()
          })
        });

        req.on('timeout', (e) => {
          client.globalAgent.removeAllListeners();
          reject(
            HttpResponse.error(
              'Request timeout',
              req,
              options.body,
              timings.getTimings()
            )
          );
        });

        req.on('error', (error: any) => {
          client.globalAgent.removeAllListeners();
          timings.end();
          const message = error instanceof AggregateError
            ? error.errors.at(0).message
            : error instanceof Error
              ? error.message
              : 'Request error';

          reject(
            HttpResponse.error(message, req, options.body, timings.getTimings())
          );
        });

        if (options.body) {
          if (options.body instanceof FormData) {
            options.body.pipe(req);
          } else {
            req.write(options.body);
          }
        }

        req.end();
      } catch (error) {
        console.error(error);
        reject(
          HttpResponse.error(error)
        );
      }
    });
  }
}
