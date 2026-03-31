import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // 1. Log request performance (simple version)
  const startTime = Date.now();
  
  const response = NextResponse.next();
  
  // 2. Add security headers (Secure endpoints)
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Monitor performance: log response time for gateway routes
  if (request.nextUrl.pathname.startsWith('/api/gateway')) {
    const duration = Date.now() - startTime;
    console.log(`[GATEWAY MONITOR] ${request.method} ${request.nextUrl.pathname} took ${duration}ms`);
    response.headers.set('X-Response-Time', `${duration}ms`);
  }

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/api/:path*',
};
