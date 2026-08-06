import { randomUUID } from 'node:crypto'
import { db } from './index.js'

function toApi(c) {
  return {
    id: c.id,
    conversationId: c.conversation_id,
    title: c.title,
    description: c.description,
    priority: c.priority,
    status: c.status,
    createdAt: Number(c.created_at),
    updatedAt: Number(c.updated_at),
  }
}

export async function createCase({ conversationId = null, title, description, priority }) {
  const id = randomUUID()
  const now = Date.now()
  const { rows } = await db.query(
    `INSERT INTO cases (id, conversation_id, title, description, priority, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [id, conversationId, title, description, priority, 'aberto', now, now],
  )
  return toApi(rows[0])
}

export async function getCase(id) {
  const { rows } = await db.query(`SELECT * FROM cases WHERE id = $1`, [id])
  return rows[0] ? toApi(rows[0]) : null
}

export async function findRecentCaseByConversation(conversationId, windowMs) {
  if (!conversationId) return null
  const { rows } = await db.query(
    `SELECT * FROM cases WHERE conversation_id = $1 AND created_at > $2 ORDER BY created_at DESC LIMIT 1`,
    [conversationId, Date.now() - windowMs],
  )
  return rows[0] ? toApi(rows[0]) : null
}
