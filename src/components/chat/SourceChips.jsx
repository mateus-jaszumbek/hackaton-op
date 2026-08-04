import { FileText } from 'lucide-react'
import { SOURCES } from '../../data/sources.js'
import styles from './SourceChips.module.css'

export function SourceChips({ sources, onSelect }) {
  return (
    <div className={styles.row}>
      <div className={styles.label}>Fontes</div>
      {sources.map((ref) => (
        <button
          key={ref}
          type="button"
          onClick={() => onSelect(ref)}
          className={styles.chip}
        >
          <FileText size={12} className={styles.icon} />
          {SOURCES[ref].ref}
        </button>
      ))}
    </div>
  )
}
