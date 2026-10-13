import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE } from '@/lib/studio-auth';
import { timingSafeEqual } from 'node:crypto';

export const runtime='nodejs';
const same = (a:string,b:string) => {
  const x=Buffer.from(a),y=Buffer.from(b);
  return x.length===y.length && timingSafeEqual(x,y);
};
export async function POST(request: Request) {
  const origin=request.headers.get('origin');
  if(origin && new URL(origin).host!==new URL(request.url).host) return NextResponse.json({error:'Origem inválida.'},{status:403});
  let body:unknown;
  try {body=await request.json();} catch {return NextResponse.json({error:'Dados de entrada inválidos.'},{status:400});}
  const input=body as {email?:unknown;password?:unknown};
  if(!input || typeof input.email!=='string'||typeof input.password!=='string'||input.email.length>255||input.password.length>200){
    return NextResponse.json({error:'Preencha e-mail e senha.'},{status:400});
  }
  const email=process.env.STUDIO_LOGIN_EMAIL, password=process.env.STUDIO_LOGIN_PASSWORD;
  if (!email || !password || !process.env.STUDIO_SESSION_SECRET) {
    return NextResponse.json({error:'Login ainda não configurado no servidor.'},{status:503});
  }
  if(!same(input.email.trim().toLowerCase(),email.trim().toLowerCase()) || !same(input.password,password)) {
    return NextResponse.json({error:'E-mail ou senha incorretos.'},{status:401});
  }
  const token=await createSessionToken();
  const response=NextResponse.json({success:true},{headers:{'Cache-Control':'no-store'}});
  response.cookies.set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:60*60*24*30});
  response.cookies.set('auth-token','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:0});
  return response;
}
