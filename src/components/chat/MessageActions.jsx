import { useEffect, useState } from 'react'
import { Check, Copy, ThumbsDown, ThumbsUp } from 'lucide-react'
import styles from './MessageActions.module.css'

const COPIED_MS = 1600

export function MessageActions({ text }) {
  const [copied, setCopied] = useState(false)
  const [vote, setVote] = useState(null)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(t)
  }, [copied])

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <div className={styles.row}>
      <button type="button" onClick={handleCopy} className={styles.btn}>
        {copied ? <Check size={13} /> : <Copy size={13} />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      <button
        type="button"
        onClick={() => setVote((v) => (v === 'up' ? null : 'up'))}
        className={styles.btn}
        data-voted={vote === 'up'}
      >
        <ThumbsUp size={13} />
        Útil
      </button>
      <button
        type="button"
        onClick={() => setVote((v) => (v === 'down' ? null : 'down'))}
        className={styles.btn}
        data-voted={vote === 'down'}
      >
        <ThumbsDown size={13} />
        Impreciso
      </button>
    </div>
  )
}
