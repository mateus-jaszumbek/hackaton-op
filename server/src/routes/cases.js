import { Router } from 'express'
import { createCase, findRecentCaseByConversation, getCase } from '../db/cases.js'
import { getConversation } from '../db/conversations.js'
import { BACKEND_API_KEY } from '../config.js'

const PRIORITIES = ['baixa', 'media', 'alta']
const DEDUP_WINDOW_MS = 10 * 60 * 1000

export const casesRouter = Router()

casesRouter.use((req, res, next) => {
  if (!BACKEND_API_KEY) return next()
  if (req.get('x-api-key') !== BACKEND_API_KEY) {
    return res.status(401).json({ error: 'x-api-key inválida ou ausente' })
  }
  next()
})

casesRouter.post('/', async (req, res) => {
  const { conversationId, title, description, priority } = req.body ?? {}

  const trimmedTitle = typeof title === 'string' ? title.trim() : ''
  const trimmedDescription = typeof description === 'string' ? description.trim() : ''

  if (!trimmedTitle) return res.status(400).json({ error: 'title é obrigatório' })
  if (!trimmedDescription) return res.status(400).json({ error: 'description é obrigatório' })
  if (!PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: `priority deve ser um de: ${PRIORITIES.join(', ')}` })
  }
  if (conversationId && !(await getConversation(conversationId))) {
    return res.status(404).json({ error: 'Conversa não encontrada' })
  }

  const recent = await findRecentCaseByConversation(conversationId, DEDUP_WINDOW_MS)
  if (recent) return res.status(200).json(recent)

  const created = await createCase({
    conversationId: conversationId ?? null,
    title: trimmedTitle,
    description: trimmedDescription,
    priority,
  })
  res.status(201).json(created)
})

casesRouter.get('/:id', async (req, res) => {
  const found = await getCase(req.params.id)
  if (!found) return res.status(404).json({ error: 'Case não encontrado' })
  res.json(found)
})
