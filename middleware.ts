// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

// Rate limit store with automatic cleanup
const rateLimitStore = new LRUCache<string, { count: number; resetTime: number }>({
  max: 50000, // Maximum number of IPs to track
  ttl: 120000, // 2 minutes TTL (longer than rate limit window)
  updateAgeOnGet: false,
  updateAgeOnHas: false,
});

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    console.log(`[Rate Limit] New rate limit entry created for key: ${key}`);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (record.count >= limit) {
    console.warn(`[Rate Limit] Limit exceeded for key: ${key}, count: ${record.count}/${limit}`);
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  // Increment count
  record.count++;
  console.log(`[Rate Limit] Request allowed for key: ${key}, count: ${record.count}/${limit}`);
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

function getIdentifier(request: NextRequest): string {
  // Get IP from headers (works with proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const ip = 
    forwarded?.split(',')[0]?.trim() || 
    realIp || 
    cfConnectingIp || 
    'unknown';
  
  // Log IP detection for debugging
  if (ip === 'unknown') {
    console.warn('[Rate Limit] Could not determine IP address, using "unknown"');
  }
  
  return ip;
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // Skip rate limiting for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/favicon.ico') ||
    request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff|woff2)$/)
  ) {
    console.log(`[Rate Limit] Skipping rate limit for static asset: ${pathname}`);
    return NextResponse.next();
  }

  // Identify route type
  const isSitemap = request.nextUrl.pathname.includes('sitemap');
  const isApiRoute = 
    request.nextUrl.pathname.startsWith('/api') || 
    request.nextUrl.pathname.includes('route') ||
    isSitemap;

  const identifier = getIdentifier(request);
  
  // Configure rate limits
  let limit: number;
  let windowMs: number;
  let routeType: string;

  if (isSitemap) {
    limit = 10; // 10 requests per minute for sitemaps
    windowMs = 60000;
    routeType = 'sitemap';
  } else if (isApiRoute) {
    limit = 30; // 30 requests per minute for API routes
    windowMs = 60000;
    routeType = 'api';
  } else {
    limit = 100; // 100 requests per minute for pages
    windowMs = 60000;
    routeType = 'page';
  }

  console.log(`[Rate Limit] Processing ${method} ${pathname} | IP: ${identifier} | Type: ${routeType} | Limit: ${limit}/min`);

  const routeKey = `${identifier}:${isApiRoute ? 'api' : 'page'}:${request.nextUrl.pathname}`;
  const result = checkRateLimit(routeKey, limit, windowMs);

  const response = result.success
    ? NextResponse.next()
    : NextResponse.json(
        { 
          error: 'Too many requests', 
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString()
          }
        }
      );

  // Add rate limit headers (useful for debugging)
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());

  const processingTime = Date.now() - startTime;

  if (!result.success) {
    // Log violations with detailed information
    console.error(
      `[Rate Limit Exceeded] ` +
      `IP: ${identifier} | ` +
      `Path: ${pathname} | ` +
      `Method: ${method} | ` +
      `Limit: ${result.limit} | ` +
      `Reset: ${new Date(result.reset).toISOString()} | ` +
      `Processing Time: ${processingTime}ms`
    );
  } else {
    console.log(
      `[Rate Limit] Request allowed | ` +
      `IP: ${identifier} | ` +
      `Path: ${pathname} | ` +
      `Remaining: ${result.remaining}/${result.limit} | ` +
      `Processing Time: ${processingTime}ms`
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|woff|woff2)$).*)',
  ],
};