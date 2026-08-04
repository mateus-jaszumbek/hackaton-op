import { N8N_WEBHOOK_URL, CURRENT_USER } from '../config.js'

export async function askAgent({ conversationId, text, history }) {
  if (!N8N_WEBHOOK_URL) {
    return {
      text: `(n8n não configurado ainda) Recebi: "${text}"`,
      steps: [],
      note: '',
    }
  }

  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  const data = await res.json()
  return {
    text: data.text ?? data.reply ?? data.output ?? '',
    steps: data.steps ?? [],
    note: data.note ?? '',
  }
}
