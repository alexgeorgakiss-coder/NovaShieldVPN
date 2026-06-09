import { PlusIcon, MessageSquareIcon, ChevronRightIcon, BotIcon } from 'lucide-react'
import type { ChatSession } from '../types'

interface Props {
  sessions: ChatSession[]
  currentChatId: string
  loading: boolean
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
}

function timeLabel(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return 'Σήμερα'
  if (days === 1) return 'Χθες'
  if (days <= 7) return 'Τελευταίες 7 μέρες'
  return 'Παλαιότερα'
}

export default function Sidebar({ sessions, currentChatId, loading, onNewChat, onSelectChat }: Props) {
  const grouped = sessions.reduce<Record<string, ChatSession[]>>((acc, s) => {
    const label = timeLabel(s.timestamp)
    if (!acc[label]) acc[label] = []
    acc[label].push(s)
    return acc
  }, {})

  const order = ['Σήμερα', 'Χθες', 'Τελευταίες 7 μέρες', 'Παλαιότερα']

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-gray-100 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10">
        <BotIcon size={22} className="text-brand" />
        <span className="font-semibold text-sm tracking-wide">STEM Robotics</span>
      </div>

      {/* New Chat */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 mx-3 mt-3 mb-2 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
      >
        <PlusIcon size={16} />
        Νέα Συνομιλία
      </button>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {loading && (
          <p className="text-xs text-gray-500 px-2 pt-4 animate-pulse">Φόρτωση ιστορικού…</p>
        )}
        {!loading && sessions.length === 0 && (
          <p className="text-xs text-gray-500 px-2 pt-4">Δεν υπάρχει ιστορικό ακόμα.</p>
        )}
        {order.map((label) => {
          const items = grouped[label]
          if (!items?.length) return null
          return (
            <div key={label} className="mt-4">
              <p className="px-2 mb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                {label}
              </p>
              {items.map((s) => (
                <button
                  key={s.chatId}
                  onClick={() => onSelectChat(s.chatId)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition-colors group ${
                    s.chatId === currentChatId
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <MessageSquareIcon size={14} className="shrink-0 text-gray-400" />
                  <span className="flex-1 truncate">{s.title}</span>
                  {s.chatId === currentChatId && (
                    <ChevronRightIcon size={12} className="shrink-0 text-brand" />
                  )}
                </button>
              ))}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
