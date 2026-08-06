# server

Backend mínimo para o Agente Interno de Procedimentos. Sem autenticação — todo request é tratado
como o mesmo usuário fixo (`CURRENT_USER` em `src/config.js`). Persistência em PostgreSQL via
`pg` — necessário porque o plano Free do Render não tem Persistent Disk, então um SQLite local
seria zerado a cada deploy/sleep do serviço.

## Rodando

```bash
cd server
npm install
cp .env.example .env   # preencher DATABASE_URL e N8N_WEBHOOK_URL
npm run dev             # http://localhost:8787
```

`DATABASE_URL` é a connection string de um Postgres (local, [Neon](https://neon.tech),
[Supabase](https://supabase.com) etc). Recomendado: Neon free tier — não expira e faz
autosuspend/resume sozinho na primeira query após um período ocioso (só demora um pouco na
próxima chamada). O schema (tabelas, índices) é criado automaticamente no boot do servidor
(`ensureSchema()` em `src/db/index.js`).

Sem `N8N_WEBHOOK_URL` configurado, `/api/chat` responde com um eco de stub — dá pra testar a
integração do front antes do workflow do n8n existir.

## Endpoints

- `GET /api/health` → `{ ok: true }`
- `GET /api/me` → usuário fixo `{ id, name, role }`
- `GET /api/conversations` → lista de conversas (`id`, `title`, `preview`, `created_at`, `updated_at`), mais recente primeiro
- `GET /api/conversations/:id/messages` → mensagens da conversa (`id`, `role`, `text`, `created_at`)
- `POST /api/chat` — body `{ conversationId?: string, text: string }`
  - Sem `conversationId`, cria uma conversa nova (título = texto truncado em 54 chars)
  - Salva a mensagem do usuário, chama o webhook do n8n com `{ conversationId, message, history, user }`,
    salva a resposta e devolve `{ conversationId, title, reply: { text, steps, note, id, createdAt } }`
  - Se o n8n responder erro ou estiver fora do ar, devolve `502 { error, detail }`

## Contrato esperado do workflow n8n

Requisição (do server para o webhook):

```json
{
  "conversationId": "uuid",
  "message": "texto do usuário",
  "history": [{ "role": "user" | "assistant", "text": "..." }],
  "user": { "id": "teste-hackaton", "name": "Teste hackaton", "role": "Operações · perfil padrão" }
}
```

Resposta esperada do webhook (o node final do workflow deve responder isso como JSON):

```json
{ "text": "resposta do agente", "steps": ["opcional"], "note": "opcional" }
```

## Próximo passo

O front (`src/`) ainda fala só com os mocks de `src/services/chat.js` — falta trocar isso por
chamadas para este servidor (`fetch('http://localhost:8787/api/...')`).
