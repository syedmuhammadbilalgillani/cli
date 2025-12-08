import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

const rateLimitStore = new LRUCache<string, { count: number; resetTime: number }>({
  max: 50000,
  ttl: 120000,
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

  record.count++;
  console.log(`[Rate Limit] Request allowed for key: ${key}, count: ${record.count}/${limit}`);
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

// --- NEW HELPERS ---

function normalizeIp(ip: string): string {
  if (!ip) return 'unknown';
  if (ip.startsWith('::ffff:')) return ip.slice(7); // ::ffff:127.0.0.1 -> 127.0.0.1
  if (ip === '::1') return '127.0.0.1';
  return ip;
}

function isPrivateIp(ip: string): boolean {
  if (ip === '127.0.0.1' || ip === 'unknown') return true;
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;

  // 172.16.0.0 – 172.31.255.255
  if (ip.startsWith('172.')) {
    const second = parseInt(ip.split('.')[1] || '0', 10);
    if (second >= 16 && second <= 31) return true;
  }

  return false;
}

function isBot(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return /bot|crawler|spider|crawl|slurp|bingpreview|facebookexternalhit|pinterest|embedly|quora link preview|flipboardproxy|whatsapp|telegrambot|discordbot/.test(
    ua
  );
}

function getIdentifier(request: NextRequest): {
  ip: string;
  isInternal: boolean;
  userAgent: string;
} {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const rawIp =
    forwarded?.split(',')[0]?.trim() ||
    realIp ||
    cfConnectingIp ||
    // @ts-ignore: NextRequest.ip is available in Node runtime
    (request as any).ip ||
    '';

  const ip = normalizeIp(rawIp);
  const isInternal = isPrivateIp(ip);
  const userAgent = request.headers.get('user-agent') || '';

  if (ip === 'unknown') {
    console.warn('[Rate Limit] Could not determine IP address, using "unknown"');
  }

  return { ip, isInternal, userAgent };
}

// --- MIDDLEWARE ---

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // Skip static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff|woff2)$/)
  ) {
    console.log(`[Rate Limit] Skipping rate limit for static asset: ${pathname}`);
    return NextResponse.next();
  }

  const isSitemap = pathname.includes('sitemap');
  const isApiRoute =
    pathname.startsWith('/api') ||
    pathname.includes('route') ||
    isSitemap;

  const { ip, isInternal, userAgent } = getIdentifier(request);
  const bot = isBot(userAgent);

  // Optional: skip internal traffic (your own server, health checks, etc.)
  if (isInternal) {
    console.log(
      `[Rate Limit] Skipping rate limit for internal traffic | IP: ${ip} | Path: ${pathname}`
    );
    return NextResponse.next();
  }

  // Rate limit configuration
  let limit: number;
  let windowMs: number;
  let routeType: string;

  if (isSitemap) {
    // Typically mostly bots (Google, Bing, etc.)
    limit = bot ? 120 : 30;   // example: bots get more headroom
    windowMs = 60000;
    routeType = bot ? 'sitemap-bot' : 'sitemap';
  } else if (isApiRoute) {
    limit = bot ? 20 : 30;
    windowMs = 60000;
    routeType = bot ? 'api-bot' : 'api';
  } else {
    limit = bot ? 40 : 100;   // pages: bots lower than real users
    windowMs = 60000;
    routeType = bot ? 'page-bot' : 'page';
  }

  console.log(
    `[Rate Limit] Processing ${method} ${pathname} | IP: ${ip} | UA: ${userAgent} | Type: ${routeType} | Limit: ${limit}/min`
  );

  // You can keep per-path keys, or simplify to per-IP+type:
  // const routeKey = `${ip}:${routeType}`;
  const routeKey = `${ip}:${routeType}:${pathname}`;
  const result = checkRateLimit(routeKey, limit, windowMs);

  const response = result.success
    ? NextResponse.next()
    : NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
          },
        }
      );

  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString());

  const processingTime = Date.now() - startTime;

  if (!result.success) {
    console.error(
      `[Rate Limit Exceeded] ` +
        `IP: ${ip} | ` +
        `Bot: ${bot} | ` +
        `Path: ${pathname} | ` +
        `Method: ${method} | ` +
        `Limit: ${result.limit} | ` +
        `Reset: ${new Date(result.reset).toISOString()} | ` +
        `Processing Time: ${processingTime}ms`
    );
  } else {
    console.log(
      `[Rate Limit] Request allowed | ` +
        `IP: ${ip} | ` +
        `Bot: ${bot} | ` +
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
