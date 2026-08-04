import styles from './ChatHeader.module.css'

export function ChatHeader({ title, streaming, onStop }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.actions}>
        {streaming && (
          <button type="button" onClick={onStop} className={styles.stopBtn}>
            <span className={styles.stopIcon} />
            Parar
          </button>
        )}
      </div>
    </header>
  )
}
