import { createContext, useContext } from 'react'
import { DEFAULT_PAL } from './palettes.js'

export const PaletteContext = createContext({
  pal: DEFAULT_PAL,
  setPal: () => {},
})

export function usePalette() {
  return useContext(PaletteContext)
}
