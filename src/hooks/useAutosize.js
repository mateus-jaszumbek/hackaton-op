import { useLayoutEffect } from 'react'

const MIN_HEIGHT = 42
const MAX_HEIGHT = 160

export function useAutosize(ref, value) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    const next = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
    el.style.height = `${next}px`
  }, [ref, value])
}
