import { useEffect, useState } from 'react'
import { Sidebar } from './sidebar/Sidebar.jsx'
import { ChatHeader } from './header/ChatHeader.jsx'
import { EmptyState } from './chat/EmptyState.jsx'
import { MessageList } from './chat/MessageList.jsx'
import { Composer } from './composer/Composer.jsx'
import { useChat } from '../hooks/useChat.js'
import { listConversations } from '../services/api.js'
import styles from './Shell.module.css'

export function Shell() {
  const chat = useChat()
  const [collapsed, setCollapsed] = useState(false)
  const [conversations, setConversations] = useState([])

  function refreshConversations() {
    listConversations()
      .then(setConversations)
      .catch(() => {})
  }

  useEffect(refreshConversations, [])

  useEffect(() => {
    if (chat.phase === 'done') refreshConversations()
  }, [chat.phase])

  function handleReset() {
    chat.reset()
  }

  function handleSelectHistory(item) {
    chat.loadConversation(item.id, item.title)
  }

  return (
    <div className={styles.app}>
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onNew={handleReset}
        conversations={conversations}
        selectedId={chat.conversationId}
        onSelectHistory={handleSelectHistory}
      />
      <main className={styles.main}>
        <ChatHeader title={chat.title} streaming={chat.streaming} onStop={chat.stop} />
        <div className={styles.body}>
          <div className={styles.chatCol}>
            {chat.isEmpty ? (
              <EmptyState onSuggest={(text) => chat.ask(text)} />
            ) : (
              <MessageList
                msgs={chat.msgs}
                shown={chat.shown}
                thinking={chat.thinking}
                done={chat.phase === 'done'}
                onSaveUseCase={chat.confirmSaveUseCase}
              />
            )}
            <Composer onSend={(text) => chat.ask(text)} />
          </div>
        </div>
      </main>
    </div>
  )
}
