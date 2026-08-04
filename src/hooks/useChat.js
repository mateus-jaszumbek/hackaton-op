import { useEffect, useReducer } from 'react'
import { getAnswer } from '../services/chat.js'
import { SUGGESTIONS } from '../data/suggestions.js'

const THINK_MS = 900
const TICK_MS = 26
const CHARS_PER_TICK = 3
export const TITLE_MAX = 54
export const MAX_CHARS = 2000

let seq = 0

const initialState = {
  phase: 'idle',
  msgs: [],
  shown: 0,
  key: null,
  title: 'Nova conversa',
}

function truncateTitle(text) {
  return text.length > TITLE_MAX ? text.slice(0, TITLE_MAX) + '…' : text
}

function reducer(state, action) {
  switch (action.type) {
    case 'ask':
      return {
        phase: 'thinking',
        msgs: [{ id: seq++, role: 'user', text: action.text }],
        shown: 0,
        key: action.key,
        title: truncateTitle(action.text),
      }
    case 'reply':
      return {
        ...state,
        phase: 'streaming',
        shown: 0,
        msgs: [...state.msgs, { id: seq++, role: 'bot', key: state.key }],
      }
    case 'tick': {
      const next = state.shown + CHARS_PER_TICK
      if (next >= action.len) return { ...state, phase: 'done', shown: action.len }
      return { ...state, shown: next }
    }
    case 'reveal':
      return { ...state, phase: 'done', shown: action.len }
    case 'reset':
      return initialState
    default:
      return state
  }
}

export function useChat() {
  const [st, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (st.phase !== 'thinking') return
    const t = setTimeout(() => dispatch({ type: 'reply' }), THINK_MS)
    return () => clearTimeout(t)
  }, [st.phase])

  useEffect(() => {
    if (st.phase !== 'streaming') return
    const len = getAnswer(st.key).text.length
    const t = setInterval(() => dispatch({ type: 'tick', len }), TICK_MS)
    return () => clearInterval(t)
  }, [st.phase, st.key])

  function ask(key, label) {
    const text = label || SUGGESTIONS.find((s) => s.key === key).text
    dispatch({ type: 'ask', key, text })
  }

  function stop() {
    if (st.phase !== 'streaming') return
    dispatch({ type: 'reveal', len: getAnswer(st.key).text.length })
  }

  function reset() {
    dispatch({ type: 'reset' })
  }

  return {
    phase: st.phase,
    msgs: st.msgs,
    shown: st.shown,
    key: st.key,
    title: st.title,
    isEmpty: st.msgs.length === 0,
    hasThread: st.msgs.length > 0,
    thinking: st.phase === 'thinking',
    streaming: st.phase === 'streaming',
    ask,
    stop,
    reset,
  }
}
