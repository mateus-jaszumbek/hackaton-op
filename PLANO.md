# Plano de implementação — Agente Interno de Procedimentos

Documento de execução. Escrito para ser aberto em uma sessão nova, sem contexto anterior.

## 1. Contexto

Recriar no codebase (`hackaton-op`: Vite + React 19, JS puro, CSS simples, sem lib de UI) a tela
de chat do agente interno de procedimentos, a partir do design de alta fidelidade em
`design_handoff_agente_interno/`.

Arquivos de referência:

- `design_handoff_agente_interno/Chatbot Interno - Clay HiFi.dc.html` — **a fonte da verdade**.
  Markup nas linhas 24–268; toda a lógica e o conteúdo mockado na classe `Component` (linhas 272–481).
- `design_handoff_agente_interno/README.md` — especificação de tokens, telas e comportamento.
- `design_handoff_agente_interno/support.js` — runtime do Claude Design. **Irrelevante, ignorar.**
- `design-chatbot.pdf` na raiz — **ignorar** (decisão do time).

O protótipo é referência de aparência e comportamento, **não** código para copiar: ele usa um
runtime próprio (`sc-if`, `sc-for`, `style-hover`, estilos inline gerados em JS).

**Fidelidade alta**: cores, tipografia, espaçamentos, raios, estados e microinterações são finais.
O alvo de comparação pixel-perfect é **1440×900**.

---

## 2. Estado atual do repo (já executado)

A Fase 0 está **concluída**:

- [x] `npm install lucide-react @fontsource-variable/archivo` (ambos já em `package.json`)
- [x] Removidos `src/App.css`, `src/assets/`, `public/icons.svg`
- [x] `src/App.jsx` reduzido a um placeholder (era o exemplo do Vite, que importava os assets removidos)

Ainda intactos e **a serem substituídos**: `src/index.css` (CSS do template Vite),
`index.html` (`lang="en"`, título `hackaton-op`), `public/favicon.svg` (logo do Vite).

Nada além disso foi implementado. `npm run dev` sobe com a página placeholder.

Scripts: `npm run dev` · `npm run build` · `npm run lint` (oxlint).

---

## 3. Decisões travadas

| # | Decisão |
|---|---|
| 1 | `design-chatbot.pdf` ignorado |
| 2 | Apenas **2 paletas**: `menta` (Menta fria, padrão) e `escuro` (Escuro suave). O seletor de paleta do design vira um toggle de 2 bolinhas. As paletas `lavanda` e `barro` do handoff **não** entram |
| 3 | **Sem escopo mobile** — produto web/desktop. Piso em `min-width: 1024px`; abaixo disso rola na horizontal, sem drawers e sem layout mobile |
| 4 | O botão `panel-left` **colapsa** a sidebar para uma faixa de ícones (68px), não a esconde |
| 5 | Só front-end. Conteúdo mockado atrás de `services/chat.js`; nenhuma integração de backend |

---

## 4. Estratégia de proporções (ponto central)

O protótipo tem `width:1440px;height:900px` **hardcoded** — é o tamanho do viewport do visualizador
do Claude Design. Isso precisa virar layout fluido que preenche a janela real.

A boa notícia: o interior do design já é fluido (coluna central `max-width:720px` centralizada,
`flex:1`, `min-width:0`). O trabalho é quase todo no shell — os espaçamentos internos não mudam.

### 4.1 Shell

```css
/* reset.css */
html, body, #root { height: 100%; }
body { overflow-x: auto; }   /* abaixo de 1024px rola na horizontal */

/* Shell.module.css */
.app {
  height: 100vh;
  height: 100dvh;      /* dvh depois do vh: fallback para navegadores antigos */
  min-width: 1024px;
  display: flex;
  overflow: hidden;    /* a página nunca rola; só as 3 áreas internas */
}
```

**Regra de ouro:** todo ancestral flex de uma área com `overflow-y:auto` precisa de `min-height:0`
(e `min-width:0` nas colunas). Se esquecer, a lista de mensagens estoura a altura da tela em vez de
rolar. O protótipo já faz isso em dois pontos (`min-height:0` na linha do corpo, `min-width:0` no
`<main>`) — replicar em **todos** os níveis da cadeia.

Áreas que rolam, e só elas: histórico da sidebar, lista de mensagens, corpo do painel de fonte.

### 4.2 Faixas de largura

