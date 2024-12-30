import http from 'http';
import https from 'https';
import FormData from 'form-data';

import { constants } from '../../common/constants';
import { HttpTimings } from './http-timings';
import { HttpResponse } from './http-response';

export interface HttpRequestOptions {
  method: string;
  body?: string | FormData;
  headers: http.OutgoingHttpHeaders;
}

export class HttpClient {

  public static request(url: URL | string, options: HttpRequestOptions): Promise<HttpResponse> {
    const finalURL = typeof url === 'string'
      ? new URL(url)
      : url;

    const reqOptions = {
      method: options.method.toUpperCase(),
      protocol: finalURL.protocol,
      headers: {
        ...options.headers,
        'User-Agent': constants.HTTP_AGENT_NAME,
      },
      timeout: constants.DEFAULT_INSTRUCTION_TIMEOUT,
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
            resolve(
              HttpResponse.ok(
                res,
                responseData,
                req,
                textualBodySent,
                timings.getTimings()
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
          // socket.on('timeout', () => {
          //   req.abort()

          //   // const err = new Error('ETIMEDOUT')
          //   // err.code = 'ETIMEDOUT'
          //   // callback(err)
          // })
        });

        req.on('timeout', (e) => {
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
