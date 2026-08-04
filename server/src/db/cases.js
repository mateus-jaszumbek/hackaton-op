import { randomUUID } from 'node:crypto'
import { db } from './index.js'

const insertCase = db.prepare(
  `INSERT INTO cases (id, conversation_id, title, description, priority, status, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
)
const selectCase = db.prepare(`SELECT * FROM cases WHERE id = ?`)
const selectRecentCaseByConversation = db.prepare(
  `SELECT * FROM cases WHERE conversation_id = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1`,
)

function toApi(c) {
  return {
    id: c.id,
    conversationId: c.conversation_id,
    title: c.title,
    description: c.description,
    priority: c.priority,
    status: c.status,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
  }
}

export function createCase({ conversationId = null, title, description, priority }) {
  const id = randomUUID()
  const now = Date.now()
  insertCase.run(id, conversationId, title, description, priority, 'aberto', now, now)
  return toApi(selectCase.get(id))
}

export function getCase(id) {
  const c = selectCase.get(id)
  return c ? toApi(c) : null
}

export function findRecentCaseByConversation(conversationId, windowMs) {
  if (!conversationId) return null
  const c = selectRecentCaseByConversation.get(conversationId, Date.now() - windowMs)
  return c ? toApi(c) : null
}
