import { Router } from 'express'
import {
  addMessage,
  createConversation,
  getConversation,
  getMessage,
  listMessages,
  markUseCaseSaved,
} from '../db/conversations.js'
import { createUseCase } from '../db/useCases.js'
import { askAgent } from '../lib/n8n.js'

export const chatRouter = Router()

chatRouter.post('/', async (req, res) => {
  try {
    const { conversationId, text } = req.body ?? {}
    const trimmed = typeof text === 'string' ? text.trim() : ''
    if (!trimmed) return res.status(400).json({ error: 'text é obrigatório' })

    let conversation = conversationId ? await getConversation(conversationId) : null
    if (!conversation) conversation = await createConversation(trimmed)

    await addMessage(conversation.id, 'user', trimmed)
    const history = (await listMessages(conversation.id)).map((m) => ({ role: m.role, text: m.text }))

    let reply
    try {
      reply = await askAgent({ conversationId: conversation.id, text: trimmed, history })
    } catch (err) {
      return res.status(502).json({ error: 'Falha ao consultar o agente', detail: err.message })
    }

    const saved = await addMessage(conversation.id, 'assistant', reply.text, {
      steps: reply.steps,
      note: reply.note,
      source: reply.source,
      pendingUseCase: reply.pendingUseCase,
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

// Chamado pelo front quando o usuário decide salvar um caso de uso sugerido pela
// IA (botão "salvar pra próximas consultas").
chatRouter.post('/messages/:id/save-use-case', async (req, res) => {
  const message = await getMessage(req.params.id)
  if (!message) return res.status(404).json({ error: 'Mensagem não encontrada' })
  if (!message.pendingUseCase) return res.status(400).json({ error: 'Essa mensagem não tem um caso de uso pendente' })
  if (message.useCaseSaved) return res.status(200).json({ ok: true, alreadySaved: true })

  const created = await createUseCase({
    conversationId: message.conversationId,
    ...message.pendingUseCase,
    source: 'ia',
  })
  await markUseCaseSaved(message.id)

  res.json({ ok: true, useCase: created })
})
