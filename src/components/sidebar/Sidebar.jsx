import { useEffect, useMemo, useRef, useState } from 'react'
import { PanelLeft, Plus, Search } from 'lucide-react'
import { IconButton } from '../ui/IconButton.jsx'
import { SearchBox } from './SearchBox.jsx'
import { HistoryList } from './HistoryList.jsx'
import { UserCard } from './UserCard.jsx'
import styles from './Sidebar.module.css'

const DAY_MS = 86400000

function bucketLabel(timestamp) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  if (timestamp >= startOfToday) return 'Hoje'
  if (timestamp >= startOfToday - 6 * DAY_MS) return 'Esta semana'
  return 'Mais antigas'
}

function groupConversations(conversations, query) {
  const q = query.trim().toLowerCase()
  const buckets = new Map()
  for (const c of conversations) {
    if (q && !c.title.toLowerCase().includes(q)) continue
    const label = bucketLabel(c.updatedAt)
    if (!buckets.has(label)) buckets.set(label, [])
    buckets.get(label).push(c)
  }
  return ['Hoje', 'Esta semana', 'Mais antigas']
    .filter((label) => buckets.has(label))
    .map((label) => ({ label, items: buckets.get(label) }))
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onNew,
  conversations,
  selectedId,
  onSelectHistory,
}) {
  const [query, setQuery] = useState('')
  const [focusSearchPending, setFocusSearchPending] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    if (!collapsed && focusSearchPending) {
      searchRef.current?.focus()
      setFocusSearchPending(false)
    }
  }, [collapsed, focusSearchPending])

  const groups = useMemo(
    () => groupConversations(conversations, query),
    [conversations, query],
  )

  function handleExpandForSearch() {
    setFocusSearchPending(true)
    onToggleCollapse()
  }

  return (
    <aside className={styles.sidebar} data-collapsed={collapsed}>
      <div className={styles.top}>
        {!collapsed && (
          <div className={styles.brand}>
            <span className={styles.brandCircle} />
            <span className={styles.brandBlob} />
            <span className={styles.brandPill} />
          </div>
        )}
        {collapsed && <span className={styles.brandCircle} />}
        <IconButton
          icon={PanelLeft}
          label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          onClick={onToggleCollapse}
        />
      </div>

      {collapsed ? (
        <button
          type="button"
          onClick={onNew}
          aria-label="Nova conversa"
          title="Nova conversa"
          className={styles.newRail}
        >
          <Plus size={16} strokeWidth={2.2} />
        </button>
      ) : (
        <button type="button" onClick={onNew} className={styles.newBtn}>
          <Plus size={16} strokeWidth={2.2} />
          Nova conversa
        </button>
      )}

      {collapsed ? (
        <IconButton icon={Search} label="Buscar conversas" onClick={handleExpandForSearch} />
      ) : (
        <SearchBox ref={searchRef} value={query} onChange={setQuery} />
      )}

      <div className={styles.history}>
        <HistoryList
          groups={groups}
          collapsed={collapsed}
          selectedId={selectedId}
          onSelect={onSelectHistory}
        />
      </div>

      <UserCard collapsed={collapsed} />
    </aside>
  )
}
