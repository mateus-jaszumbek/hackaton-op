import { useEffect, useRef } from 'react'
import { getAnswer } from '../../services/chat.js'
import { UserMessage } from './UserMessage.jsx'
import { BotMessage } from './BotMessage.jsx'
import { Thinking } from './Thinking.jsx'
import styles from './MessageList.module.css'

export function MessageList({ msgs, shown, thinking, done, onSelectSource }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [msgs, shown, thinking])

  return (
    <div ref={scrollRef} className={styles.wrap}>
      <div className={styles.col} role="log" aria-live="polite">
        {msgs.map((m) =>
          m.role === 'user' ? (
            <div key={m.id} className={styles.rowUser}>
              <UserMessage text={m.text} />
            </div>
          ) : (
            <div key={m.id} className={styles.rowBot}>
              <BotMessage
                answer={getAnswer(m.key)}
                shown={shown}
                done={done}
                onSelectSource={onSelectSource}
              />
            </div>
          ),
        )}
        {thinking && <Thinking />}
      </div>
    </div>
  )
}
