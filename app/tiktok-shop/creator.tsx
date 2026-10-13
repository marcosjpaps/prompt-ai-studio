'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronDown, ClipboardCopy, Heart, Layers, Mic2, ShieldCheck, Sparkles, WandSparkles, ImagePlus, Loader2, RefreshCcw, X, ChartNoAxesColumn, Coins } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  assembleCustom, countWords, CTA, CTA_ALTERNATIVES, CTA_PREFIXES, CONNECTORS,
  DURATIONS, EXTRA_LINES, GARMENTS, makeFlowPrompt, makePresets, OPENINGS, makePhotoSpeech,
  secondsEstimate, type Duration, type GarmentId, type PhotoAnalysis
} from '@/lib/tiktok-shop';

type Mode = 'prontas' | 'montar' | 'foto';
const STORAGE_KEY = 'prompt-ai-studio:shop-falas-favoritas:v1';
const TYPES = ['Curiosidade', 'Espelho', 'Estilo', 'Conversa', 'Detalhes'];
const USAGE_KEY = 'prompt-ai-studio:tiktok-shop:image-usage:v1';
type Billing = { model:string; inputTokens:number|null; outputTokens:number|null; estimatedUsd:number|null; estimatedBrl:number|null; usdBrlRate:number; paidTierEstimate:boolean };
type UsageRecord = { at:string; model:string; estimatedBrl:number|null; estimatedUsd:number|null; inputTokens:number|null; outputTokens:number|null };

