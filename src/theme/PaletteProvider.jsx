import { useLayoutEffect } from 'react'
import { PaletteContext } from './palette-context.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { DEFAULT_PAL } from './palettes.js'

export function PaletteProvider({ children }) {
  const [pal, setPal] = useLocalStorage('agente-interno:pal', DEFAULT_PAL)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-pal', pal)
  }, [pal])

  return (
    <PaletteContext.Provider value={{ pal, setPal }}>
      {children}
    </PaletteContext.Provider>
  )
}
