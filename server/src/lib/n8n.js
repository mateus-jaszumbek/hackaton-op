import { N8N_WEBHOOK_URL, N8N_WEBHOOK_SECRET, CURRENT_USER } from '../config.js'

export async function askAgent({ conversationId, text, history }) {
  if (!N8N_WEBHOOK_URL) {
    return {
      text: `(n8n não configurado ainda) Recebi: "${text}"`,
      steps: [],
      note: '',
      source: 'ia',
    }
  }

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(N8N_WEBHOOK_SECRET ? { 'x-webhook-secret': N8N_WEBHOOK_SECRET } : {}),
    },
    body: JSON.stringify({
      conversationId,
      message: text,
      history,
      user: CURRENT_USER,
    }),
  })

  if (!res.ok) {
    throw new Error(`n8n respondeu ${res.status}`)
  }

  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(`n8n respondeu ${res.status} sem JSON válido no corpo (verifique o nó "Respond to Webhook" do workflow)`)
  }

  return extractReply(data)
}

function extractReply(data) {
  if (Array.isArray(data)) data = data[0] ?? {}

  const openaiContent = data?.choices?.[0]?.message?.content
  if (typeof openaiContent === 'string') {
    try {
      data = { ...data, ...JSON.parse(openaiContent) }
    } catch {
      // conteúdo do OpenAI não era JSON, mantém `data` como está
    }
  }

  return {
    text: data.replyText ?? data.text ?? data.reply ?? data.output ?? '',
    steps: data.steps ?? [],
    note: data.note ?? '',
    source: data.source === 'documentado' ? 'documentado' : 'ia',
    pendingUseCase: parsePendingUseCase(data.pendingUseCase),
  }
}

function parsePendingUseCase(raw) {
  if (!raw) return null
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return parsed && typeof parsed === 'object' && parsed.cenario ? parsed : null
  } catch {
    return null
  }
}
