export type Duration = 6 | 8 | 10 | 15 | 20 | 30;
export type GarmentId = 'macaquinho' | 'vestido' | 'conjunto' | 'blusa' | 'calca' | 'saia' | 'short' | 'jeans' | 'fitness' | 'biquini' | 'body' | 'jaqueta';
export type Piece = { id: GarmentId; label: string; mention: string; details: string[] };
export const DURATIONS: Duration[] = [6, 8, 10, 15, 20, 30];
export const CTA = 'Clica no carrinho laranja aqui embaixo e garanta seu look!';
export const CTA_ALTERNATIVES = [CTA, 'Gostou? Clica no carrinho laranja aqui embaixo e garanta o seu!', 'Quer esse look? Clica no carrinho laranja aqui embaixo!', 'Clica no carrinho laranja aqui embaixo e confira essa peça!', 'Esse look tá no carrinho laranja aqui embaixo!'];

export const GARMENTS: Piece[] = [
  { id: 'macaquinho', label: 'Macaquinho', mention: 'esse macaquinho', details: ['Olha o caimento desse modelo!', 'Repara nos detalhes da cintura.', 'Esse visual tem tudo a ver com dias de verão.', 'O desenho da peça chama atenção.', 'Olha o resultado no espelho!', 'Esse look ficou um charme.'] },
  { id: 'vestido', label: 'Vestido', mention: 'esse vestido', details: ['Olha como o vestido compõe o look!', 'Repara no caimento da peça.', 'O visual fica super charmoso.', 'Olha os detalhes do modelo!', 'O movimento do vestido chama atenção.', 'Essa proposta de look é linda.'] },
  { id: 'conjunto', label: 'Conjunto', mention: 'esse conjunto', details: ['As peças juntas criam um look lindo.', 'Repara como o conjunto combina.', 'Olha o visual completo!', 'O conjunto chama atenção no espelho.', 'Dá para pensar em várias combinações.', 'Olha os detalhes das duas peças.'] },
  { id: 'blusa', label: 'Blusa', mention: 'essa blusa', details: ['Repara como ela compõe o look.', 'Olha os detalhes dessa blusa!', 'Uma blusa muda todo o visual.', 'Esse modelo tem muito estilo.', 'Olha o caimento no corpo!', 'A combinação fica linda.'] },
  { id: 'calca', label: 'Calça', mention: 'essa calça', details: ['Repara no corte e no caimento.', 'Olha como a calça compõe o visual!', 'A modelagem faz diferença no look.', 'O resultado no espelho ficou lindo.', 'Olha os detalhes da peça.', 'Essa combinação chama atenção.'] },
  { id: 'saia', label: 'Saia', mention: 'essa saia', details: ['Repara no caimento da saia.', 'Olha como a saia compõe o look!', 'O movimento da peça dá um charme.', 'A modelagem chama atenção.', 'Essa combinação ficou linda.', 'Olha o visual no espelho!'] },
  { id: 'short', label: 'Short', mention: 'esse short', details: ['Repara na modelagem desse short.', 'Olha como ele compõe o look.', 'O visual ficou leve e estiloso.', 'Os detalhes fazem diferença.', 'Olha o caimento da peça!', 'Esse look combina com dias quentes.'] },
  { id: 'jeans', label: 'Jeans', mention: 'essa peça jeans', details: ['O jeans é o destaque do look.', 'Repara no corte e no caimento.', 'Olha como o jeans fica no visual!', 'O modelo compõe vários estilos.', 'A combinação ficou linda.', 'Olha os detalhes da peça jeans.'] },
  { id: 'fitness', label: 'Moda fitness', mention: 'esse look fitness', details: ['Olha como as peças combinam.', 'Repara na modelagem do look.', 'O visual tem uma proposta esportiva.', 'Os detalhes compõem o conjunto.', 'Olha o resultado no espelho!', 'Esse look tem bastante estilo.'] },
  { id: 'biquini', label: 'Moda praia', mention: 'esse look de praia', details: ['O visual é a cara do verão.', 'Olha como as peças combinam!', 'Repara nos detalhes do modelo.', 'A proposta para praia é linda.', 'Olha a composição desse look.', 'Esse visual chama atenção.'] },
  { id: 'body', label: 'Body', mention: 'esse body', details: ['Olha como o body compõe o look.', 'Repara na modelagem desse body.', 'Os detalhes fazem diferença.', 'A combinação ficou charmosa.', 'Olha o visual no espelho!', 'Esse modelo tem estilo.'] },
  { id: 'jaqueta', label: 'Jaqueta', mention: 'essa jaqueta', details: ['Olha como a jaqueta muda o look.', 'Repara nos detalhes do modelo.', 'A sobreposição ficou muito estilosa.', 'O visual ganhou personalidade.', 'Olha essa combinação!', 'Essa peça chama atenção.'] },
];

