import { useState } from 'react'
import { Sidebar } from './sidebar/Sidebar.jsx'
import { ChatHeader } from './header/ChatHeader.jsx'
import { EmptyState } from './chat/EmptyState.jsx'
import { MessageList } from './chat/MessageList.jsx'
import { Composer } from './composer/Composer.jsx'
import { SourcePanel } from './source/SourcePanel.jsx'
import { useChat } from '../hooks/useChat.js'
import { matchKey, getAnswer } from '../services/chat.js'
import { SOURCES } from '../data/sources.js'
import styles from './Shell.module.css'

export function Shell() {
  const chat = useChat()
  const [collapsed, setCollapsed] = useState(false)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [activeSource, setActiveSource] = useState('POP-FIN-014')
  const [selectedId, setSelectedId] = useState(null)

  function handleAsk(key, label, historyId = null) {
    chat.ask(key, label)
    setActiveSource(getAnswer(key).sources[0])
    setSelectedId(historyId)
  }

  function handleReset() {
    chat.reset()
    setSourcesOpen(false)
    setSelectedId(null)
  }

  function handleSelectSource(ref) {
    setActiveSource(ref)
    setSourcesOpen(true)
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
        <ChatHeader
          title={chat.title}
          streaming={chat.streaming}
          onStop={chat.stop}
          sourcesOpen={sourcesOpen}
          onToggleSources={() => setSourcesOpen((o) => !o)}
        />
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
                onSelectSource={handleSelectSource}
              />
            )}
            <Composer
              onSend={(text) => {
                const key = matchKey(text)
                handleAsk(key, text)
              }}
            />
          </div>
          {sourcesOpen && (
            <SourcePanel source={SOURCES[activeSource]} onClose={() => setSourcesOpen(false)} />
          )}
        </div>
      </main>
    </div>
  )
}
