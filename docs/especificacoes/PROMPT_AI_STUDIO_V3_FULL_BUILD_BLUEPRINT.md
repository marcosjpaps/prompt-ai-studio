# PROMPT AI STUDIO V3 - FULL BUILD BLUEPRINT

## Documento para desenvolvimento

## Arquitetura

Frontend \| API Layer \| AI Engine \| Database \| Storage

## Estrutura de projeto

prompt-ai-studio/

app/ components/ features/ services/ database/ ai/ templates/ utils/

## APIs

POST /api/upload

POST /api/analyze-image

POST /api/generate-prompt

POST /api/save-prompt

GET /api/projects

## Exemplo de resposta

{ "prompt":"texto gerado", "negative_prompt":"regras", "script":"fala" }

## Prompt para IA programadora

Você é um engenheiro SaaS senior. Construa o PROMPT AI STUDIO seguindo
arquitetura limpa.

Ordem: 1 banco 2 autenticação 3 upload 4 IA 5 geração 6 interface 7
deploy

## Deploy

GitHub + Supabase + Vercel

## Checklist produção

\[ \] Banco configurado \[ \] Segurança RLS \[ \] Login \[ \] Upload \[
\] IA funcionando \[ \] Histórico \[ \] Pagamentos \[ \] Produção
