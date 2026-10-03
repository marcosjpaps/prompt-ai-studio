import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const url = request.nextUrl.clone();
  
  // Only protect the frontend routes, not API or login
  if (!url.pathname.startsWith('/login') && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/_next') && !url.pathname.startsWith('/favicon.ico')) {
    if (token !== 'MAR9115COS') {
      url.pathname = '/login';
      url.searchParams.set('return_to', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
