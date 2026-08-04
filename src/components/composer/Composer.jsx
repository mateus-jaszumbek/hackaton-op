import { useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useAutosize } from '../../hooks/useAutosize.js'
import { MAX_CHARS } from '../../hooks/useChat.js'
import styles from './Composer.module.css'

export function Composer({ onSend }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)
  useAutosize(textareaRef, input)

  const canSend = input.trim().length > 0
  const counter = input.length
    ? `${input.length}/${MAX_CHARS}`
    : 'Enter envia · Shift+Enter quebra linha'

  function submit() {
    const t = input.trim()
    if (!t) return
    onSend(t)
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      className={styles.wrap}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <div className={styles.col}>
        <div className={styles.box}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            maxLength={MAX_CHARS}
            placeholder="Descreva a situação e o que o sistema bloqueou…"
            aria-label="Descreva a situação e o que o sistema bloqueou"
            className={styles.textarea}
          />
          <div className={styles.toolbar}>
            <div className={styles.sendRow}>
              <span className={styles.counter}>{counter}</span>
              <button
                type="submit"
                className={styles.sendBtn}
                data-active={canSend}
                aria-label="Enviar"
                title="Enviar"
              >
                <ArrowUp size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.disclaimer}>
            Respostas citam o procedimento vigente. Alterações no sistema seguem a aprovação
            indicada.
          </div>
        </div>
      </div>
    </form>
  )
}
