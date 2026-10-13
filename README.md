# Prompt AI Studio

Portuguese creative workspace with reference uploads, template-based prompt composition, editable output, project history and character/product memories.

## Runtime

Next.js-compatible App Router via the bundled Vinext runtime, React, TypeScript and Tailwind. Hosted through Sites. The original Supabase/Vercel architecture is adapted to platform D1 + R2 and ChatGPT authentication so saved records and uploads work without requiring those external accounts. API authorization is enforced by owner on every data operation.

## Features

- Upload verified JPEG / PNG / WebP, up to 10 MB, to private object storage.
- Six creative objectives; camera, light, format, action and continuity controls.
- Deterministic template-based prompt composition, labeled as such in the UI. English template labels do not translate custom user text.
- Copy and edit prompts, negative prompts and UGC scene scripts.
- TikTok Shop Creator in `/tiktok-shop`: 12 clothing niches × 6 durations × 20 prewritten original scripts per combination, modular hook/detail/connection/CTA builder, estimated reading time and Flow prompt copy. Default CTA is “Clica no carrinho laranja aqui embaixo e garanta seu look!”. Favorites are stored in the browser and do not require a paid AI API.
- Durable projects / history and character / product memory.
- Optional real visual analysis through OpenAI. Requires server secret OPENAI_API_KEY and optional OPENAI_MODEL. No key is collected by the browser.
- Platform ChatGPT sign-in; no standalone password registration.
- Informational future Free / Creator / Pro / Agency tiers. Billing, paid credits, team management and automatic quality review are not implemented.

## Development

Use the Sites install, build and publication helpers for this environment. Standalone package commands: npm run dev, npm run build, npm run db:generate. SQL migrations live in drizzle/ and must be applied before local database testing. Schema changes are generated via Drizzle, never at request time.

The hosting configuration declares DB and BUCKET. Hosted production secrets must be configured through Sites. Do not commit populated .env files.

## Data security

All APIs require a platform-validated user identity. Records are scoped to user_id. Mutations check Origin when present. Prompts and descriptions are rendered as text. Upload ownership is checked before reading, saving or analysis. No customer data is included in source control.


## TikTok Shop Creator — Análise de roupas por imagem

O módulo em /tiktok-shop permite escolher uma imagem JPG/PNG/WebP de até 4 MB. O navegador envia a imagem diretamente para /api/tiktok-shop/analyze, que consulta uma API de visão no servidor e retorna a categoria sugerida, a descrição objetiva da peça e frases curtas baseadas apenas nos detalhes visíveis. O texto gerado é combinado com a duração do vídeo e o CTA de carrinho laranja para criar o prompt personalizado do Flow. A imagem não é salva pelo endpoint; o usuário deve enviar a mesma imagem como referência ao Google Flow separadamente. As bibliotecas de falas continuam disponíveis mesmo sem API.

Configure as variáveis de ambiente no Vercel (Project Settings → Environment Variables), **não no navegador ou repositório**:

- SHOP_VISION_API_KEY: chave secreta da API de visão. Se ausente, usa OPENAI_API_KEY já configurada, se disponível.
- SHOP_VISION_API_URL: opcional, endpoint HTTPS compatível com Chat Completions (padrão: https://api.openai.com/v1/chat/completions).
- SHOP_VISION_MODEL: opcional, nome do modelo que aceite imagens e retorne JSON (padrão: gpt-4o-mini).

O provedor deve aceitar mensagens multimodais OpenAI-compatible com image_url em data URI e resposta JSON contendo category, description e highlights. A chave nunca deve ser enviada ao usuário final ou incluída em commits. A análise por API poderá gerar cobrança do provedor escolhido. Após configurar as variáveis, implante novamente para disponibilizar a integração ao servidor.
