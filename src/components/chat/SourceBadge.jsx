import styles from './SourceBadge.module.css'

export function SourceBadge({ source }) {
  if (source !== 'documentado' && source !== 'ia') return null

  const isDocumented = source === 'documentado'
  return (
    <div className={isDocumented ? styles.documented : styles.ai}>
      <span aria-hidden="true">{isDocumented ? '📄' : '🤖'}</span>
      {isDocumented ? 'Caso documentado' : 'Sugestão da IA'}
    </div>
  )
}
