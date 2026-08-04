import styles from './ClayShapes.module.css'

export function ClayShapes() {
  return (
    <div className={styles.row} aria-hidden="true">
      <span className={styles.circle} />
      <span className={styles.blob} />
      <span className={styles.pill} />
      <span className={styles.square} />
    </div>
  )
}