export const OPENINGS = [
  'Meninas, olha {p}!',
  'Pera, vocês viram {p}?',
  'Gente, que look lindo!',
  'Olha só esse achado de moda!',
  'Vocês usariam {p}?',
  'Eu precisava mostrar esse look!',
  'Olha esse detalhe, meninas!',
  'Esse look merece atenção!',
  'Meninas, repara nesse visual!',
  'Dá uma olhada nessa peça!',
  'Gente, olha essa proposta!',
  'Olha o charme desse look!',
  'Eu amei essa combinação!',
  'Vocês precisam ver os detalhes!',
  'Esse look tem personalidade!',
  'Meninas, observem o caimento!',
  'Olha como ficou no espelho!',
  'Quem também ama esse estilo?',
  'Esse visual é muito minha cara!',
  'Deixa eu mostrar essa peça!'
];
export const SHORT_OPENINGS = [
  'Meninas, olha {p}!', 'Olha esse look!', 'Pera, olha isso!', 'Gente, que lindo!', 'Olha essa peça!',
  'Meninas, que charme!', 'Olha esse detalhe!', 'Esse look, gente!', 'Olha o caimento!', 'Repara nesse look!',
  'Que visual lindo!', 'Olha só, meninas!', 'Vocês viram isso?', 'Olha a modelagem!', 'Esse look surpreende!',
  'Gente, olha aqui!', 'Olha essa combinação!', 'Que charme, meninas!', 'Olha esse estilo!', 'Vocês usariam?'
];
export const EXTRA_LINES = [
  'Eu gosto de como essa peça se destaca no visual.',
  'É uma ideia linda para montar produções diferentes.',
  'Repara como pequenos detalhes mudam a proposta do look.',
  'É uma peça que vale olhar com calma.',
  'O que mais chama atenção é o resultado no corpo.',
  'Dá para imaginar esse look em várias ocasiões.',
  'Eu gosto quando o detalhe faz a diferença.',
  'Essa proposta combina muito com um visual atual.',
  'Vale prestar atenção na modelagem.',
  'Olha como o look fica quando a peça aparece inteira.',
  'O visual é simples de entender e chama atenção.',
  'É o tipo de peça que ganha destaque no espelho.'
];
export const CONNECTORS = [
  'Sério, olha isso.', 'Repara só.', 'E tem mais.', 'Olha de pertinho.', 'Outro detalhe:', 'Eu gostei desse resultado.',
  'Fica de olho nisso.', 'O mais legal é o visual.', 'Olha essa combinação.', 'Esse detalhe faz diferença.',
  'Tem muito estilo.', 'E o caimento?', 'Dá uma olhada.', 'Olha como fica.', 'Esse look tem charme.',
  'A peça chama atenção.', 'Eu gostei da proposta.', 'Isso muda o look.', 'Olha a modelagem.', 'É um visual lindo.'
];
export const CTA_PREFIXES = [
  '', 'Gostou?', 'Quer conferir?', 'Se faz seu estilo,', 'Quer ver a peça?', 'Olha só:', 'É a sua cara?', 'Se você curtiu,',
  'Quer saber mais?', 'Se combinou com você,', 'Vale conferir.', 'Quer conhecer?', 'Imagina esse look!', 'Se você amou,',
  'Pra ver os detalhes,', 'Ficou interessada?', 'Gostou da proposta?', 'Tá procurando um look assim?', 'Se gostou também,', 'Olha o produto:'
];