| Faixa | Comportamento |
|---|---|
| `≥ 1400px` | Como especificado: sidebar 272 · chat fluido · painel de fonte 340 |
| `1100–1400px` | Painel de fonte 320px; `--gutter` cai de 32 para ~24px. A coluna central absorve a diferença |
| `< 1100px` | Painel de fonte vira overlay ancorado à direita (`position:absolute`, altura total, backdrop translúcido) — empurrar deixaria o chat abaixo de 400px |
| `< 1024px` | Fora de escopo: `min-width` no shell gera scroll horizontal |

Também: com a sidebar colapsada (68px), tudo ganha 204px de folga — o layout fica confortável até
mais estreito.

### 4.3 O que escala com `clamp()`

Fidelidade alta = manter os px do handoff no desktop. Escalar só onde o valor fixo quebra:

```css
--gutter: clamp(20px, 2.2vw, 32px);   /* padding horizontal de header / mensagens / composer */
--h1: clamp(28px, 2.6vw, 36px);       /* H1 do estado vazio */
```

Todo o resto fica em px literal (13.5px de corpo, 12.5px dos passos, 9.5px dos rótulos, raios) —
é o que garante o pixel-perfect em 1440.

Altura curta (`@media (max-height: 700px)`): esconder a faixa de formas clay (é decorativa) e
reduzir o `padding-top` do estado vazio de 56 → 24px, senão o composer é empurrado fora da tela.

### 4.4 Validação

Comparação lado a lado com o protótipo aberto no navegador em **1440×900**, e sanidade em
**1280×800**, **1152×864** e **1024×768**, além de zoom 125% / 150%.

---

## 5. Arquitetura de arquivos

```
src/
  main.jsx                       # imports dos CSS globais + fonte
  App.jsx                        # PaletteProvider + Shell
  styles/
    reset.css                    # box-sizing, resets de form, scrollbar, ::selection, focus-visible
    tokens.css                   # as 2 paletas + tokens de layout
    animations.css               # keyframes dot / fadeUp + prefers-reduced-motion
  theme/
    palettes.js                  # [{key, name, a1}] + DEFAULT_PAL
    palette-context.js           # createContext + hook usePalette
    PaletteProvider.jsx          # só o componente (regra do oxlint)
  data/
    answers.js                   # ANSWERS: fin / com / cad / est
    sources.js                   # SOURCES: POP-FIN-014, ERP-COM-221, POP-CAD-008, POP-EST-031
    suggestions.js               # SUGGESTIONS (4 cards do estado vazio)
    history.js                   # HISTORY (2 grupos, 5 itens) — com id estável por item
  services/
    chat.js                      # matchKey(texto) + getAnswer(key). Único ponto de integração futura
  hooks/
    useChat.js                   # useReducer: msgs, phase, shown, key, title + ask/stop/reset
    useAutosize.js               # altura do textarea
    useLocalStorage.js           # persistência da paleta
  components/
    Shell.jsx
    sidebar/    Sidebar · SearchBox · HistoryList · UserCard
    header/     ChatHeader
    chat/       EmptyState · ClayShapes · MessageList · UserMessage · BotMessage
                Steps · ExceptionNote · SourceChips · MessageActions · Thinking
    composer/   Composer · PaletteSwitcher
    source/     SourcePanel
    ui/         IconButton
```

**CSS Modules** (`Componente.module.css`, colocado ao lado do `.jsx`): suporte nativo do Vite, zero
dependência, escopo garantido, sem BEM manual e sem os ~200 `style=` inline do protótipo.
Estilo inline fica reservado a valor genuinamente dinâmico, e sempre como CSS var:
`style={{ '--pip': cor }}`.

---

## 6. Tokens

Aplicar `data-pal` em `document.documentElement` (não num wrapper) para que o `background` do body e
os scrollbars nativos acompanhem a paleta.

```css
/* tokens.css */
[data-pal='menta'] {
  --bg:#e6f3f1; --panel:#fafdfc; --sub:#dcece9; --ink:#1e3b38; --muted:#6d918c;
  --line:rgba(20,70,65,.12); --hov:rgba(20,70,65,.05);
  --a1:#33ac96; --a2:#6b8ff0; --a3:#ffcf6b; --on-a1:#fff;
  color-scheme: light;
}
[data-pal='escuro'] {
  --bg:#1f1c2c; --panel:#2b2740; --sub:#353052; --ink:#ece9f7; --muted:#9d96c4;
  --line:rgba(255,255,255,.09); --hov:rgba(255,255,255,.05);
  --a1:#8b7bf7; --a2:#ff8fa8; --a3:#6fd8c4; --on-a1:#fff;
  color-scheme: dark;
}
:root {
  --sidebar: 272px; --rail: 68px; --src-panel: 340px; --col: 720px;
  --gutter: clamp(20px, 2.2vw, 32px);
  --h1: clamp(28px, 2.6vw, 36px);
}
@media (max-width: 1400px) { :root { --src-panel: 320px } }
```

