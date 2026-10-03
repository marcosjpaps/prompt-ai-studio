# PROMPT AI STUDIO — Código do projeto

Este pacote contém o código da versão publicada, componentes, estilos, APIs,
esquema e migrações do banco, arquivo de dependências e modelo de configuração.

## Stack desta versão
React + TypeScript + Tailwind, com rotas compatíveis com Next.js executadas
pelo Vinext. Armazenamento D1 e R2, autenticação pelo ChatGPT e hospedagem Sites.
Os documentos originais citam Supabase/Vercel; essas integrações não foram
implementadas nesta versão. O código atual depende dos serviços descritos acima.

## Preparação para desenvolvimento
1. Instale Node.js 22.13 ou superior.
2. Abra um terminal nesta pasta e execute: npm ci
3. Execute: npm run dev
4. Para compilar: npm run build

O desenvolvimento fora do ambiente hospedado exige configurar bindings locais
D1/R2, aplicar as migrações de drizzle/ e disponibilizar uma integração de
identidade equivalente à do ambiente original. Apenas abrir um arquivo HTML
não executa esta aplicação. Consulte README.md e os scripts incluídos.

## Análise visual
O editor compõe prompts por modelos sem IA. A análise automática opcional usa
OPENAI_API_KEY no servidor e OPENAI_MODEL (veja .env.example).
Não coloque chaves de API no frontend. Nenhuma chave acompanha este ZIP.

## Recursos pendentes
Pagamentos, créditos pagos, espaços de equipe e revisão automática de qualidade
não estão implementados. O login atual é pelo ChatGPT, sem cadastro por senha.

## Conteúdo excluído
node_modules, builds, caches, histórico Git, dados dos usuários e credenciais.
A configuração .openai/hosting.json identifica o site original; não é uma senha.
Para uma nova publicação independente, registre um novo projeto no provedor.

Os três documentos fornecidos estão em docs/especificacoes/ para consulta.

## Revisão funcional
Consulte REVISAO.md para correções, testes executados e funcionalidades pendentes.
