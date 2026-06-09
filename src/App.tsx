import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Message, ChatSession } from './types'
import { sendToN8N } from './services/n8n'
import { fetchAllSessions, fetchMessagesForChat } from './services/airtable'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

function newChatId() {
  return uuidv4()
}

export default function App() {
  const [currentChatId, setCurrentChatId] = useState<string>(() => newChatId())
  const [messages, setMessages] = useState<Message[]>([])
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // Load sidebar sessions on mount
  useEffect(() => {
    setSessionsLoading(true)
    fetchAllSessions()
      .then(setSessions)
      .finally(() => setSessionsLoading(false))
  }, [])

  const handleNewChat = useCallback(() => {
    setCurrentChatId(newChatId())
    setMessages([])
  }, [])

  const handleSelectChat = useCallback(async (chatId: string) => {
    setCurrentChatId(chatId)
    setMessages([])
    const loaded = await fetchMessagesForChat(chatId)
    setMessages(loaded)
  }, [])

  const handleSend = useCallback(
    async (text: string) => {
      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setSending(true)

      try {
        const data = await sendToN8N(text, currentChatId)

        const aiText = data.message ?? data.output ?? 'Έγινε! Δες τα αποτελέσματα παρακάτω.'
        const aiMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: aiText,
          html: data.html,
          wpLink: data.wp_link,
          seoTitle: data.seo_title,
          metaDescription: data.meta_description,
          seoKeywords: data.seo_keywords,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])

        // Add / refresh session in sidebar
        setSessions((prev) => {
          const exists = prev.some((s) => s.chatId === currentChatId)
          if (exists) return prev
          return [
            { chatId: currentChatId, title: text.slice(0, 60), timestamp: new Date() },
            ...prev,
          ]
        })
      } catch (err) {
        const errMsg: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `Σφάλμα: ${err instanceof Error ? err.message : 'Άγνωστο σφάλμα. Έλεγξε το VITE_N8N_WEBHOOK_URL.'}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errMsg])
      } finally {
        setSending(false)
      }
    },
    [currentChatId]
  )

  return (
    <div className="flex h-screen overflow-hidden bg-chat text-gray-100">
      <Sidebar
        sessions={sessions}
        currentChatId={currentChatId}
        loading={sessionsLoading}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <main className="flex-1 min-w-0 flex flex-col">
        <ChatWindow messages={messages} loading={sending} onSend={handleSend} />
      </main>
    </div>
  )
}