export function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}
export function secondsEstimate(value: string) {
  return countWords(value) / 3.05;
}
function fill(template: string, piece: Piece) {
  return template.replaceAll('{p}', piece.mention);
}
function joinParts(parts: string[]) {
  return parts.map(s => s.trim()).filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
export function makePresets(piece: Piece, duration: Duration): string[] {
  const limit = Math.floor(duration * 2.95);
  return OPENINGS.map((opening, index) => {
    const parts: string[] = [fill(duration <= 8 ? SHORT_OPENINGS[index] : opening, piece)];
    const detail = piece.details[index % piece.details.length];
    if (countWords(joinParts([...parts, detail, CTA])) <= limit) parts.push(detail);
    else if (duration >= 10) parts.push('Olha os detalhes!');
    if (duration >= 8) {
      const detail2 = piece.details[(index + 3) % piece.details.length];
      if (detail2 !== detail && countWords(joinParts([...parts, detail2, CTA])) <= limit - 1) parts.push(detail2);
    }
    if (duration >= 15) {
      const extra = EXTRA_LINES[index % EXTRA_LINES.length];
      if (countWords(joinParts([...parts, extra, CTA])) <= limit - 1) parts.push(extra);
    }
    if (duration >= 20) {
      const extra = EXTRA_LINES[(index + 5) % EXTRA_LINES.length];
      if (countWords(joinParts([...parts, extra, CTA])) <= limit - 1) parts.push(extra);
    }
    if (duration >= 30) {
      const extra = EXTRA_LINES[(index + 8) % EXTRA_LINES.length];
      if (countWords(joinParts([...parts, extra, CTA])) <= limit - 1) parts.push(extra);
      const extra2 = EXTRA_LINES[(index + 10) % EXTRA_LINES.length];
      if (countWords(joinParts([...parts, extra2, CTA])) <= limit - 1) parts.push(extra2);
    }
    return joinParts([...parts, CTA]);
  });
}
export function assembleCustom(parts: { hook: string; details: string[]; connector?: string; prefix?: string; cta?: string }) {
  const prefix = (parts.prefix || '').trim();
  return joinParts([parts.hook, ...parts.details, parts.connector || '', prefix, parts.cta || CTA]);
}
export function makeFlowPrompt(piece: Piece, duration: Duration, speech: string): string {
  const mark1 = Math.max(2, Math.round(duration * .3));
  const mark2 = Math.max(mark1 + 1, Math.round(duration * .65));
  const mark3 = Math.max(mark2 + 1, Math.round(duration * .85));
  return [
    'GOOGLE FLOW — PROMPT MESTRE TIKTOK SHOP BRASIL',
    '',
    'FORMATO: vídeo UGC vertical 9:16, duração ' + duration + ' segundos. Uma única tomada contínua, sem cortes, com influencer brasileira adulta apresentando ' + piece.mention + ' para TikTok Shop Brasil.',
    '',
    'IDENTIDADE: a foto de referência da influencer define rosto, cabelo, tom de pele, corpo e proporções. Mantenha a identidade visual consistente do primeiro ao último frame. Não substitua nem transforme a modelo.',
    '',
    'ROUPA: use a referência visual da roupa como única fonte para cores, estampa, tecido, comprimento, recortes e modelagem de ' + piece.mention + '. Não invente atributos e não altere a peça entre os frames.',
    '',
    'AMBIENTE: quarto feminino brasileiro moderno e real, ligeiramente desorganizado, roupas sobre a cama, sapatos no chão, café, perfume, luminária acesa e iluminação natural. Grande espelho de corpo inteiro. Cenário e objetos imóveis e consistentes.',
    '',
    'REGRA FÍSICA DAS MÃOS: o celular premium está na MÃO DIREITA da influencer durante 100% do vídeo. A mão direita nunca solta, troca ou duplica o celular nem toca a roupa. A MÃO ESQUERDA é a única livre para gestos e para tocar suavemente o tecido. Exatamente duas mãos humanas anatomicamente corretas.',
    '',
    'CÂMERA: a única perspectiva é a câmera do celular gravando o reflexo no espelho. Celular visível no reflexo, rosto e roupa enquadrados, boca visível. Movimento handheld mínimo e natural. Nunca mudar para outra câmera, enquadramento ou local. Reflexo fisicamente coerente.',
    '',
    'AÇÃO CONTÍNUA:',
    '0–' + mark1 + 's: a influencer já está no espelho, sorri e começa a falar segurando o celular com a mão direita.',
    mark1 + '–' + mark2 + 's: toca brevemente o tecido com a mão esquerda, sem gesticular com a mão do celular.',
    mark2 + '–' + mark3 + 's: pequena inclinação natural do corpo de até 15 graus, sem girar completamente nem trocar de posição.',
    mark3 + '–' + duration + 's: retorna à posição frontal, sorri e encerra naturalmente a fala.',
    '',
    'FALA EXATA — PORTUGUÊS BRASILEIRO NATIVO:',
    '"' + speech + '"',
    '',
    'ÁUDIO: voz feminina brasileira jovem, natural, simpática e conversada; nenhuma voz externa, nenhum inglês ou sotaque estrangeiro. Sincronização labial precisa. Não repetir, inventar ou cortar palavras; fala distribuída naturalmente ao longo do vídeo.',
    '',
    'REALISMO: textura natural de pele, reflexo coerente, tecido com física realista, iluminação consistente e movimentos discretos anatomicamente possíveis. Sem textos na tela, sem legendas, sem cortes, sem troca de rosto, sem celular sumindo, sem roupas se deformando, sem mãos extras ou objetos aparecendo.',
    '',
    'PRIORIDADE: rosto e roupa fiéis à referência; celular fixo na mão direita; continuidade de uma única tomada; mão esquerda como única mão livre; fala em PT-BR. Se necessário, simplifique movimentos em vez de criar cortes.',
    '',
    'Observação de publicação: identifique conteúdo significativamente gerado por IA conforme as regras aplicáveis da plataforma.'
  ].join('\n');
}
