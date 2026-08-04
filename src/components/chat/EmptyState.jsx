import { SUGGESTIONS } from '../../data/suggestions.js'
import { ClayShapes } from './ClayShapes.jsx'
import styles from './EmptyState.module.css'

const PIP_VARS = ['--a1', '--a2', '--a3', '--a1']

export function EmptyState({ onSuggest }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.col}>
        <ClayShapes />
        <div className={styles.intro}>
          <h1 className={styles.h1}>
            Descreva o que o sistema
            <br />
            não deixa você fazer.
          </h1>
          <p className={styles.p}>
            Retorno o caminho aceito, a regra que se aplica e o documento de origem. Não executo
            alterações — indico o procedimento e quem aprova.
          </p>
        </div>
        <div className={styles.suggestions}>
          <div className={styles.label}>Situações frequentes</div>
          <div className={styles.grid}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSuggest(s.key)}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span
                    className={styles.pip}
                    style={{ '--pip': `var(${PIP_VARS[i % 4]})` }}
                  />
                  <span className={styles.area}>{s.area}</span>
                </div>
                <div className={styles.text}>{s.text}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
