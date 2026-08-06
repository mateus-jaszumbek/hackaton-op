import { useEffect, useReducer } from 'react'
import { getMessages, saveUseCase, sendMessage } from '../services/api.js'

const PENDING_USE_CASE_CHECK_MS = 4000

const TICK_MS = 26
const CHARS_PER_TICK = 3
export const TITLE_MAX = 54
export const MAX_CHARS = 2000

let seq = 0

const initialState = {
  phase: 'idle',
  msgs: [],
  shown: 0,
  conversationId: null,
  title: 'Nova conversa',
}

function truncateTitle(text) {
  return text.length > TITLE_MAX ? text.slice(0, TITLE_MAX) + '…' : text
}

function reducer(state, action) {
  switch (action.type) {
    case 'ask':
      return {
        ...state,
        phase: 'thinking',
        msgs: [...state.msgs, { id: seq++, role: 'user', text: action.text }],
        shown: 0,
        title: state.conversationId ? state.title : truncateTitle(action.text),
      }
    case 'reply':
      return {
        ...state,
        phase: 'streaming',
        shown: 0,
        conversationId: action.conversationId,
        title: action.title,
        msgs: [
          ...state.msgs,
          {
            id: action.id,
            role: 'assistant',
            text: action.text,
            steps: action.steps,
            note: action.note,
            source: action.source,
            pendingUseCase: null,
            useCaseSaved: false,
          },
        ],
      }
    case 'attach-pending-use-case':
      return {
        ...state,
        msgs: state.msgs.map((m) => (m.id === action.messageId ? { ...m, pendingUseCase: action.pendingUseCase } : m)),
      }
    case 'use-case-saved':
      return {
        ...state,
        msgs: state.msgs.map((m) => (m.id === action.messageId ? { ...m, useCaseSaved: true } : m)),
      }
    case 'error':
      return {
        ...state,
        phase: 'done',
        shown: action.text.length,
        msgs: [...state.msgs, { id: seq++, role: 'assistant', text: action.text, steps: [], note: '' }],
      }
    case 'tick': {
      const next = state.shown + CHARS_PER_TICK
      if (next >= action.len) return { ...state, phase: 'done', shown: action.len }
      return { ...state, shown: next }
    }
    case 'reveal':
      return { ...state, phase: 'done', shown: action.len }
    case 'load':
      return {
        phase: 'done',
        msgs: action.msgs,
        shown: 0,
        conversationId: action.conversationId,
        title: action.title,
      }
    case 'reset':
      return initialState
    default:
      return state
  }
}

export function useChat() {
  const [st, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (st.phase !== 'streaming') return
    const len = st.msgs[st.msgs.length - 1].text.length
    const t = setInterval(() => dispatch({ type: 'tick', len }), TICK_MS)
    return () => clearInterval(t)
  }, [st.phase, st.msgs])

  async function ask(text) {
    dispatch({ type: 'ask', text })
    try {
      const data = await sendMessage({ conversationId: st.conversationId, text })
      dispatch({
        type: 'reply',
        conversationId: data.conversationId,
        title: data.title,
        id: data.reply.id,
        text: data.reply.text,
        steps: data.reply.steps,
        note: data.reply.note,
        source: data.reply.source,
      })
      checkPendingUseCaseLater(data.conversationId, data.reply.id)
    } catch (err) {
      dispatch({ type: 'error', text: `Não consegui falar com o agente: ${err.message}` })
    }
  }

  // O caso de uso sugerido pela IA (se houver) chega com um pequeno atraso —
  // o n8n calcula o embedding num branch paralelo e só anexa na mensagem
  // depois que a resposta principal já foi enviada. Confere uma vez, depois
  // que o embedding provavelmente já chegou.
  function checkPendingUseCaseLater(conversationId, messageId) {
    setTimeout(async () => {
      try {
        const msgs = await getMessages(conversationId)
        const match = msgs.find((m) => m.id === messageId)
        if (match?.pendingUseCase) {
          dispatch({ type: 'attach-pending-use-case', messageId, pendingUseCase: match.pendingUseCase })
        }
      } catch {
        // silencioso — é só uma melhoria de UX, não afeta o resto do chat
      }
    }, PENDING_USE_CASE_CHECK_MS)
  }

  async function confirmSaveUseCase(messageId) {
    await saveUseCase(messageId)
    dispatch({ type: 'use-case-saved', messageId })
  }

  async function loadConversation(conversationId, title) {
    const msgs = await getMessages(conversationId)
    dispatch({ type: 'load', conversationId, title, msgs })
  }

  function stop() {
    if (st.phase !== 'streaming') return
    dispatch({ type: 'reveal', len: st.msgs[st.msgs.length - 1].text.length })
  }

  function reset() {
    dispatch({ type: 'reset' })
  }

  return {
    phase: st.phase,
    msgs: st.msgs,
    shown: st.shown,
    conversationId: st.conversationId,
    title: st.title,
    isEmpty: st.msgs.length === 0,
    hasThread: st.msgs.length > 0,
    thinking: st.phase === 'thinking',
    streaming: st.phase === 'streaming',
    ask,
    loadConversation,
    stop,
    reset,
    confirmSaveUseCase,
  }
}
