'use client';
import {Suspense,useState} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {KeyRound,ShieldCheck,ArrowRight,Loader2} from 'lucide-react';

function LoginForm(){
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const router=useRouter(),params=useSearchParams();
  async function submit(e:React.FormEvent){
    e.preventDefault();
    if(busy)return;
    setError('');setBusy(true);
    try{
      const response=await fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const result=await response.json().catch(()=>({error:'Servidor indisponível.'})) as {error?:string};
      if(!response.ok)throw new Error(result.error||'Não foi possível entrar.');
      const raw=params.get('return_to');
      const to=raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/api/') && !raw.startsWith('/login') ? raw : '/';
      router.replace(to);router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível entrar.');}finally{setBusy(false);}
  }
  return <main className="login-screen"><form className="login-panel" onSubmit={e=>void submit(e)}>
    <span className="login-icon"><KeyRound size={24}/></span>
    <div className="login-eyebrow"><ShieldCheck size={14}/> ACESSO PROTEGIDO</div>
    <h1>Seu estúdio, seu espaço.</h1>
    <p>Entre para continuar criando e acessar seus projetos.</p>
    {error&&<div className="login-error" role="alert">{error}</div>}
    <label htmlFor="login-email">E-mail</label>
    <input id="login-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="seu@email.com"/>
    <label htmlFor="login-password">Senha</label>
    <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Sua senha"/>
    <button className="login-submit" type="submit" disabled={busy}>{busy?<Loader2 className="spin" size={19}/>:<ArrowRight size={19}/>} {busy?'Entrando...':'Entrar no estúdio'}</button>
    <span className="login-foot">Prompt AI Studio · Área privada</span>
  </form></main>;
}
export default function LoginPage(){return <Suspense fallback={<main className="login-screen"/>}><LoginForm/></Suspense>;}
