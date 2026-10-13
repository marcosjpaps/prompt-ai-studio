'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronDown, ClipboardCopy, Heart, Layers, Mic2, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import {
  assembleCustom, countWords, CTA, CTA_ALTERNATIVES, CTA_PREFIXES, CONNECTORS,
  DURATIONS, EXTRA_LINES, GARMENTS, makeFlowPrompt, makePresets, OPENINGS,
  secondsEstimate, type Duration, type GarmentId
} from '@/lib/tiktok-shop';

type Mode = 'prontas' | 'montar';
const STORAGE_KEY = 'prompt-ai-studio:shop-falas-favoritas:v1';
const TYPES = ['Curiosidade', 'Espelho', 'Estilo', 'Conversa', 'Detalhes'];

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
  const speech = mode === 'prontas' ? scripts[selection] : custom;
  const prompt = useMemo(() => makeFlowPrompt(piece, duration, speech), [piece, duration, speech]);
  const estimated = secondsEstimate(speech);
  const over = estimated > duration;
  const under = estimated < duration * .5;

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
        <p>Escolha o nicho e a duração. Selecione entre 20 falas prontas ou monte a sua combinando abertura, detalhes, conexão e finalização.</p>
        <div className="shop-tags"><span>12 nichos</span><span>6 durações</span><span>20 falas por combinação</span><span>Sem IA paga</span></div>
      </div>
      <div className="shop-layout">
        <div className="shop-stack">
          <section className="shop-card">
            <h2><span className="shop-number">01</span> Configure seu vídeo</h2>
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
            <h2><span className="shop-number">02</span> Escolha sua fala</h2>
            <div className="shop-switcher">
              <button type="button" className={mode === 'prontas' ? 'active' : ''} onClick={() => setMode('prontas')}>20 falas prontas</button>
              <button type="button" className={mode === 'montar' ? 'active' : ''} onClick={() => setMode('montar')}>Montar por partes</button>
            </div>
            {mode === 'prontas' ? <>
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
          <section className="shop-card">
            <h2><span className="shop-number">03</span> Resultado da fala</h2>
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
            <h2><span className="shop-number">04</span> Prompt mestre para o Flow</h2>
            <p className="shop-muted">Identidade fixa, mesmo look, uma tomada só, celular sempre na mão direita e fala selecionada em PT-BR.</p>
            <textarea className="shop-prompt" readOnly value={prompt} aria-label="Prompt completo para Google Flow"/>
            <button type="button" className="shop-main-button" onClick={() => void copy(prompt, 'Prompt completo copiado!')}><WandSparkles size={19}/> Copiar prompt completo para o Flow</button>
            <div className="shop-note"><ShieldCheck size={17}/><div>Envie ao Flow a imagem-base da influencer usando a roupa correspondente. Esta ferramenta cria o texto do prompt; a geração do vídeo acontece no Flow.</div></div>
          </section>
        </div>
      </div>
    </main>
  </div>;
}
