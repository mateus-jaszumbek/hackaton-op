import { useState } from 'react'
import { BookmarkCheck, BookmarkPlus, Loader2 } from 'lucide-react'
import styles from './SaveUseCaseButton.module.css'

export function SaveUseCaseButton({ messageId, saved, onSave }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setBusy(true)
    setError('')
    try {
      await onSave(messageId)
    } catch {
      setError('Não consegui salvar, tenta de novo')
    } finally {
      setBusy(false)
    }
  }

  if (saved) {
    return (
      <div className={styles.box}>
        <BookmarkCheck size={14} className={styles.savedIcon} aria-hidden="true" />
        <div className={styles.text}>Salvo pra próximas consultas</div>
      </div>
    )
  }

  return (
    <div className={styles.box}>
      <BookmarkPlus size={14} className={styles.icon} aria-hidden="true" />
      <div className={styles.text}>
        Essa é uma situação nova, ainda não documentada.
        <button type="button" onClick={handleClick} disabled={busy} className={styles.btn}>
          {busy && <Loader2 size={12} className={styles.spin} aria-hidden="true" />}
          {busy ? 'Salvando…' : 'Salvar pra próximas consultas'}
        </button>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  )
}
