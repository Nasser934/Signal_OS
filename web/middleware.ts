import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/timeline') ||
    pathname.startsWith('/creators') ||
    pathname.startsWith('/hashtags') ||
    pathname.startsWith('/topics') ||
    pathname.startsWith('/sentiment') ||
    pathname.startsWith('/forecast') ||
    pathname.startsWith('/insights') ||
    pathname.startsWith('/reports') ||
    pathname.startsWith('/draft') ||
    pathname.startsWith('/account-import') ||
    pathname.startsWith('/publish') ||
    pathname.startsWith('/command-center') ||
    pathname.startsWith('/reply-assistant') ||
    pathname.startsWith('/autopsy') ||
    pathname.startsWith('/weekly-report') ||
    pathname.startsWith('/settings')
  );
}

export function middleware(req: NextRequest) {
  const refreshedResponse = updateSession(req);

  if (!isProtectedPath(req.nextUrl.pathname)) {
    return refreshedResponse;
  }

  if (process.env.APP_MODE !== 'production') {
    return refreshedResponse;
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

  return refreshedResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|signal-os).*)'],
};
