import styles from './Steps.module.css'

export function Steps({ steps }) {
  return (
    <div className={styles.list}>
      {steps.map((text, i) => (
        <div key={i} className={styles.step}>
          <div className={styles.badge}>{i + 1}</div>
          <div className={styles.text}>{text}</div>
        </div>
      ))}
    </div>
  )
}
