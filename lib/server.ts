import { env } from 'cloudflare:workers';
export function db(){if(!env.DB) throw new Error('Banco indisponível. Tente novamente.'); return env.DB;}
export function bucket(){if(!env.BUCKET) throw new Error('Armazenamento indisponível. Tente novamente.');return env.BUCKET;}
export function aiConfig(){const e=env as unknown as Record<string,string>;return {key:e.OPENAI_API_KEY,model:e.OPENAI_MODEL||'gpt-4.1-mini'};}
