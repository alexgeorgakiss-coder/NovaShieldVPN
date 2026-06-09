import { FileTextIcon, ImageIcon } from 'lucide-react'
import type { AIModel } from '../types'

interface Props {
  model: AIModel
  onChange: (model: AIModel) => void
  disabled?: boolean
}

const OPTIONS: { value: AIModel; label: string; icon: typeof FileTextIcon }[] = [
  { value: 'gpt-4o', label: 'GPT-4o', icon: FileTextIcon },
  { value: 'dall-e-3', label: 'DALL·E 3', icon: ImageIcon },
]

export default function ModelSelector({ model, onChange, disabled }: Props) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl border border-white/15 bg-white/5">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = model === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            disabled={disabled}
            title={value === 'gpt-4o' ? 'Κείμενο / Άρθρα' : 'Δημιουργία Εικόνας'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
              active
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
