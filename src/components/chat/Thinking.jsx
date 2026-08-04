import styles from './Thinking.module.css'

export function Thinking() {
  return (
    <div className={styles.row}>
      <div className={styles.avatar} aria-hidden="true" />
      <div className={styles.bubble}>
        <div className={styles.dots} aria-hidden="true">
          <span className={`${styles.dot} thinkingDot`} />
          <span className={`${styles.dot} thinkingDot`} />
          <span className={`${styles.dot} thinkingDot`} />
        </div>
        <span className={styles.text}>Consultando procedimentos…</span>
      </div>
    </div>
  )
}
