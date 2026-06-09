import { useEffect, useRef } from 'react'
import { BotIcon, SparklesIcon } from 'lucide-react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface Props {
  messages: Message[]
  loading: boolean
  onSend: (text: string) => void
}

const SUGGESTIONS = [
  'Γράψε SEO άρθρο για εκπαιδευτική ρομποτική για παιδιά 8-12',
  'Δημιούργησε Social Media post για νέο τμήμα STEM',
  'Άρθρο: "Γιατί η κωδικοποίηση είναι η γλώσσα του μέλλοντος"',
  'Δημιούργησε εβδομαδιαίο πρόγραμμα posts για Instagram',
]

export default function ChatWindow({ messages, loading, onSend }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-chat">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 px-6 py-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
              <SparklesIcon size={28} className="text-brand" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white mb-2">AI Content Studio</h1>
              <p className="text-gray-400 text-sm max-w-sm">
                Παραγωγή SEO άρθρων &amp; Social Media posts για ακαδημία STEM/Ρομποτικής. Πες μου τι θέλεις να δημιουργήσουμε.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSend(s)}
                  className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left text-sm text-gray-300 hover:text-white transition-colors leading-snug"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full py-4 space-y-1">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex items-start gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0">
                  <BotIcon size={15} className="text-white" />
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <MessageInput onSend={onSend} loading={loading} />
    </div>
  )
}
