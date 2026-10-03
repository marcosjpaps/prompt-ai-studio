'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    
    if (email !== 'marcos220896antonio@gmail.com' || password !== 'MAR9115COS') {
      setError('Credenciais inválidas');
      return;
    }

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: password }),
    });

    if (res.ok) {
      const returnTo = searchParams.get('return_to') || '/';
      router.push(returnTo);
    } else {
      setError('Erro ao fazer login');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <form onSubmit={handleLogin} className="w-full max-w-sm p-8 bg-[#111] rounded-lg border border-[#222]">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Restrito</h1>
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-[#222] border-none" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-[#222] border-none" required />
          </div>
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200 mt-6">Entrar</Button>
        </div>
      </form>
    </div>
  );
}
