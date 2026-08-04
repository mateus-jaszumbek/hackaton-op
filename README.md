# Agente Interno de Procedimentos

Front-end (Vite + React) + backend (Express + SQLite) para o chat do agente interno. Sem
autenticação — todo mundo usa o mesmo usuário fixo (`Teste hackaton`). Ver `server/README.md`
para detalhes da API e do contrato esperado do webhook do n8n.

## Rodando o projeto

Requisitos: Node 22+ (usa `node:sqlite`, nativo do runtime).

```bash
npm run install:all   # instala as dependências da raiz (front) e de /server (back) — só na primeira vez
npm run dev:all       # sobe front + back juntos
```

- Front: `http://localhost:5173`
- Back: `http://localhost:8787`

Sem `N8N_WEBHOOK_URL` configurado em `server/.env` (crie a partir de `server/.env.example`), o
agente responde um eco de stub — dá pra testar o fluxo completo antes de plugar o workflow do n8n.

## Comandos individuais

```bash
npm run dev           # só o front
npm run dev:server    # só o back
npm run build          # build de produção do front
npm run lint           # oxlint
```
