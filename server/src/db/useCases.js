import { randomUUID } from 'node:crypto'
import { db } from './index.js'

const insertUseCase = db.prepare(
  `INSERT INTO use_cases
     (id, conversation_id, setor, cenario, objetivo_cliente, duvida, perguntas_para_entender,
      caminho_1, caminho_2, caminho_3, recomendacao_final, observacoes, embedding, source, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
)
const selectUseCase = db.prepare(`SELECT * FROM use_cases WHERE id = ?`)
const selectAllForSearch = db.prepare(`SELECT * FROM use_cases`)

function toApi(u) {
  return {
    id: u.id,
    conversationId: u.conversation_id,
    setor: u.setor,
    cenario: u.cenario,
    objetivoCliente: u.objetivo_cliente,
    duvida: u.duvida,
    perguntasParaEntender: u.perguntas_para_entender,
    caminho1: u.caminho_1,
    caminho2: u.caminho_2,
    caminho3: u.caminho_3,
    recomendacaoFinal: u.recomendacao_final,
    observacoes: u.observacoes,
    source: u.source,
    createdAt: u.created_at,
    updatedAt: u.updated_at,
  }
}

function cosineSimilarity(a, b) {
  let dot = 0
  let normA = 0
  let normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  if (normA === 0 || normB === 0) return 0
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

export function createUseCase({
  conversationId = null,
  setor = 'CS',
  cenario,
  objetivoCliente,
  duvida,
  perguntasParaEntender = '',
  caminho1 = '',
  caminho2 = '',
  caminho3 = '',
  recomendacaoFinal = '',
  observacoes = '',
  embedding,
  source = 'manual',
}) {
  const id = randomUUID()
  const now = Date.now()
  insertUseCase.run(
    id,
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
    JSON.stringify(embedding),
    source,
    now,
    now,
  )
  return toApi(selectUseCase.get(id))
}

export function getUseCase(id) {
  const u = selectUseCase.get(id)
  return u ? toApi(u) : null
}

export function searchUseCases(queryEmbedding, topK = 5) {
  const rows = selectAllForSearch.all()
  const scored = rows.map((row) => ({
    ...toApi(row),
    similarity: cosineSimilarity(queryEmbedding, JSON.parse(row.embedding)),
  }))
  scored.sort((a, b) => b.similarity - a.similarity)
  return scored.slice(0, topK)
}
