import { randomUUID } from 'node:crypto'
import { db } from './index.js'
import { TITLE_MAX } from '../lib/text.js'

function truncateTitle(text) {
  return text.length > TITLE_MAX ? `${text.slice(0, TITLE_MAX)}…` : text
}

function toConversationApi(c) {
  return { id: c.id, title: c.title, createdAt: Number(c.created_at), updatedAt: Number(c.updated_at) }
}

export async function createConversation(title) {
  const id = randomUUID()
  const now = Date.now()
  await db.query(`INSERT INTO conversations (id, title, created_at, updated_at) VALUES ($1, $2, $3, $4)`, [
    id,
    truncateTitle(title),
    now,
    now,
  ])
  return getConversation(id)
}

export async function getConversation(id) {
  const { rows } = await db.query(`SELECT * FROM conversations WHERE id = $1`, [id])
  return rows[0] ? toConversationApi(rows[0]) : null
}

export async function listConversations() {
  const { rows } = await db.query(`SELECT * FROM conversations ORDER BY updated_at DESC`)
  const conversations = rows.map(toConversationApi)

  const previews = await Promise.all(
    conversations.map((c) =>
      db.query(
        `SELECT text FROM messages WHERE conversation_id = $1 AND role = 'user' ORDER BY created_at DESC LIMIT 1`,
        [c.id],
      ),
    ),
  )

  return conversations.map((c, i) => ({ ...c, preview: previews[i].rows[0]?.text ?? '' }))
}

export async function addMessage(conversationId, role, text, { steps = [], note = '', source = 'ia' } = {}) {
  const id = randomUUID()
  const now = Date.now()
  await db.query(
    `INSERT INTO messages (id, conversation_id, role, text, steps_json, note, source, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, conversationId, role, text, JSON.stringify(steps), note, source, now],
  )
  await db.query(`UPDATE conversations SET updated_at = $1 WHERE id = $2`, [now, conversationId])
  return { id, conversationId, role, text, steps, note, source, createdAt: now }
}

export async function listMessages(conversationId) {
  const { rows } = await db.query(`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`, [
    conversationId,
  ])
  return rows.map(toMessageApi)
}

function toMessageApi(m) {
  return {
    id: m.id,
    conversationId: m.conversation_id,
    role: m.role,
    text: m.text,
    steps: JSON.parse(m.steps_json),
    note: m.note,
    source: m.source,
    pendingUseCase: m.pending_use_case_json ? JSON.parse(m.pending_use_case_json) : null,
    useCaseSaved: m.use_case_saved,
    createdAt: Number(m.created_at),
  }
}

export async function getMessage(id) {
  const { rows } = await db.query(`SELECT * FROM messages WHERE id = $1`, [id])
  return rows[0] ? toMessageApi(rows[0]) : null
}

export async function attachPendingUseCase(conversationId, pendingUseCase) {
  const { rows } = await db.query(
    `SELECT id FROM messages WHERE conversation_id = $1 AND role = 'assistant' ORDER BY created_at DESC LIMIT 1`,
    [conversationId],
  )
  const messageId = rows[0]?.id
  if (!messageId) return null

  await db.query(`UPDATE messages SET pending_use_case_json = $1 WHERE id = $2`, [
    JSON.stringify(pendingUseCase),
    messageId,
  ])
  return messageId
}

export async function markUseCaseSaved(messageId) {
  await db.query(`UPDATE messages SET use_case_saved = true WHERE id = $1`, [messageId])
}
