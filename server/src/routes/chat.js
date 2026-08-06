import { Router } from 'express'
import {
  addMessage,
  attachPendingUseCase,
  createConversation,
  getConversation,
  getMessage,
  listMessages,
  markUseCaseSaved,
} from '../db/conversations.js'
import { createUseCase } from '../db/useCases.js'
import { askAgent } from '../lib/n8n.js'
import { BACKEND_API_KEY } from '../config.js'

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

// Chamado pelo n8n (branch paralelo) depois de calcular o embedding de um caso de
// uso novo proposto pela IA. Só anexa o caso na mensagem — não salva na base de
// casos de uso ainda, isso só acontece se o usuário clicar em "salvar".
chatRouter.post('/attach-pending-use-case', async (req, res) => {
  if (BACKEND_API_KEY && req.get('x-api-key') !== BACKEND_API_KEY) {
    return res.status(401).json({ error: 'x-api-key inválida ou ausente' })
  }

  const {
    conversationId,
    cenario,
    objetivoCliente,
    duvida,
    perguntasParaEntender,
    caminho1,
    caminho2,
    caminho3,
    recomendacaoFinal,
    observacoes,
    embedding,
  } = req.body ?? {}

  if (!conversationId) return res.status(400).json({ error: 'conversationId é obrigatório' })
  if (!cenario || !objetivoCliente || !duvida) {
    return res.status(400).json({ error: 'cenario, objetivoCliente e duvida são obrigatórios' })
  }
  if (!Array.isArray(embedding) || embedding.length === 0) {
    return res.status(400).json({ error: 'embedding deve ser um array de números' })
  }

  const messageId = await attachPendingUseCase(conversationId, {
    cenario,
    objetivoCliente,
    duvida,
    perguntasParaEntender: perguntasParaEntender ?? '',
    caminho1: caminho1 ?? '',
    caminho2: caminho2 ?? '',
    caminho3: caminho3 ?? '',
    recomendacaoFinal: recomendacaoFinal ?? '',
    observacoes: observacoes ?? '',
    embedding,
  })

  if (!messageId) return res.status(404).json({ error: 'Nenhuma mensagem do assistente encontrada pra essa conversa' })
  res.json({ ok: true, messageId })
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
