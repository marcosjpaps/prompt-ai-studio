# Revisão funcional — 03/10/2026

## Resultado
A versão inicial não contempla 100% dos três documentos de especificação.
O editor e os serviços de dados foram revisados; integrações e recursos avançados
pendentes continuam identificados na interface.

## Correções desta revisão
- Configurações de projetos agora são validadas e salvas integralmente. Foi removido
  o corte de JSON que tornava alguns projetos com textos longos impossíveis de reabrir.
- Regras negativas e roteiros não são mais cortados silenciosamente.
- Dados JSON inválidos ou nulos retornam erro de entrada, sem erro interno genérico.
- Limites de tamanho são verificados também durante a leitura do corpo da requisição.
- Cabeçalhos e estrutura de imagens recebem verificações adicionais. A validação de
  formatos não substitui uma decodificação completa ou um scanner de arquivos.
- Configurações, formatos e referências de imagem são validados no servidor.
- O seletor de memórias apresenta nomes curtos, preservando as descrições completas.

## Verificações automatizadas
Execute após `npm run build`: `node tests/integration.mjs`.
O teste usa o Worker compilado com banco D1 e bucket R2 locais, isolados dos dados reais.
São 28 cenários: renderização HTML, autenticação obrigatória, PNG/JPG/WebP,
leitura dos bytes, limite de upload, seis objetivos, duas estruturas de idioma,
salvamento e reabertura, histórico, memórias, textos longos, origem externa,
referências privadas e erros de entrada. Um cenário pode conter várias asserções.
A checagem TypeScript é executada com `node node_modules/typescript/bin/tsc --noEmit`.

## Limites da verificação
- Não foi executado teste de cliques, responsividade e área de transferência em um
  navegador real: o ambiente não disponibilizou o fluxo de navegador exigido para Sites.
- Login e logout reais pelo ChatGPT dependem do serviço de autenticação e não foram
  percorridos em navegador. A proteção das APIs foi exercitada em testes locais.
- O estado publicado e a presença das tabelas de produção foram verificados; os
  testes de gravação foram feitos exclusivamente no ambiente local isolado.
- WebMCP tem integração defensiva, mas sua execução em navegador compatível não foi testada.

## Ainda pendente
- Ativar e testar a análise visual com uma chave válida do provedor.
- Geração por IA e revisão automática de qualidade: a versão atual compõe por modelos.
- Tradução de descrições e ações personalizadas; a opção English altera a estrutura.
- Pagamentos, assinaturas e contabilidade de créditos.
- Equipes, clientes e projetos compartilhados do plano Agency.
- Cadastro com e-mail/senha, caso desejado: o login atual usa ChatGPT.
- Supabase/PostgreSQL e Vercel: não são a infraestrutura desta versão, que usa
  Sites, D1, R2 e Vinext. Uma migração requer implementação específica.

A listagem atual mostra os 200 projetos e as 200 memórias mais recentes por usuário.
Personagens/produtos são memórias textuais. Preservação visual é uma instrução do
prompt, não uma garantia sobre o resultado da IA de destino.
