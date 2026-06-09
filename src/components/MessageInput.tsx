import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { SendIcon, Loader2Icon } from 'lucide-react'
import type { AIModel } from '../types'
import ModelSelector from './ModelSelector'

interface Props {
  onSend: (text: string) => void
  loading: boolean
  model: AIModel
  onModelChange: (model: AIModel) => void
  disabled?: boolean
}

export default function MessageInput({ onSend, loading, model, onModelChange, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as FormEvent)
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 pb-5 pt-3 border-t border-white/10 bg-chat"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-2">
          <ModelSelector model={model} onChange={onModelChange} disabled={loading || disabled} />
        </div>
        <div className="flex items-end gap-3 bg-input rounded-2xl border border-white/20 px-4 py-3 focus-within:border-white/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={loading || disabled}
            placeholder={
              model === 'dall-e-3'
                ? 'Περίγραψε την εικόνα 3D STEM render που θέλεις…'
                : 'Γράψε εντολή για άρθρο, Social Media post…'
            }
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 resize-none outline-none leading-relaxed max-h-48 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!value.trim() || loading || disabled}
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2Icon size={15} className="animate-spin text-black" />
            ) : (
              <SendIcon size={15} className="text-black" />
            )}
          </button>
        </div>
      </div>
      <p className="text-center text-[11px] text-gray-600 mt-2">
        Enter για αποστολή · Shift+Enter για νέα γραμμή
      </p>
    </form>
  )
}
