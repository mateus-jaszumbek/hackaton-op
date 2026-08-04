import styles from './HistoryList.module.css'

export function HistoryList({ groups, collapsed, activeKey, selectedId, onSelect }) {
  if (groups.length === 0) {
    if (collapsed) return null
    return <p className={styles.empty}>Nenhuma conversa</p>
  }

  if (collapsed) {
    return (
      <div className={styles.railList}>
        {groups.flatMap((g) => g.items).map((item) => {
          const active = selectedId === item.id && activeKey === item.key
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={styles.railDot}
              data-active={active}
              title={item.title}
              aria-label={item.title}
            >
              <span className={styles.dot} data-active={active} />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {groups.map((g) => (
        <div key={g.label} className={styles.group}>
          <div className={styles.label}>{g.label}</div>
          {g.items.map((item) => {
            const active = selectedId === item.id && activeKey === item.key
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item)}
                className={styles.item}
                data-active={active}
              >
                <div className={styles.itemTop}>
                  <span className={styles.dot} data-active={active} />
                  <span className={styles.itemTitle}>{item.title}</span>
                </div>
                <div className={styles.itemPreview}>{item.preview}</div>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
