import { PaletteProvider } from './theme/PaletteProvider.jsx'
import { Shell } from './components/Shell.jsx'

function App() {
  return (
    <PaletteProvider>
      <Shell />
    </PaletteProvider>
  )
}

export default App
