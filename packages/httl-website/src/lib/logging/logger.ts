export interface LogEntry {
  ip: string;
  method: string;
  url: string;
  status?: number;
  userAgent: string;
}

/**
 * Extracts client IP from DigitalOcean App Platform proxy headers
 * Priority: X-Forwarded-For (first IP) > X-Real-IP > fallback
 */
export function getClientIP(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIP = forwardedFor.split(',')[0].trim();
    if (firstIP) return firstIP;
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) return realIP;

  return '0.0.0.0';
}

/**
 * Formats log entry as: [IP] [METHOD] [URL] [STATUS]; [User-Agent]
 */
export function formatLogEntry(entry: LogEntry): string {
  const status = entry.status ?? '-';
  return `[${entry.ip}] ${entry.method} ${entry.url} - ${status}; ${entry.userAgent}`;
}

/**
 * Writes log entry to stdout (DigitalOcean captures this)
 */
export function log(entry: LogEntry): void {
  console.log(formatLogEntry(entry));
}

/**
 * Static asset patterns to exclude from logging
 */
const STATIC_ASSET_PATTERNS = [
  /^\/_next\//,
  /^\/favicon\.ico$/,
  /^\/favicon\.svg$/,
  /\.(ico|png|jpg|jpeg|gif|svg|webp|avif)$/i,
  /\.(woff|woff2|ttf|otf|eot)$/i,
  /\.(css|js|map)$/i,
  /^\/images\//,
  /^\/videos\//,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
];

/**
 * Checks if a pathname should be excluded from logging
 */
export function shouldSkipLogging(pathname: string): boolean {
  return STATIC_ASSET_PATTERNS.some(pattern => pattern.test(pathname));
}
