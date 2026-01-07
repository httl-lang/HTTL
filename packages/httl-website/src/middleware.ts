import { NextResponse, type NextRequest } from 'next/server';
import { getClientIP, shouldSkipLogging, log } from '@/lib/logging/logger';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (shouldSkipLogging(pathname)) {
    return NextResponse.next();
  }

  const ip = getClientIP(request.headers);
  const method = request.method;
  const url = request.nextUrl.href;
  const userAgent = request.headers.get('user-agent') || '-';

  // For non-API routes (pages), log here with assumed 200 status
  // API routes will be logged by withLogging wrapper with actual status
  if (!pathname.startsWith('/api/')) {
    log({
      ip,
      method,
      url,
      status: 200,
      userAgent,
    });
  }

  // Pass IP via header for API route wrappers
  const response = NextResponse.next();
  response.headers.set('x-client-ip', ip);
  response.headers.set('x-original-user-agent', userAgent);

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)',
  ],
};
