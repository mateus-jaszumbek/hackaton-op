import { Router } from 'express'
import { getConversation, listConversations, listMessages } from '../db/conversations.js'

export const conversationsRouter = Router()

conversationsRouter.get('/', async (_req, res) => {
  res.json(await listConversations())
})

conversationsRouter.get('/:id/messages', async (req, res) => {
  const conversation = await getConversation(req.params.id)
  if (!conversation) return res.status(404).json({ error: 'Conversa não encontrada' })
  res.json(await listMessages(req.params.id))
})
