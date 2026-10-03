import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = (await req.json()) as any;
  
  if (body.token === 'MAR9115COS') {
    const cookieStore = await cookies();
    cookieStore.set('auth-token', body.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
