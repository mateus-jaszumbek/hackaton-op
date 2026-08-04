import { Book, Download, FileText } from 'lucide-react'
import styles from './ChatHeader.module.css'

export function ChatHeader({ title, streaming, onStop, sourcesOpen, onToggleSources }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
        <div className={styles.chip}>
          <FileText size={13} className={styles.chipIcon} />
          <span className={styles.chipText}>Procedimentos v4.2 · 412 docs</span>
        </div>
      </div>
      <div className={styles.actions}>
        {streaming && (
          <button type="button" onClick={onStop} className={styles.stopBtn}>
            <span className={styles.stopIcon} />
            Parar
          </button>
        )}
        <button type="button" className={styles.textBtn}>
          <Download size={14} />
          Exportar
        </button>
        <button
          type="button"
          onClick={onToggleSources}
          className={styles.textBtn}
          data-active={sourcesOpen}
          aria-pressed={sourcesOpen}
        >
          <Book size={14} />
          Fontes
        </button>
      </div>
    </header>
  )
}