export default function TikTokShopCreator() {
  const [category, setCategory] = useState<GarmentId>('macaquinho');
  const [duration, setDuration] = useState<Duration>(10);
  const [mode, setMode] = useState<Mode>('prontas');
  const [selection, setSelection] = useState(0);
  const [hook, setHook] = useState(0);
  const [details, setDetails] = useState<number[]>([0]);
  const [connector, setConnector] = useState('none');
  const [ctaPrefix, setCtaPrefix] = useState('0');
  const [ending, setEnding] = useState('0');
  const [customHook, setCustomHook] = useState('');
  const [customDetail, setCustomDetail] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favReady, setFavReady] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [photoAnalysis, setPhotoAnalysis] = useState<PhotoAnalysis | null>(null);
  const [imageError, setImageError] = useState('');
  const [imageBusy, setImageBusy] = useState(false);
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([]);
  const [usageReady, setUsageReady] = useState(false);

  const piece = GARMENTS.find(item => item.id === category) || GARMENTS[0];
  const scripts = useMemo(() => makePresets(piece, duration), [piece, duration]);
  const hooks = useMemo(() => OPENINGS.map(text => text.replaceAll('{p}', piece.mention)), [piece]);
  const detailOptions = useMemo(() => [...piece.details, ...EXTRA_LINES, 'Olha essa combinação!', 'Repara no look completo.'], [piece]);
  const custom = useMemo(() => assembleCustom({
    hook: customHook.trim() || hooks[hook],
    details: [...details.map(index => detailOptions[index]).filter(Boolean), ...(customDetail.trim() ? [customDetail.trim()] : [])],
    connector: connector === 'none' ? '' : CONNECTORS[Number(connector)],
    prefix: CTA_PREFIXES[Number(ctaPrefix)],
    cta: CTA_ALTERNATIVES[Number(ending)]
  }), [customHook, hooks, hook, details, detailOptions, customDetail, connector, ctaPrefix, ending]);
  const speech = mode === 'foto' && photoAnalysis ? makePhotoSpeech(piece, duration, photoAnalysis) : mode === 'montar' ? custom : scripts[selection];
  const prompt = useMemo(() => makeFlowPrompt(piece, duration, speech, photoAnalysis), [piece, duration, speech, photoAnalysis]);
  const estimated = secondsEstimate(speech);
  const over = estimated > duration;
  const under = estimated < duration * .5;
  const now = new Date();
  const monthLabel = new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(now);
  const monthly = usageHistory.filter(entry => {const date = new Date(entry.at); return Number.isFinite(date.getTime()) && date.getMonth()===now.getMonth() && date.getFullYear()===now.getFullYear();});
  const estimatedBrlTotal = monthly.reduce((sum,item)=>sum+(typeof item.estimatedBrl==='number'?item.estimatedBrl:0),0);
  const pricedCount=monthly.filter(entry=>typeof entry.estimatedBrl==='number').length;
  const unpricedCount=monthly.length-pricedCount;
  const fmtBRL = (value:number)=>'R$ '+value.toLocaleString('pt-BR',{minimumFractionDigits:4,maximumFractionDigits:4});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (Array.isArray(saved)) setFavorites(saved.filter(value => typeof value === 'string').slice(0, 200));
    } catch { /* Sem dados de favoritos. */ }
    setFavReady(true);
  }, []);
  useEffect(() => {
    if (!favReady) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)); } catch { /* Armazenamento indisponível. */ }
  }, [favorites, favReady]);

  useEffect(() => {
    try {
      const data:unknown = JSON.parse(localStorage.getItem(USAGE_KEY)||'[]');
      if(Array.isArray(data)) setUsageHistory(data.filter((entry):entry is UsageRecord=>Boolean(entry&&typeof entry==='object'&&typeof entry.at==='string'&&typeof entry.model==='string')).slice(0,5000));
    } catch { /* Histórico de uso indisponível. */ }
    setUsageReady(true);
  },[]);
  useEffect(()=>{
    if(!usageReady)return;
    try {localStorage.setItem(USAGE_KEY,JSON.stringify(usageHistory));}catch{ /* armazenamento do navegador indisponível */ }
  },[usageHistory,usageReady]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(''); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  async function analyzeImage(file:File) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024 || file.size < 1) {
      setImageError('Selecione JPG, PNG ou WebP de até 4 MB.'); return;
    }
    setImageBusy(true);setImageError('');setImageFile(file);setPhotoAnalysis(null);
    try {
      const form = new FormData(); form.append('image', file);
      const response = await fetch('/api/tiktok-shop/analyze', {method:'POST',body:form});
      const data:unknown = await response.json();
      const parsed = data as {error?:string;category?:GarmentId|'indefinido';description?:string;highlights?:string[];billing?:Billing};
      if (!response.ok) throw Error(parsed.error || 'Não foi possível analisar a foto.');
      if (!parsed.description || !Array.isArray(parsed.highlights) || !parsed.highlights.length) throw Error('Análise incompleta.');
      setPhotoAnalysis({category:parsed.category || 'indefinido',description:parsed.description,highlights:parsed.highlights});
      const b=parsed.billing;
      setUsageHistory(current=>[{at:new Date().toISOString(),model:b?.model||'desconhecido',estimatedBrl:typeof b?.estimatedBrl==='number'?b.estimatedBrl:null,estimatedUsd:typeof b?.estimatedUsd==='number'?b.estimatedUsd:null,inputTokens:typeof b?.inputTokens==='number'?b.inputTokens:null,outputTokens:typeof b?.outputTokens==='number'?b.outputTokens:null},...current].slice(0,5000));
      if (parsed.category && parsed.category !== 'indefinido') changeCategory(parsed.category);
      setMode('foto');
      toast.success('Roupa analisada! Fala e prompt criados automaticamente.');
    } catch (error) {
      setImageError(error instanceof Error ? error.message : 'Falha ao analisar a imagem.');
    } finally {setImageBusy(false);}
  }
  function clearPhoto() {setImageFile(null);setPhotoAnalysis(null);setImageError('');if (mode === 'foto') setMode('prontas');}
  function changeCategory(value: GarmentId) {
    setCategory(value); setSelection(0); setDetails([0]); setHook(0); setCustomHook(''); setCustomDetail('');
  }
  function toggleDetail(index: number) {
    setDetails(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index].sort((a, b) => a - b));
  }
  function toggleFavorite() {
    const exists = favorites.includes(speech);
    setFavorites(current => exists ? current.filter(value => value !== speech) : [speech, ...current].slice(0, 200));
    toast.success(exists ? 'Removido dos favoritos.' : 'Fala favorita salva neste navegador.');
  }
  async function copy(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); toast.success(message); }
    catch { toast.error('Falha ao copiar. Selecione o texto e copie manualmente.'); }
  }
  const visible = scripts.map((line, i) => ({ line, i })).filter(item => !onlyFavorites || favorites.includes(item.line));

  return <div className="shop-root">
    <Toaster theme="dark" richColors position="bottom-right"/>
    <header className="shop-header">
      <Link href="/" className="shop-back"><ArrowLeft size={16}/> Voltar ao estúdio</Link>
      <div className="shop-brand"><Layers size={18}/><strong>PROMPT AI STUDIO</strong><span className="shop-pill">NOVO MÓDULO</span></div>
    </header>
    <main className="shop-container">
      <div className="shop-hero">
        <span className="shop-eyebrow"><Sparkles size={15}/> TIKTOK SHOP CREATOR</span>
        <h1>Uma biblioteca de falas para cada look.</h1>
        <p>Envie a foto da roupa para gerar automaticamente uma fala e um prompt personalizado ou escolha suas falas por nicho e duração.</p>
        <div className="shop-tags"><span>12 nichos</span><span>6 durações</span><span>20 falas por combinação</span><span>Biblioteca grátis · Foto com API</span></div>
      </div>
      <div className="shop-layout">
        <div className="shop-stack">
          <section className="shop-card">
            <h2><span className="shop-number">01</span> Envie a foto da roupa</h2>
            <p className="shop-muted">A API identifica detalhes visíveis da peça e gera automaticamente uma fala de venda e o prompt do Flow. Sua foto não entra no GitHub.</p>
            <label className="shop-upload">
              {imagePreview ? <img src={imagePreview} alt="Prévia da foto da roupa"/> : <span className="shop-upload-icon"><ImagePlus size={28}/></span>}
              <span>{imageFile ? imageFile.name : 'Toque para escolher a foto da roupa'}</span>
              <small>JPG, PNG ou WebP · até 4 MB</small>
              <input type="file" accept="image/png,image/jpeg,image/webp" disabled={imageBusy} onChange={e => {
                const file=e.target.files?.[0]; if(file) void analyzeImage(file);
                e.target.value='';
              }}/>
            </label>
            {imageBusy && <div className="shop-photo-state"><Loader2 size={15} className="shop-spin"/> Analisando roupa com a API...</div>}
            {imageError && <div className="shop-warning" role="alert">{imageError}</div>}
            {photoAnalysis && <div className="shop-photo-result"><strong><Check size={16}/> Foto analisada</strong><p>{photoAnalysis.description}</p><div className="shop-photo-highlights">{photoAnalysis.highlights.map((line,i) => <span key={i}>{line}</span>)}</div></div>}
            {imageFile && <div className="shop-photo-actions">
              <button type="button" disabled={imageBusy} onClick={() => void analyzeImage(imageFile)}><RefreshCcw size={15}/> Reanalisar</button>
              <button type="button" disabled={imageBusy} onClick={clearPhoto}><X size={15}/> Remover</button>
            </div>}
            <p className="shop-hint">Se a API ainda não estiver conectada, você pode continuar com as falas prontas. O envio não salva a foto no servidor.</p>
          </section>

          <section className="shop-card">
            <h2><span className="shop-number">02</span> Configure seu vídeo</h2>
            <label className="shop-field"><span>Tipo de roupa</span><div className="shop-select-wrap">
              <select value={category} onChange={e => changeCategory(e.target.value as GarmentId)}>
                {GARMENTS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select><ChevronDown size={16}/></div>
            </label>
            <div className="shop-field"><span>Duração da fala e do vídeo</span><div className="shop-times">
              {DURATIONS.map(value => <button key={value} type="button" className={duration === value ? 'active' : ''} onClick={() => { setDuration(value); setSelection(0); }}>{value}s</button>)}
            </div></div>
            <div className="shop-note"><ShieldCheck size={17}/><div>Final padrão das falas prontas:<br/><strong>“{CTA}”</strong></div></div>
          </section>

          <section className="shop-card">
            <h2><span className="shop-number">03</span> Escolha sua fala</h2>
            <div className="shop-switcher">
              {photoAnalysis && <button type="button" className={mode === 'foto' ? 'active' : ''} onClick={() => setMode('foto')}>Da foto</button>}
              <button type="button" className={mode === 'prontas' ? 'active' : ''} onClick={() => setMode('prontas')}>20 falas prontas</button>
              <button type="button" className={mode === 'montar' ? 'active' : ''} onClick={() => setMode('montar')}>Montar por partes</button>
            </div>
            {mode === 'foto' && photoAnalysis ? <div className="shop-photo-result"><strong><Sparkles size={16}/> Fala a partir da imagem</strong><p>Combinamos a descrição da foto, o tempo de vídeo e o final sobre o carrinho laranja. Para experimentar outras falas, use as abas ao lado.</p></div> : mode === 'prontas' ? <>
              <div className="shop-inline-between"><span className="shop-muted">20 ideias · {piece.label} · {duration}s</span>
                <label className="shop-checkbox"><input type="checkbox" checked={onlyFavorites} onChange={e => setOnlyFavorites(e.target.checked)}/> Só favoritas</label>
              </div>
              <div className="shop-script-list">
                {visible.map(({ line, i }) => <button type="button" key={i} className={'shop-script ' + (selection === i ? 'selected' : '')} onClick={() => setSelection(i)}>
                  <span className="shop-script-top"><strong>{String(i + 1).padStart(2, '0')} · {TYPES[i % TYPES.length]}</strong><span>{countWords(line)} palavras</span></span>
                  <span className="shop-script-text">{line}</span>
                  {selection === i && <span className="shop-chosen"><Check size={13}/> Selecionada</span>}
                </button>)}
                {visible.length === 0 && <div className="shop-empty">Nenhuma favorita encontrada. Desmarque “Só favoritas” para ver todas.</div>}
              </div>
              <p className="shop-hint">20 roteiros originais inspirados em formatos populares, não um ranking verificado de vendas.</p>
            </> : <>
              <p className="shop-muted">Selecione e combine frases; você não precisa digitar nada. Os campos livres são opcionais.</p>
              <label className="shop-field"><span>Abertura — 20 opções</span><div className="shop-select-wrap">
                <select value={hook} onChange={e => setHook(Number(e.target.value))}>{hooks.map((value, i) => <option key={i} value={i}>{String(i + 1).padStart(2, '0')} · {value}</option>)}</select><ChevronDown size={16}/></div></label>
              <div className="shop-field"><span>Frases sobre o look — escolha quantas quiser</span><div className="shop-detail-list">
                {detailOptions.map((value, i) => <label className="shop-detail" key={i}><input type="checkbox" checked={details.includes(i)} onChange={() => toggleDetail(i)}/><span>{value}</span></label>)}
              </div></div>
              <label className="shop-field"><span>Conexão entre as frases — 20 opções</span><div className="shop-select-wrap">
                <select value={connector} onChange={e => setConnector(e.target.value)}><option value="none">Sem conexão adicional</option>{CONNECTORS.map((value, i) => <option key={i} value={String(i)}>{String(i + 1).padStart(2, '0')} · {value}</option>)}</select><ChevronDown size={16}/></div></label>
              <label className="shop-field"><span>Chamada antes do carrinho</span><div className="shop-select-wrap">
                <select value={ctaPrefix} onChange={e => setCtaPrefix(e.target.value)}>{CTA_PREFIXES.map((value, i) => <option key={i} value={String(i)}>{value || 'Ir direto para o carrinho'}</option>)}</select><ChevronDown size={16}/></div></label>
              <label className="shop-field"><span>Finalização — carrinho laranja</span><div className="shop-select-wrap">
                <select value={ending} onChange={e => setEnding(e.target.value)}>{CTA_ALTERNATIVES.map((value, i) => <option key={i} value={String(i)}>{value}</option>)}</select><ChevronDown size={16}/></div></label>
              <details className="shop-more"><summary>Personalizar com suas próprias frases (opcional)</summary>
                <label className="shop-field"><span>Outra abertura</span><textarea value={customHook} maxLength={200} rows={2} onChange={e => setCustomHook(e.target.value)} placeholder="Deixe em branco para usar a seleção"/></label>
                <label className="shop-field"><span>Outra frase sobre o produto</span><textarea value={customDetail} maxLength={300} rows={2} onChange={e => setCustomDetail(e.target.value)} placeholder="Deixe em branco para usar somente as selecionadas"/></label>
              </details>
              <button type="button" className="shop-simple-link" onClick={() => { setHook(0); setDetails([0]); setConnector('none'); setCtaPrefix('0'); setEnding('0'); setCustomHook(''); setCustomDetail(''); }}>Restaurar combinações</button>
            </>}
          </section>
        </div>

        <div className="shop-stack shop-right">
          <section className="shop-card shop-monthly">
            <h2><span className="shop-number"><ChartNoAxesColumn size={16}/></span> Seu consumo de imagens</h2>
            <p className="shop-muted">{monthLabel.charAt(0).toUpperCase()+monthLabel.slice(1)} · apenas este navegador</p>
            <div className="shop-usage-grid">
              <div><span>Fotos analisadas</span><strong>{monthly.length.toLocaleString('pt-BR')}</strong></div>
              <div><span>Custo estimado no plano pago</span><strong>{pricedCount?fmtBRL(estimatedBrlTotal):'—'}</strong></div>
            </div>
            <div className="shop-note"><Coins size={18}/><div>Estimativa baseada nos tokens informados pela API para Gemini 3.1 Flash-Lite e câmbio aproximado de R$ 5,00/US$ 1. No plano gratuito, o valor efetivamente cobrado pode ser R$ 0. Não é uma fatura do provedor.{unpricedCount>0?' '+unpricedCount+' análise(s) sem preço verificado não entraram no valor.':''}</div></div>
          </section>
          <section className="shop-card">
            <h2><span className="shop-number">04</span> Resultado da fala</h2>
            <div className="shop-speech">“{speech}”</div>
            <div className="shop-meter"><span><Mic2 size={16}/> {countWords(speech)} palavras · aprox. {estimated.toFixed(1).replace('.', ',')}s</span><span>{duration}s escolhidos</span></div>
            {over && <div className="shop-warning">Essa fala pode passar de {duration}s. Reduza frases ou escolha uma duração maior para evitar voz acelerada ou cortada.</div>}
            {under && <div className="shop-warning subtle">A fala é curta para {duration}s. Você pode adicionar detalhes ou usar movimentos silenciosos ao final.</div>}
            <div className="shop-buttons">
              <button type="button" className="shop-action" onClick={() => void copy(speech, 'Fala copiada!')}><ClipboardCopy size={17}/> Copiar fala</button>
              <button type="button" className={'shop-favorite ' + (favorites.includes(speech) ? 'is-favorite' : '')} onClick={toggleFavorite} aria-label="Salvar ou remover fala favorita"><Heart size={18} fill={favorites.includes(speech) ? 'currentColor' : 'none'}/></button>
            </div>
          </section>

          <section className="shop-card">
            <h2><span className="shop-number">05</span> Prompt completo para o Flow</h2>
            <p className="shop-muted">Identidade fixa, mesmo look, uma tomada só, celular sempre na mão direita e fala selecionada em PT-BR. O texto copiado não inclui títulos desnecessários.</p>
            <textarea className="shop-prompt" readOnly value={prompt} aria-label="Prompt completo para Google Flow"/>
            <button type="button" className="shop-main-button" onClick={() => void copy(prompt, 'Prompt completo copiado!')}><WandSparkles size={19}/> Copiar prompt completo para o Flow</button>
            <div className="shop-note"><ShieldCheck size={17}/><div>Envie ao Flow a imagem-base da influencer usando a roupa correspondente. Esta ferramenta cria o texto do prompt; a geração do vídeo acontece no Flow.</div></div>
          </section>
        </div>
      </div>
    </main>
  </div>;
}
