import styles from './ExceptionNote.module.css'

export function ExceptionNote({ note }) {
  return (
    <div className={styles.box}>
      <span className={styles.dot} aria-hidden="true" />
      <div className={styles.text}>{note}</div>
    </div>
  )
}
