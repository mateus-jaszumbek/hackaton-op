import { useState } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ?? initial
    } catch {
      return initial
    }
  })

  const set = (next) => {
    setValue(next)
    try {
      window.localStorage.setItem(key, next)
    } catch {
      // localStorage indisponível (modo privado, cota excedida) — segue só em memória
    }
  }

  return [value, set]
}
