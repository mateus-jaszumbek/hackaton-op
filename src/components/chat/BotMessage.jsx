import { Steps } from './Steps.jsx'
import { ExceptionNote } from './ExceptionNote.jsx'
import { MessageActions } from './MessageActions.jsx'
import { SourceBadge } from './SourceBadge.jsx'
import { SaveUseCaseButton } from './SaveUseCaseButton.jsx'
import styles from './BotMessage.module.css'

export function BotMessage({ answer, shown, done, onSaveUseCase }) {
  const text = done ? answer.text : answer.text.slice(0, shown)

  return (
    <div className={styles.row}>
      <div className={styles.avatar} aria-hidden="true" />
      <div className={styles.col}>
        <div className={styles.bubble}>
          {done && <SourceBadge source={answer.source} />}
          <div className={styles.text}>
            {text}
            {!done && <span className={styles.caret} aria-hidden="true" />}
          </div>
          {done && answer.steps?.length > 0 && <Steps steps={answer.steps} />}
          {done && answer.note && <ExceptionNote note={answer.note} />}
          {done && answer.pendingUseCase && (
            <SaveUseCaseButton messageId={answer.id} saved={answer.useCaseSaved} onSave={onSaveUseCase} />
          )}
        </div>
        {done && <MessageActions text={answer.text} />}
      </div>
    </div>
  )
}
