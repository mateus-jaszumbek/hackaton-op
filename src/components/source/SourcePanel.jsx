import { ExternalLink, X } from 'lucide-react'
import styles from './SourcePanel.module.css'

export function SourcePanel({ source, onClose }) {
  return (
    <>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Fechar painel de fonte"
        tabIndex={-1}
      />
      <aside className={styles.panel} aria-label="Fonte citada">
        <div className={styles.header}>
          <div className={styles.label}>Fonte citada</div>
          <button type="button" onClick={onClose} className={styles.closeBtn} aria-label="Fechar">
            <X size={15} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.titleBlock}>
            <div className={styles.title}>{source.title}</div>
            <div className={styles.pills}>
              <span className={styles.pill}>{source.ref}</span>
              <span className={styles.pill}>{source.updated}</span>
            </div>
          </div>
          <div className={styles.excerpt}>{source.excerpt}</div>
          <div className={styles.approval}>
            <div className={styles.approvalLabel}>Aprovação</div>
            <div className={styles.approvalRow}>
              <div className={styles.approvalAvatar}>RF</div>
              <div>
                <div className={styles.ownerName}>{source.owner}</div>
                <div className={styles.ownerRole}>{source.ownerRole}</div>
              </div>
            </div>
          </div>
          <button type="button" className={styles.cta}>
            <ExternalLink size={15} />
            Abrir documento completo
          </button>
        </div>
      </aside>
    </>
  )
}