Trocar paleta = trocar um atributo → zero re-render em cascata. O protótipo recalculava o objeto de
estilos de **todos** os nós a cada troca.

**Estilo**: claymorphism *plano* — formas macias, raios grandes, **sem sombra** interna ou externa.
Separação por preenchimento de cor + divisores de 1px em `--line`. Nunca adicionar relevo.

**Tipografia** — Archivo (self-hosted via `@fontsource-variable/archivo`, pesos 400–700):

| Uso | Valor |
|---|---|
| H1 do estado vazio | `var(--h1)` / 1.1 / 700 / `-.025em` |
| Parágrafo do estado vazio | 14.5px / 1.6 / 400 / `--muted` |
| Corpo de mensagem | 13.5px / 1.5–1.6 / 400 |
| Passos numerados | 12.5px / 1.55 |
| Item da sidebar | título 12.5px / 500–600 · preview 10.5px `--muted` |
| Rótulo de seção | 9.5px / 600 / uppercase / `.14em` / `--muted` |
| Chips e botões-texto | 11–12.5px |

**Raios**: sidebar `0 28px 28px 0` · painéis 24 · composer 24 · card de sugestão 18 ·
balão do usuário `20px 20px 6px 20px` · balão do bot `20px 20px 20px 6px` · campos 14 ·
botões da sidebar 14–16 · chips/pills 999 · botão enviar 50%.

**Espaçamento**: sidebar padding `20px 16px`, gap 18 · header 64px de altura, padding `0 var(--gutter)`,
borda inferior 1px · mensagens padding `32px var(--gutter) 8px`, coluna `max-width:720px` centralizada,
gap 26 entre mensagens · composer padding `12px var(--gutter) 24px`, caixa `14px 16px 12px` ·
painel de fonte borda esquerda 1px.

**Animações**: `dot` (1.1s, delays 0 / .15s / .3s) nos 3 pontos do thinking; `fadeUp .3s` na entrada
da tela e `.2s` no painel de fonte. Envolver tudo em `@media (prefers-reduced-motion: reduce)` —
com os pontos do thinking estáticos em opacidade 1 (não 0.4) para não parecerem desligados.

---

## 7. Estado e streaming

O protótipo tem 11 campos de estado correlacionados. Substituir por uma **máquina de estados** em
`useReducer` dentro de `useChat`:

```
phase: 'idle' | 'thinking' | 'streaming' | 'done'
msgs · shown · key · title
```

`input`, `query`, `sourcesOpen`, `activeSource`, `collapsed` e `selected` **não** são estado do chat —
ficam locais no componente que os usa (`Composer`, `SearchBox`, `Shell`).

Constantes nomeadas no topo de `useChat.js`:

```js
const THINK_MS = 900          // atraso do thinking antes da resposta
const TICK_MS = 26            // intervalo de revelação
const CHARS_PER_TICK = 3      // caracteres por tick
export const TITLE_MAX = 54   // truncagem do título da thread
export const MAX_CHARS = 2000 // limite do composer
```

Timers **dirigidos por efeito**, não imperativos — é o que torna o código imune ao double-mount do
StrictMode e dispensa `useRef` + limpeza manual:

```js
useEffect(() => {
  if (st.phase !== 'thinking') return
  const t = setTimeout(() => dispatch({ type: 'reply' }), THINK_MS)
  return () => clearTimeout(t)
}, [st.phase])

useEffect(() => {
  if (st.phase !== 'streaming') return
  const len = getAnswer(st.key).text.length
  const t = setInterval(() => dispatch({ type: 'tick', len }), TICK_MS)
  return () => clearInterval(t)
}, [st.phase, st.key])
```

Ações do reducer: `ask` (limpa e insere a mensagem do usuário, `phase:'thinking'`) ·
`reply` (insere a mensagem do bot, `phase:'streaming'`, `shown:0`) · `tick` (soma `CHARS_PER_TICK`;
ao atingir `len`, `phase:'done'`) · `reveal` (usado pelo botão **Parar**: `shown = len`,
`phase:'done'`) · `reset`.

Ids de mensagem: contador de módulo (`let seq = 0`), não índice de array nem `Date.now()`.

Passos, nota de exceção, chips de fonte e barra de ações só aparecem quando `phase === 'done'`
(no protótipo: `shown >= text.length`).

**Auto-scroll**: a lista de mensagens precisa rolar para o fim conforme o texto é revelado. O
protótipo não faz isso porque o canvas é fixo; na tela real é obrigatório.

