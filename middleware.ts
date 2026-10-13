import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {SESSION_COOKIE, verifySessionToken} from './lib/studio-auth';

export async function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;
  if (pathname.startsWith('/api/') || pathname === '/login' || pathname.startsWith('/_next/') || pathname === '/favicon.ico' || pathname === '/favicon.svg') {
    return NextResponse.next();
  }
  const valid = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (valid) return NextResponse.next();
  const url = new URL('/login', request.url);
  url.searchParams.set('return_to', pathname);
  return NextResponse.redirect(url);
}
export const config = {matcher:['/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)']};
