# PROMPT AI STUDIO V1 - MVP IMPLEMENTATION

## Objetivo

Criar a primeira versão funcional do SaaS para gerar prompts
profissionais através de análise de imagens.

## Fluxo principal

Usuário -\> Upload imagem -\> Análise IA -\> Escolha objetivo -\>
Geração de prompt -\> Salvar

## Funcionalidades V1

-   Cadastro e login
-   Dashboard
-   Criar projeto
-   Upload de imagem
-   Gerar prompt
-   Copiar prompt
-   Histórico

## Stack

Frontend: - Next.js - TypeScript - Tailwind CSS

Backend: - Next.js API Routes

Banco: - Supabase PostgreSQL

IA: - Modelo multimodal para análise visual

## Banco inicial

Tabelas: - users - projects - images - analyses - prompts

## Prompt interno de análise

Você é um especialista em análise visual. Identifique: - pessoa -
roupa - produto - cenário - iluminação - câmera

Retorne JSON estruturado.

## Prompt interno de geração

Você é um engenheiro profissional de prompts. Crie um prompt completo
contendo: - descrição - ação - câmera - iluminação - estilo - regras
negativas

## Checklist V1

\[ \] Login \[ \] Upload \[ \] Análise IA \[ \] Geração de prompt \[ \]
Histórico \[ \] Deploy
