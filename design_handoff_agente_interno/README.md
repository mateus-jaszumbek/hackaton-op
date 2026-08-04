# Handoff: Agente Interno de Procedimentos — UI do chat (claymorphism)

## Overview
Aplicação web de chat para um agente interno. O colaborador descreve uma situação que o sistema
bloqueia; o agente responde com o caminho aceito, os passos, uma nota de exceção, as fontes
(procedimentos internos) e quem aprova. O agente **não executa** alterações no sistema.

Escopo desta entrega: a tela principal do chat em desktop (1440×900), com quatro paletas
intercambiáveis, estado vazio, conversa, streaming de resposta, sidebar de histórico e painel
lateral de fonte citada.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML** — protótipos que mostram
aparência e comportamento pretendidos, **não** código de produção para copiar. A tarefa é
**recriar esses designs no codebase alvo** (`hackaton-op`: Vite + React 19, JS puro, CSS simples,
sem lib de UI) usando os padrões já estabelecidos nele.

Arquivo de referência: `Chatbot Interno - Clay HiFi.dc.html`. Ele roda em qualquer navegador; a
lógica está na classe no fim do arquivo e o markup logo acima — leia ambos.

## Fidelity
**Alta fidelidade.** Cores, tipografia, espaçamentos, raios, estados e microinterações são finais.
Recriar pixel-perfect com os recursos do codebase.

## Design Tokens

### Paletas (4 temas, trocáveis em runtime)
Aplicar como CSS custom properties num wrapper raiz. Nomes das variáveis:
`--bg --panel --sub --ink --muted --line --hov --a1 --a2 --a3 --onA1`

| token | lavanda | barro | escuro | menta |
|---|---|---|---|---|
| bg (fundo app) | #eef0fb | #f6ebe1 | #1f1c2c | #e6f3f1 |
| panel (sidebar, cards, composer) | #f8f9ff | #fff8f2 | #2b2740 | #fafdfc |
| sub (balão do bot, campos, chips) | #e7eafc | #f1e2d4 | #353052 | #dcece9 |
| ink (texto) | #2c2e59 | #4a3527 | #ece9f7 | #1e3b38 |
| muted (texto secundário) | #7c80a8 | #977a63 | #9d96c4 | #6d918c |
| line (divisores 1px) | rgba(60,62,120,.10) | rgba(110,78,55,.13) | rgba(255,255,255,.09) | rgba(20,70,65,.12) |
| hov (hover ghost) | rgba(60,62,120,.05) | rgba(110,78,55,.06) | rgba(255,255,255,.05) | rgba(20,70,65,.05) |
| a1 (ação primária / balão do usuário) | #7c6cf0 | #e28055 | #8b7bf7 | #33ac96 |
| a2 (forma decorativa, pip) | #ff9fbb | #8fae7f | #ff8fa8 | #6b8ff0 |
| a3 (avatar do bot, forma) | #ffd489 | #f2c65c | #6fd8c4 | #ffcf6b |
| onA1 (texto sobre a1) | #ffffff | #ffffff | #ffffff | #ffffff |

Padrão: **lavanda**. Persistir a escolha (localStorage) é desejável.

### Estilo
Claymorphism **plano**: formas macias e grandes raios, **sem** sombras internas/externas.
Separação por preenchimento de cor + divisores de 1px em `--line`. Não adicionar relevo.

### Tipografia
Archivo (Google Fonts, pesos 400/500/600/700). Escala usada:
- H1 estado vazio: 36px / line-height 1.1 / weight 700 / letter-spacing -0.025em
- Parágrafo do estado vazio: 14.5px / 1.6 / 400 / cor muted
- Corpo de mensagem: 13.5px / 1.5–1.6 / 400
- Passos numerados: 12.5px / 1.55
- Títulos de item da sidebar: 12.5px / 500–600; preview 10.5px muted
- Rótulos de seção: 9.5px / 600 / uppercase / letter-spacing .14em / cor muted
- Chips e botões-texto: 11–12.5px

### Raios
Sidebar 0 28px 28px 0 · painéis 24px · composer 24px · cards de sugestão 18px ·
balão usuário 20px 20px 6px 20px · balão bot 20px 20px 20px 6px · campos 14px ·
botões da sidebar 14–16px · chips/pills 999px · botão enviar 50%.

### Espaçamento
Página 1440×900. Sidebar 272px (padding 20px 16px, gap 18px). Header 64px, padding 0 32px,
borda inferior 1px. Área de mensagens: padding 32px 32px 8px, coluna centralizada max-width 720px,
gap 26px entre mensagens. Composer: padding 12px 32px 24px, caixa 14px 16px 12px.
Painel de fonte: 340px, borda esquerda 1px.

