import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/studio-auth';
export type ChatGPTUser = { userId: string; displayName: string; email: string; fullName: string | null };
export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) return null;
  const email = process.env.STUDIO_LOGIN_EMAIL || '';
  return { userId: email || 'studio-owner', displayName: 'Criador', email, fullName: 'Criador' };
}
export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (user) return user;
  redirect('/login?return_to=' + encodeURIComponent(returnTo));
}
export function chatGPTSignInPath(returnTo: string) {return '/login?return_to=' + encodeURIComponent(returnTo);}
export function chatGPTSignOutPath() {return '/api/logout';}
