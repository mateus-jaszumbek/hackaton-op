import { PALETTES } from '../../theme/palettes.js'
import { usePalette } from '../../theme/palette-context.js'
import styles from './PaletteSwitcher.module.css'

export function PaletteSwitcher() {
  const { pal, setPal } = usePalette()

  return (
    <div className={styles.row}>
      <span className={styles.label}>Paleta</span>
      {PALETTES.map((p) => (
        <button
          key={p.key}
          type="button"
          onClick={() => setPal(p.key)}
          className={styles.dot}
          data-active={pal === p.key}
          style={{ '--dot': p.a1 }}
          title={p.name}
          aria-label={p.name}
          aria-pressed={pal === p.key}
        />
      ))}
    </div>
  )
}