## Screens / Views

### 1. Estado vazio / boas-vindas
Coluna de 720px centralizada, padding-top 56px:
1. Faixa de formas clay (altura 84px, alinhadas à base, gap 14px): círculo 76px em a1;
   blob 92×64 (`border-radius:38% 62% 55% 45%/50% 45% 55% 50%`) em a3; pill 124×46 em a2;
   quadrado 62px com `border-radius:22px 22px 22px 54px` em sub.
2. H1: "Descreva o que o sistema / não deixa você fazer." (quebra manual).
3. Parágrafo: "Retorno o caminho aceito, a regra que se aplica e o documento de origem. Não executo alterações — indico o procedimento e quem aprova."
4. Rótulo "SITUAÇÕES FREQUENTES" + grid 2×2 (gap 12px) de cards clicáveis em `--panel`:
   pip colorido 9px + área (uppercase 10px muted) + texto 13.5px/500.
   Hover: `transform: translateY(-2px)`, transição .15s.

Cards (área → texto):
- Financeiro → "Preciso lançar uma nota de 12/06 e a competência está fechada"
- Comercial → "Como libero um desconto acima do limite da minha alçada?"
- Cadastro → "Cliente novo sem CNPJ ativo — como cadastro sem travar o pedido?"
- Estoque → "Ajuste de estoque em lote não existe na tela de inventário"

### 2. Sidebar (fixa)
Topo: marca (círculo 18px a1 + blob 18px a2 + pill 26×13 a3) e botão de recolher (ícone lucide `panel-left`).
Botão "Nova conversa" (fundo a1, texto onA1, ícone plus, 13px/600, hover `brightness(1.07)`, active `brightness(.94)`).
Busca: campo em `--sub`, ícone `search`, placeholder "Buscar conversas" — filtra os títulos do histórico.
Histórico em grupos "HOJE" / "ESTA SEMANA"; cada item: dot 7px (a1 quando ativo, senão line),
título truncado e preview truncado 10.5px muted. Item ativo com fundo `--sub`; hover `--hov`.
Rodapé: avatar 32px com iniciais "MA", "Marina Almeida" / "Operações · perfil padrão", botão de settings.

Itens do histórico (título → preview → resposta associada):
- Hoje: "Lançar nota fora do prazo" → "Registro extemporâneo no período aberto" → resposta FIN
- Hoje: "Desconto acima da alçada" → "Fluxo de exceção comercial" → resposta COM
- Semana: "Cadastro sem CNPJ ativo" → "Registro provisório de 30 dias" → resposta CAD
- Semana: "Ajuste de estoque em lote" → "Importação de planilha modelo" → resposta EST
- Semana: "Reabrir pedido já faturado" → "Devolução simbólica + refaturamento" → resposta FIN

### 3. Header
Título da conversa (13.5px/600, truncado em 54 chars + "…") + chip "Procedimentos v4.2 · 412 docs"
com ícone `file-text`. À direita: botão "Parar" (só durante streaming, quadrado 9px em a1 + label),
"Exportar" (ícone `download`) e "Fontes" (ícone `book`, fundo `--sub` quando o painel está aberto).

### 4. Conversa
- **Mensagem do usuário**: alinhada à direita, max-width 78%, fundo a1, texto onA1, padding 14px 18px.
- **Mensagem do bot**: avatar 30px circular em a3 + coluna. Balão em `--sub`, padding 16px 20px:
  - texto da resposta (com cursor durante o streaming: bloco 8×15px em a1, raio 2px);
  - divisor 1px + lista de passos: badge quadrado 20px raio 7px em `--panel` com o número (10.5px/700) + texto;
  - nota de exceção: caixa em `--panel`, raio 14px, dot 14px em a2 + texto 12px muted.
- **Fontes**: rótulo "FONTES" + pills com borda 1px `--line`, ícone `file-text` e a referência. Clique abre o painel lateral.
- **Ações**: Copiar / Útil / Impreciso (11px muted, hover `--hov`), aparecem só quando a resposta termina.
- **Thinking**: avatar + balão com 3 dots animados (keyframe `dot`, 1.1s, delays 0/.15s/.3s) e o texto "Consultando procedimentos…".

