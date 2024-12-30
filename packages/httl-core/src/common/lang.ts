import * as path from 'path';

export class Lang {
  public static readonly LANG_NAME = 'HTTL';
  public static readonly LANG_ID = 'httl';
  public static readonly DEFAULT_API_NAME = 'default';
  public static readonly ENV_VAR_PREFIX = 'HTTL_VAR_';
  public static readonly FILE_EXTENSION = 'httl';
  public static readonly HTTP_METHODS = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "head",
    "options",
    "connect",
    "trace",
    "lock",
    "unlock",
    "propfind",
    "proppatch",
    "copy",
    "move",
    "mkcol",
    "mkcalendar",
    "acl",
    "search",
  ];

  public static readonly KEYWORDS = [
    'use',
    'as',
    'assert',
    'formdata',
    'urlencoded',
    'bin',
    'raw',
  ];

  private static contentTypes = [
    "application/json",
    "application/xml",
    "application/javascript",
    "application/xhtml+xml",
    "application/octet-stream",
    "application/soap+xml",
    "application/zip",
    "application/gzip",
    "application/x-www-form-urlencoded",
    "image/gif",
    "image/jpeg",
    "image/png",
    "message/http",
    "multipart/form-data",
    "text/css",
    "text/csv",
    "text/html",
    "text/plain",
    "text/xml",
  ]

  public static readonly allHeaders = [
    { header: "Accept", values: ["*/*", ...Lang.contentTypes] },
    { header: "Accept-Charset", values: ["utf-8", "iso-8859-1"] },
    { header: "Accept-Encoding", values: ["gzip", "compress", "deflate", "br"] },
    { header: "Accept-Language", values: ["en-US", "en-GB", "fr", "de"] },
    { header: "Accept-Ranges", values: ["bytes"] },
    { header: "Access-Control-Allow-Credentials", values: ["true", "false"] },
    { header: "Access-Control-Allow-Headers", values: ["Content-Type", "Authorization"] },
    { header: "Access-Control-Allow-Methods", values: ["GET", "POST", "PUT", "DELETE"] },
    { header: "Access-Control-Allow-Origin", values: ["*"] },
    { header: "Access-Control-Expose-Headers", values: ["Content-Length", "X-Kuma-Revision"] },
    { header: "Access-Control-Max-Age", values: ["600"] },
    { header: "Access-Control-Request-Headers", values: ["Content-Type", "Authorization"] },
    { header: "Access-Control-Request-Method", values: ["GET", "POST"] },
    { header: "Age", values: ["0"] },
    { header: "Allow", values: ["GET", "POST", "PUT", "DELETE"] },
    { header: "Authorization", values: ["Basic", "Bearer"] },
    { header: "Cache-Control", values: ["no-cache", "no-store", "must-revalidate"] },
    { header: "Connection", values: ["keep-alive", "close"] },
    { header: "Content-Disposition", values: ["inline", "attachment"] },
    { header: "Content-Encoding", values: ["gzip", "compress", "deflate", "br"] },
    { header: "Content-Language", values: ["en", "fr", "de"] },
    { header: "Content-Length", values: ["0"] },
    { header: "Content-Location", values: [""] },
    { header: "Content-Range", values: ["bytes"] },
    { header: "Content-Security-Policy", values: ["default-src 'self'"] },
    { header: "Content-Security-Policy-Report-Only", values: ["default-src 'self'"] },
    { header: "Content-Type", values: Lang.contentTypes },
    { header: "Cookie", values: [""] },
    { header: "Date", values: [""] },
    { header: "ETag", values: [""] },
    { header: "Expect", values: ["100-continue"] },
    { header: "Expires", values: [""] },
    { header: "Forwarded", values: [""] },
    { header: "From", values: [""] },
    { header: "Host", values: [""] },
    { header: "If-Match", values: [""] },
    { header: "If-Modified-Since", values: [""] },
    { header: "If-None-Match", values: [""] },
    { header: "If-Range", values: [""] },
    { header: "If-Unmodified-Since", values: [""] },
    { header: "Last-Modified", values: [""] },
    { header: "Link", values: [""] },
    { header: "Location", values: [""] },
    { header: "Max-Forwards", values: [""] },
    { header: "Origin", values: [""] },
    { header: "Pragma", values: ["no-cache"] },
    { header: "Proxy-Authenticate", values: [""] },
    { header: "Proxy-Authorization", values: [""] },
    { header: "Range", values: ["bytes"] },
    { header: "Referer", values: [""] },
    { header: "Referrer-Policy", values: ["no-referrer", "no-referrer-when-downgrade"] },
    { header: "Retry-After", values: [""] },
    { header: "Server", values: [""] },
    { header: "Set-Cookie", values: [""] },
    { header: "Strict-Transport-Security", values: ["max-age=31536000; includeSubDomains"] },
    { header: "TE", values: [""] },
    { header: "Trailer", values: [""] },
    { header: "Transfer-Encoding", values: ["chunked"] },
    { header: "User-Agent", values: [""] },
    { header: "Upgrade-Insecure-Requests", values: ["1"] },
    { header: "Vary", values: ["Accept-Encoding"] },
    { header: "Via", values: [""] },
    { header: "WWW-Authenticate", values: ["Basic", "Bearer"] },
    { header: "Warning", values: [""] },
    { header: "X-Content-Type-Options", values: ["nosniff"] },
    { header: "X-DNS-Prefetch-Control", values: ["on", "off"] },
    { header: "X-Forwarded-For", values: [""] },
    { header: "X-Forwarded-Host", values: [""] },
    { header: "X-Forwarded-Proto", values: [""] },
    { header: "X-Frame-Options", values: ["DENY", "SAMEORIGIN"] },
    { header: "X-XSS-Protection", values: ["1; mode=block"] }
  ]


  public static readonly ESCAPES = [
    {
      escapes: ['\\$'],
      symbol: '$'
    }
  ];

  public static replaceEscapes(value: string): string {
    for (const escape of Lang.ESCAPES) {
      escape.escapes.forEach(esc =>
        value = value.replaceAll(esc, escape.symbol)
      );
    }

    return value;
  }

  public static isDefaultHttlFile(filePath: string): boolean {
    return path.basename(filePath).toLowerCase() === `.${this.FILE_EXTENSION}`
  }

  public static checkKeywords(value: string): void {
    if (Lang.KEYWORDS.includes(value.toLowerCase())) {
      throw new Error(`Keyword ${value} is reserved`);
    }
  }
}