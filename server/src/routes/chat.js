import { Router } from 'express'
import { addMessage, createConversation, getConversation, listMessages } from '../db/conversations.js'
import { askAgent } from '../lib/n8n.js'

export const chatRouter = Router()

chatRouter.post('/', async (req, res) => {
  try {
    const { conversationId, text } = req.body ?? {}
    const trimmed = typeof text === 'string' ? text.trim() : ''
    if (!trimmed) return res.status(400).json({ error: 'text é obrigatório' })

    let conversation = conversationId ? getConversation(conversationId) : null
    if (!conversation) conversation = createConversation(trimmed)

    addMessage(conversation.id, 'user', trimmed)
    const history = listMessages(conversation.id).map((m) => ({ role: m.role, text: m.text }))

    let reply
    try {
      reply = await askAgent({ conversationId: conversation.id, text: trimmed, history })
    } catch (err) {
      return res.status(502).json({ error: 'Falha ao consultar o agente', detail: err.message })
    }

    const saved = addMessage(conversation.id, 'assistant', reply.text, {
      steps: reply.steps,
      note: reply.note,
    })

    res.json({
      conversationId: conversation.id,
      title: conversation.title,
      reply: { ...reply, id: saved.id, createdAt: saved.createdAt },
    })
  } catch (err) {
    res.status(500).json({ error: 'Falha ao processar a mensagem', detail: err.message })
  }
})
