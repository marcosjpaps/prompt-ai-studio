import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/studio-auth';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url), 303);
  response.cookies.set(SESSION_COOKIE, '', {path:'/',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:0});
  response.cookies.set('auth-token', '', {path:'/',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:0});
  response.cookies.set('chatgpt_session', '', {path:'/',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:0});
  return response;
}