**Integração futura** (fora do escopo agora): `services/chat.js` é o único arquivo a mudar —
`POST /messages` com resposta em stream (SSE), `GET /threads`, `GET /documents/:ref`. Nenhum
componente é afetado.

---

## 8. Padrões de código

- Componente função, **um por arquivo**, export nomeado, props desestruturadas na assinatura.
  (`App.jsx` mantém default export, convenção do template.)
- **Nomes curtos em escopo local e derivado** (`pal`, `msgs`, `q`, `idx`, `st`, `src`, `doc`), nomes
  explícitos na API pública de componentes e hooks (`onSelectThread`, `activeKey`, `isStreaming`).
  O nome cresce com o alcance.
- Derivar em render com `useMemo` (ex.: grupos do histórico filtrados pela busca). Nunca sincronizar
  estado derivado com `useEffect`.
- `key` por id estável — atenção: no histórico a chave de resposta `fin` aparece **duas vezes**, por
  isso cada item precisa de `id` próprio.
- Nenhum `<div>` clicável: `<button>`, `<aside>`, `<main>`, `<header>`. Composer dentro de
  `<form onSubmit>`.
- `npm run lint` limpo ao fim de cada fase. Atenção à regra `react/only-export-components`: não
  exportar hook e componente do mesmo arquivo (daí o split `palette-context.js` / `PaletteProvider.jsx`).

---

## 9. Fases

Fases 1–3 são fundação e saem em ordem. 4–9 são independentes entre si depois disso.

| # | Fase | Entrega / critério de aceite |
|---|---|---|
| 0 | ~~Limpeza + deps~~ | **Feito** — ver seção 2 |
| 1 | **Shell responsivo** | `reset.css` + `Shell` de 3 colunas em `100dvh`, sem scroll de página, com as faixas da seção 4. `index.html` com `lang="pt-BR"` e título "Agente Interno de Procedimentos"; favicon do Vite trocado. Validado nas 4 larguras |
| 2 | **Tokens + paletas** | 2 paletas em `tokens.css`, `PaletteProvider`, toggle funcional, persistência em `localStorage`. Troca instantânea, sem flash no carregamento (ler o valor no inicializador do `useState`) |
| 3 | **Dados + serviço** | `data/*` extraídos do HTML (4 respostas, 4 documentos, 4 sugestões, 5 itens de histórico) + `services/chat.js` com `matchKey` e `getAnswer` |
| 4 | **Sidebar** | Marca (3 formas clay), toggle de colapso, "Nova conversa", busca filtrando por substring no título (grupos vazios desaparecem; mostrar "Nenhuma conversa" quando tudo filtra), histórico com dot ativo/hover, rodapé "MA / Marina Almeida / Operações · perfil padrão" + settings. **Modo colapsado (68px)**: marca reduzida ao círculo, toggle, botão "+" quadrado, botão de busca (clicar expande e foca o campo), histórico como botões-dot com `title`/`aria-label`, avatar e settings no rodapé |
| 5 | **Header** | Título truncado em 54 chars + "…", chip "Procedimentos v4.2 · 412 docs", botões Parar (só durante streaming) / Exportar / Fontes (fundo `--sub` quando o painel está aberto) |
| 6 | **Estado vazio** | Faixa de 4 formas clay alinhadas à base, H1 com quebra manual, parágrafo, rótulo "SITUAÇÕES FREQUENTES" + grid 2×2 de cards com hover `translateY(-2px)` em .15s |
| 7 | **Conversa** | `useChat` completo: thinking (3 pontos + "Consultando procedimentos…") → streaming com caret 8×15px → passos, nota, fontes e ações ao terminar. "Parar" revela tudo imediatamente. Auto-scroll durante o stream |
| 8 | **Composer** | Textarea autosize (min 42px, máx ~160px com scroll), placeholder do handoff, Enter envia / Shift+Enter quebra, `maxLength=2000`, contador dual, botão enviar circular 38px com dois estados, "Anexar print" / "Escolher módulo" (inertes), disclaimer + toggle de paleta |
| 9 | **Painel de fonte** | 340px à direita, `fadeUp .2s`, título / pills / trecho / bloco APROVAÇÃO / CTA "Abrir documento completo". Overlay abaixo de 1100px. Abre ao clicar num chip de fonte, com o documento correspondente |
| 10 | **A11y + polimento** | `aria-label` em todo botão só-ícone, `role="log" aria-live="polite"` na lista de mensagens, `:focus-visible` em `--a1`, navegação por teclado, `prefers-reduced-motion`. Checklist da seção 13. `npm run lint` e `npm run build` limpos |
| 11 | *(opcional)* | Estados que o protótipo não cobre: erro de rede, resposta sem fonte, sessão expirada |

