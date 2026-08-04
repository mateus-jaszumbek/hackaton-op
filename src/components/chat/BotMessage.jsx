import { Steps } from './Steps.jsx'
import { ExceptionNote } from './ExceptionNote.jsx'
import { MessageActions } from './MessageActions.jsx'
import styles from './BotMessage.module.css'

export function BotMessage({ answer, shown, done }) {
  const text = done ? answer.text : answer.text.slice(0, shown)

  return (
    <div className={styles.row}>
      <div className={styles.avatar} aria-hidden="true" />
      <div className={styles.col}>
        <div className={styles.bubble}>
          <div className={styles.text}>
            {text}
            {!done && <span className={styles.caret} aria-hidden="true" />}
          </div>
          {done && answer.steps?.length > 0 && <Steps steps={answer.steps} />}
          {done && answer.note && <ExceptionNote note={answer.note} />}
        </div>
        {done && <MessageActions text={answer.text} />}
      </div>
    </div>
  )
}
