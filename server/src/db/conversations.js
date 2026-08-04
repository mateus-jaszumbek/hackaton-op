import { randomUUID } from 'node:crypto'
import { db } from './index.js'
import { TITLE_MAX } from '../lib/text.js'

const insertConversation = db.prepare(
  `INSERT INTO conversations (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)`,
)
const touchConversation = db.prepare(`UPDATE conversations SET updated_at = ? WHERE id = ?`)
const insertMessage = db.prepare(
  `INSERT INTO messages (id, conversation_id, role, text, steps_json, note, created_at)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
)
const selectConversation = db.prepare(`SELECT * FROM conversations WHERE id = ?`)
const selectConversations = db.prepare(
  `SELECT * FROM conversations ORDER BY updated_at DESC`,
)
const selectMessages = db.prepare(
  `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`,
)
const selectLastUserMessage = db.prepare(
  `SELECT text FROM messages WHERE conversation_id = ? AND role = 'user' ORDER BY created_at DESC LIMIT 1`,
)

function truncateTitle(text) {
  return text.length > TITLE_MAX ? `${text.slice(0, TITLE_MAX)}…` : text
}

export function createConversation(title) {
  const id = randomUUID()
  const now = Date.now()
  insertConversation.run(id, truncateTitle(title), now, now)
  return selectConversation.get(id)
}

export function getConversation(id) {
  return selectConversation.get(id)
}

export function listConversations() {
  return selectConversations.all().map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.created_at,
    updatedAt: c.updated_at,
    preview: selectLastUserMessage.get(c.id)?.text ?? '',
  }))
}

export function addMessage(conversationId, role, text, { steps = [], note = '' } = {}) {
  const id = randomUUID()
  const now = Date.now()
  insertMessage.run(id, conversationId, role, text, JSON.stringify(steps), note, now)
  touchConversation.run(now, conversationId)
  return { id, conversationId, role, text, steps, note, createdAt: now }
}

export function listMessages(conversationId) {
  return selectMessages.all(conversationId).map((m) => ({
    id: m.id,
    conversationId: m.conversation_id,
    role: m.role,
    text: m.text,
    steps: JSON.parse(m.steps_json),
    note: m.note,
    createdAt: m.created_at,
  }))
}
