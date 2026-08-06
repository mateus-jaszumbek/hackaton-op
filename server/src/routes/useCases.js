import { Router } from 'express'
import { createUseCase, getUseCase, searchUseCases } from '../db/useCases.js'
import { getConversation } from '../db/conversations.js'
import { BACKEND_API_KEY } from '../config.js'

const SOURCES = ['manual', 'ia']

export const useCasesRouter = Router()

useCasesRouter.use((req, res, next) => {
  if (!BACKEND_API_KEY) return next()
  if (req.get('x-api-key') !== BACKEND_API_KEY) {
    return res.status(401).json({ error: 'x-api-key inválida ou ausente' })
  }
  next()
})

useCasesRouter.post('/', (req, res) => {
  const {
    conversationId,
    setor,
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
    source,
  } = req.body ?? {}

  const trimmedCenario = typeof cenario === 'string' ? cenario.trim() : ''
  const trimmedObjetivo = typeof objetivoCliente === 'string' ? objetivoCliente.trim() : ''
  const trimmedDuvida = typeof duvida === 'string' ? duvida.trim() : ''

  if (!trimmedCenario) return res.status(400).json({ error: 'cenario é obrigatório' })
  if (!trimmedObjetivo) return res.status(400).json({ error: 'objetivoCliente é obrigatório' })
  if (!trimmedDuvida) return res.status(400).json({ error: 'duvida é obrigatório' })
  if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every((n) => typeof n === 'number')) {
    return res.status(400).json({ error: 'embedding deve ser um array de números' })
  }
  if (source !== undefined && !SOURCES.includes(source)) {
    return res.status(400).json({ error: `source deve ser um de: ${SOURCES.join(', ')}` })
  }
  if (conversationId && !getConversation(conversationId)) {
    return res.status(404).json({ error: 'Conversa não encontrada' })
  }

  const created = createUseCase({
    conversationId: conversationId ?? null,
    setor: setor || 'CS',
    cenario: trimmedCenario,
    objetivoCliente: trimmedObjetivo,
    duvida: trimmedDuvida,
    perguntasParaEntender: perguntasParaEntender ?? '',
    caminho1: caminho1 ?? '',
    caminho2: caminho2 ?? '',
    caminho3: caminho3 ?? '',
    recomendacaoFinal: recomendacaoFinal ?? '',
    observacoes: observacoes ?? '',
    embedding,
    source: source ?? 'manual',
  })
  res.status(201).json(created)
})

useCasesRouter.post('/search', (req, res) => {
  const { embedding, topK } = req.body ?? {}

  if (!Array.isArray(embedding) || embedding.length === 0 || !embedding.every((n) => typeof n === 'number')) {
    return res.status(400).json({ error: 'embedding deve ser um array de números' })
  }

  const k = Number.isInteger(topK) && topK > 0 ? topK : 5
  res.json({ results: searchUseCases(embedding, k) })
})

useCasesRouter.get('/:id', (req, res) => {
  const found = getUseCase(req.params.id)
  if (!found) return res.status(404).json({ error: 'Caso de uso não encontrado' })
  res.json(found)
})
