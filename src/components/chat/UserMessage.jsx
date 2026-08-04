import styles from './UserMessage.module.css'

export function UserMessage({ text }) {
  return <div className={styles.bubble}>{text}</div>
}
