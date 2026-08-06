const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.error || `Erro ${res.status} ao chamar ${path}`)
  }
  return res.json()
}

export function getMe() {
  return request('/api/me')
}

export function listConversations() {
  return request('/api/conversations')
}

export function getMessages(conversationId) {
  return request(`/api/conversations/${conversationId}/messages`)
}

export function sendMessage({ conversationId, text }) {
  return request('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ conversationId, text }),
  })
}

export function saveUseCase(messageId) {
  return request(`/api/chat/messages/${messageId}/save-use-case`, { method: 'POST' })
}