---

## 10. Ícones

`lucide-react` (já instalado), imports nomeados. Nomes **verificados** no pacote instalado:

`PanelLeft` · `Plus` · `Search` · `Settings` · `FileText` · `Download` · `Book` · `Copy` ·
`ThumbsUp` · `ThumbsDown` · `Paperclip` · `SquarePlus` · `ArrowUp` · `X` · `ExternalLink` ·
`Check` (feedback do "Copiar")

Tamanhos do handoff: 12–17px conforme o contexto. `strokeWidth` padrão 2; usar **2.2** no `Plus` e no
`ArrowUp`, como no protótipo.

Fonte: `import '@fontsource-variable/archivo'` em `main.jsx` — self-hosted, sem CDN e sem FOUT.

---

## 11. Conteúdo mockado — de onde copiar

Tudo está na tag `<script type="text/x-dc">` do arquivo `.dc.html`:

| Constante | Linhas | Destino |
|---|---|---|
| `SOURCES` (4 documentos) | 279–284 | `src/data/sources.js` |
| `ANSWERS` (4 respostas: texto, 3 passos, nota, fontes) | 286–327 | `src/data/answers.js` |
| `SUGGESTIONS` (4 cards) | 329–334 | `src/data/suggestions.js` |
| `HISTORY` (2 grupos, 5 itens) | 336–346 | `src/data/history.js` — **adicionar `id` estável** |

Copiar o texto **literalmente**, incluindo aspas tipográficas (`“Documento de origem”`), `›` nos
caminhos de menu e `…`. As paletas (linhas 272–277) não vão para JS: só `menta` e `escuro`, e vão
para `tokens.css`; `theme/palettes.js` guarda apenas `{key, name, a1}` para o toggle.

Regra de match do texto livre (linha 404): casa com a sugestão cuja frase contenha alguma palavra
com **mais de 4 letras** do input; sem match, cai em `fin`.

---

## 12. Lacunas do protótipo a corrigir na implementação

1. **Acessibilidade**: nenhum botão de ícone tem nome acessível, não há landmarks, o texto em
   streaming não é anunciado, não há indicador de foco.
2. **Semântica**: `<div>` com `onClick`, ausência de `<form>`, `<h1>` sem hierarquia.
3. **Performance**: recriação de todos os objetos de estilo a cada tick de 26ms — resolvido movendo
   estilo para CSS e isolando o texto revelado em seu próprio componente.
4. **StrictMode**: os timers precisam de limpeza idempotente (resolvido pelos efeitos da seção 7).
5. **Movimento**: `dot` e `fadeUp` sem respeito a `prefers-reduced-motion`.
6. **Auto-scroll** ausente na lista de mensagens.
7. **Ações inertes**: "Copiar" deve usar `navigator.clipboard.writeText` com feedback transitório
   (troca o ícone por `Check` e o rótulo por "Copiado" por ~1.6s); "Útil"/"Impreciso" mantêm estado
   local de voto colorido em `--a1`. Sem backend, é o comportamento honesto.
8. **Busca sem resultado**: o protótipo mostra vazio absoluto.

---

## 13. Checklist de fidelidade (Fase 10)

Protótipo aberto ao lado, janela em 1440×900, nas duas paletas:

- [ ] Sidebar 272px, raio `0 28px 28px 0`, gap 18px entre blocos
- [ ] Header 64px com divisor de 1px; chip de versão com fundo `--sub`
- [ ] Coluna de mensagens com 720px, gap 26px, padding-top 32px
- [ ] Balão do usuário à direita, `max-width:78%`, raio `20 20 6 20`
- [ ] Balão do bot com avatar 30px em `--a3`, raio `20 20 20 6`, padding `16px 20px`
- [ ] Badges dos passos: 20px, raio 7px, fundo `--panel`, número 10.5px/700
- [ ] Caret do stream: bloco 8×15px em `--a1`, raio 2px
- [ ] Composer com raio 24px e botão enviar de 38px trocando de cor conforme há texto
- [ ] Painel de fonte 340px com borda esquerda de 1px e entrada `fadeUp`
- [ ] **Nenhuma sombra** em qualquer elemento (claymorphism plano)
- [ ] Página não rola; rolam apenas histórico, mensagens e painel de fonte
- [ ] Sem barra horizontal em 1024px ou mais
- [ ] `npm run lint` e `npm run build` sem avisos