### 5. Composer
Caixa em `--panel`, raio 24px. Textarea 2 linhas, placeholder "Descreva a situação e o que o sistema bloqueou…".
Linha inferior: "Anexar print" (ícone `paperclip`) e "Escolher módulo" (ícone `square-plus`) à esquerda;
contador à direita — "Enter envia · Shift+Enter quebra linha" quando vazio, senão "N/2000" —
e botão enviar circular 38px (a1/onA1 quando há texto; `--sub`/muted quando vazio), ícone `arrow-up`.
Abaixo: disclaimer 10.5px muted "Respostas citam o procedimento vigente. Alterações no sistema seguem a aprovação indicada." e o seletor de paleta (4 bolinhas 18px; a ativa ganha `box-shadow: 0 0 0 2px var(--bg), 0 0 0 3.5px <a1>`).

*Nota:* o seletor de paleta é ferramenta de avaliação de design. Em produção, promover a
preferência de tema para as configurações do usuário ou remover, mantendo uma paleta.

### 6. Painel de fonte (340px, à direita)
Cabeçalho "FONTE CITADA" + fechar. Corpo: título do documento (15px/600), pills de referência e
data de revisão, trecho do procedimento em caixa `--sub` (12.5px/1.65), bloco "APROVAÇÃO"
(avatar 28px "RF", nome e papel) e botão primário "Abrir documento completo" (ícone `external-link`).
Entrada com animação `fadeUp` .2s.

## Interactions & Behavior
1. Clique em sugestão ou item do histórico, ou Enter no composer → adiciona a mensagem do usuário,
   limpa o input, define o título da thread e entra em **thinking**.
2. Após **900ms**, thinking → streaming: revela o texto da resposta por `setInterval` de **26ms**,
   `3 * streamSpeed` caracteres por tick.
3. Ao terminar o texto: aparecem passos, nota, fontes e barra de ações (tudo condicionado a
   `shown >= text.length`).
4. "Parar" cancela os timers e revela a resposta completa imediatamente.
5. "Nova conversa" limpa mensagens, título e fecha o painel de fontes.
6. Clique num chip de fonte abre o painel com o documento correspondente.
7. Busca filtra o histórico por substring no título; grupos vazios somem.
8. Envio por texto livre: casa com a sugestão cuja frase contenha alguma palavra >4 letras do input;
   sem match, cai na resposta FIN. **Em produção isso vira a chamada real ao backend/LLM.**
9. Transições: .15s em hover/fundo; `fadeUp` .3s na entrada da tela.
10. Estados não cobertos e necessários em produção: erro de rede, resposta sem fonte,
    thread vazia após busca, sessão expirada, mobile.

## State Management
```
palette: 'lavanda'|'barro'|'escuro'|'menta'
input: string
query: string            // busca da sidebar
messages: [{role:'user'|'bot', text?, key?}]
thinking: boolean
streaming: boolean
shown: number            // chars revelados da resposta corrente
activeKey: 'fin'|'com'|'cad'|'est'|null
activeSource: string     // id do documento
sourcesOpen: boolean
threadTitle: string
selected: number         // índice do item ativo na sidebar
```
Timers: um `setTimeout` (delay do thinking) e um `setInterval` (streaming) — limpar no unmount.

Em produção, substituir o conteúdo mockado por: `GET /threads`, `GET /threads/:id/messages`,
`POST /messages` com resposta em stream (SSE) e `GET /documents/:ref` para o painel de fonte.

## Conteúdo mockado
As quatro respostas (fin/com/cad/est) e os quatro documentos (POP-FIN-014, ERP-COM-221,
POP-CAD-008, POP-EST-031) estão no topo da classe de lógica do arquivo HTML — copiar de lá
para um `src/data/mock.js` enquanto o backend não existe.

## Assets
Sem imagens. Ícones: **Lucide** — `panel-left, plus, search, settings, file-text, download, book,
copy, thumbs-up, thumbs-down, paperclip, square-plus, arrow-up, x, external-link`.
Recomendo instalar `lucide-react` em vez de manter os SVGs inline do protótipo.
Fonte: Archivo via Google Fonts.

## Sugestão de estrutura no codebase (`hackaton-op`)
```
src/
  App.jsx                  // layout: Sidebar + Main (+ SourcePanel)
  theme/palettes.js        // os 4 objetos de tema
  theme/theme.css          // :root e classes utilitárias sobre as vars
  components/Sidebar.jsx
  components/ChatHeader.jsx
  components/EmptyState.jsx
  components/MessageList.jsx
  components/BotMessage.jsx
  components/Composer.jsx
  components/SourcePanel.jsx
  hooks/useChat.js         // messages, thinking, streaming, ask(), stop(), reset()
  data/mock.js
```
O scaffold atual (`App.jsx`, `App.css`, `src/assets/*`, `public/icons.svg`) é o template padrão do
Vite e pode ser removido.

## Files
- `Chatbot Interno - Clay HiFi.dc.html` — protótipo de alta fidelidade (markup + lógica).
- Este README.
