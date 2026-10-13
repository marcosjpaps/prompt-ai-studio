/** Autenticação do estúdio: cookie assinado e validado no servidor/Edge. */
export const SESSION_COOKIE = 'studio_session';
const encoder = new TextEncoder();
const lifetime = 30 * 24 * 60 * 60;

function encode(text: string) {
  return btoa(text).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function decode(text: string) {
  return atob(text.replace(/-/g, '+').replace(/_/g, '/'));
}
async function signingKey() {
  const secret = process.env.STUDIO_SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function createSessionToken(): Promise<string> {
  const key = await signingKey();
  if (!key) throw new Error('Segurança de sessão não configurada.');
  const payload = encode(JSON.stringify({ sub: 'owner', exp: Math.floor(Date.now() / 1000) + lifetime }));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
  const binary = String.fromCharCode(...signature);
  return payload + '.' + encode(binary);
}
export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token || token.length > 2000) return false;
  const key = await signingKey();
  if (!key) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  try {
    const payload: unknown = JSON.parse(decode(parts[0]));
    if (!payload || typeof payload !== 'object') return false;
    const p = payload as { sub?: string; exp?: number };
    const now = Math.floor(Date.now() / 1000);
    if (p.sub !== 'owner' || typeof p.exp !== 'number' || p.exp <= now || p.exp > now + lifetime) return false;
    const decoded = decode(parts[1]);
    if (decoded.length !== 32) return false;
    const signature = Uint8Array.from(decoded, c => c.charCodeAt(0));
    return crypto.subtle.verify('HMAC', key, signature, encoder.encode(parts[0]));
  } catch { return false; }
}
export function safeReturnTo(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/api/') || raw.startsWith('/login')) return '/';
  return raw;
}
