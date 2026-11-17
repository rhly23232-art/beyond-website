import { NextResponse, type NextRequest } from 'next/server';

/**
 * Protects /admin with HTTP Basic auth (ADMIN_USER / ADMIN_PASSWORD).
 * Without ADMIN_PASSWORD the admin area simply does not exist (404).
 */
export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return new NextResponse('Not found', { status: 404 });

  const user = process.env.ADMIN_USER || 'admin';
  const header = request.headers.get('authorization') ?? '';
  if (header.startsWith('Basic ')) {
    try {
      const [u, ...rest] = atob(header.slice(6)).split(':');
      if (safeEqual(u, user) && safeEqual(rest.join(':'), password)) return NextResponse.next();
    } catch {
      /* malformed header — fall through to the challenge */
    }
  }
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="BEYOND admin", charset="UTF-8"' },
  });
}

function safeEqual(a: string, b: string) {
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
