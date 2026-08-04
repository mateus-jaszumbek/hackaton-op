import { useEffect, useMemo, useRef, useState } from 'react'
import { PanelLeft, Plus, Search } from 'lucide-react'
import { HISTORY } from '../../data/history.js'
import { IconButton } from '../ui/IconButton.jsx'
import { SearchBox } from './SearchBox.jsx'
import { HistoryList } from './HistoryList.jsx'
import { UserCard } from './UserCard.jsx'
import styles from './Sidebar.module.css'

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onNew,
  activeKey,
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

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HISTORY.map((g) => ({
      label: g.group,
      items: g.items.filter((i) => !q || i.title.toLowerCase().includes(q)),
    })).filter((g) => g.items.length > 0)
  }, [query])

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
          activeKey={activeKey}
          selectedId={selectedId}
          onSelect={onSelectHistory}
        />
      </div>

      <UserCard collapsed={collapsed} />
    </aside>
  )
}
