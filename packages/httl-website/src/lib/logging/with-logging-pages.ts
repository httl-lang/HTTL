import type { NextApiRequest, NextApiResponse } from 'next';
import { log } from './logger';

type PagesApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => void | Promise<void>;

/**
 * Wraps a Pages Router API handler to log requests with response status
 */
export function withLoggingPages(handler: PagesApiHandler): PagesApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor)
      ? forwardedFor[0].split(',')[0].trim()
      : forwardedFor?.split(',')[0].trim()
        || (req.headers['x-real-ip'] as string)
        || req.socket.remoteAddress
        || '0.0.0.0';

    const method = req.method || 'GET';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const url = `${protocol}://${host}${req.url}`;
    const userAgent = (req.headers['user-agent'] as string) || '-';

    const originalEnd = res.end.bind(res);
    let logged = false;

    res.end = function (...args: Parameters<typeof res.end>) {
      if (!logged) {
        logged = true;
        log({
          ip,
          method,
          url,
          status: res.statusCode,
          userAgent,
        });
      }
      return originalEnd(...args);
    } as typeof res.end;

    try {
      await handler(req, res);
    } catch (error) {
      if (!logged) {
        log({
          ip,
          method,
          url,
          status: 500,
          userAgent,
        });
      }
      throw error;
    }
  };
}
