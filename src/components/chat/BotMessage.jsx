import { Steps } from './Steps.jsx'
import { ExceptionNote } from './ExceptionNote.jsx'
import { SourceChips } from './SourceChips.jsx'
import { MessageActions } from './MessageActions.jsx'
import styles from './BotMessage.module.css'

export function BotMessage({ answer, shown, done, onSelectSource }) {
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
          {done && <Steps steps={answer.steps} />}
          {done && <ExceptionNote note={answer.note} />}
        </div>
        {done && <SourceChips sources={answer.sources} onSelect={onSelectSource} />}
        {done && <MessageActions text={answer.text} />}
      </div>
    </div>
  )
}
