import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/draft') ||
    pathname.startsWith('/publish') ||
    pathname.startsWith('/command-center') ||
    pathname.startsWith('/reply-assistant') ||
    pathname.startsWith('/autopsy') ||
    pathname.startsWith('/weekly-report') ||
    pathname.startsWith('/settings')
  );
}

export function middleware(req: NextRequest) {
  if (!isProtectedPath(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (process.env.APP_MODE !== 'production') {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get('signalos_session')?.value ??
    req.headers.get('x-signalos-session') ??
    req.cookies.getAll().find((cookie) => cookie.name.startsWith('sb-'))?.value;

  if (!sessionToken) {
    if (req.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
