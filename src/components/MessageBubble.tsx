import { useState } from 'react'
import DOMPurify from 'dompurify'
import {
  BotIcon,
  UserIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
  TagIcon,
  FileTextIcon,
} from 'lucide-react'
import type { Message } from '../types'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const [articleOpen, setArticleOpen] = useState(false)
  const [seoOpen, setSeoOpen] = useState(false)

  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end px-4 py-3">
        <div className="max-w-[75%] bg-bubble rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center shrink-0 mt-0.5">
          <UserIcon size={15} className="text-brand" />
        </div>
      </div>
    )
  }

  const cleanHtml = message.html
    ? DOMPurify.sanitize(message.html, { USE_PROFILES: { html: true } })
    : null

  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
        <BotIcon size={15} className="text-black" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Main message text */}
        <p className="text-sm text-gray-100 leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {/* WordPress link */}
        {message.wpLink && (
          <a
            href={message.wpLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand/10 border border-brand/30 text-brand text-sm font-medium hover:bg-brand/20 transition-colors"
          >
            <ExternalLinkIcon size={14} />
            Δες το άρθρο στο WordPress
          </a>
        )}

        {/* Article preview toggle */}
        {cleanHtml && (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setArticleOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300"
            >
              <span className="flex items-center gap-2">
                <FileTextIcon size={14} className="text-brand" />
                Προεπισκόπηση Άρθρου
              </span>
              {articleOpen ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            </button>
            {articleOpen && (
              <div
                className="px-5 py-4 bg-white/[0.03] article-content text-sm"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            )}
          </div>
        )}

        {/* SEO metadata toggle */}
        {(message.seoTitle || message.metaDescription || message.seoKeywords) && (
          <div className="rounded-xl border border-white/10 overflow-hidden">
            <button
              onClick={() => setSeoOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white/5 hover:bg-white/10 transition-colors text-sm text-gray-300"
            >
              <span className="flex items-center gap-2">
                <SearchIcon size={14} className="text-gray-300" />
                SEO Metadata
              </span>
              {seoOpen ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            </button>
            {seoOpen && (
              <div className="px-4 py-3 space-y-3 bg-white/[0.03]">
                {message.seoTitle && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                      SEO Title
                    </p>
                    <p className="text-sm text-gray-200">{message.seoTitle}</p>
                  </div>
                )}
                {message.metaDescription && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                      Meta Description
                    </p>
                    <p className="text-sm text-gray-300">{message.metaDescription}</p>
                  </div>
                )}
                {message.seoKeywords && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
                      Keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {message.seoKeywords.split(',').map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-gray-200 text-xs"
                        >
                          <TagIcon size={9} />
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
