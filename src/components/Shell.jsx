import { useState } from 'react'
import { Sidebar } from './sidebar/Sidebar.jsx'
import { ChatHeader } from './header/ChatHeader.jsx'
import { EmptyState } from './chat/EmptyState.jsx'
import { MessageList } from './chat/MessageList.jsx'
import { Composer } from './composer/Composer.jsx'
import { useChat } from '../hooks/useChat.js'
import { matchKey } from '../services/chat.js'
import styles from './Shell.module.css'

export function Shell() {
  const chat = useChat()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  function handleAsk(key, label, historyId = null) {
    chat.ask(key, label)
    setSelectedId(historyId)
  }

  function handleReset() {
    chat.reset()
    setSelectedId(null)
  }

  return (
    <div className={styles.app}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNew={handleReset}
        activeKey={chat.key}
        selectedId={selectedId}
        onSelectHistory={(item) => handleAsk(item.key, item.title, item.id)}
      />
      <main className={styles.main}>
        <ChatHeader title={chat.title} streaming={chat.streaming} onStop={chat.stop} />
        <div className={styles.body}>
          <div className={styles.chatCol}>
            {chat.isEmpty ? (
              <EmptyState onSuggest={(key) => handleAsk(key)} />
            ) : (
              <MessageList
                msgs={chat.msgs}
                shown={chat.shown}
                thinking={chat.thinking}
                done={chat.phase === 'done'}
              />
            )}
            <Composer
              onSend={(text) => {
                const key = matchKey(text)
                handleAsk(key, text)
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
