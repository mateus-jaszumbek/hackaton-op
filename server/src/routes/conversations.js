import { Router } from 'express'
import { getConversation, listConversations, listMessages } from '../db/conversations.js'

export const conversationsRouter = Router()

conversationsRouter.get('/', (_req, res) => {
  res.json(listConversations())
})

conversationsRouter.get('/:id/messages', (req, res) => {
  const conversation = getConversation(req.params.id)
  if (!conversation) return res.status(404).json({ error: 'Conversa não encontrada' })
  res.json(listMessages(req.params.id))
})
