import type { AirtableRecord, ChatSession, Message } from '../types'
import { v4 as uuidv4 } from 'uuid'

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY as string
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID as string
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE_NAME as string || 'Chat History'

function baseUrl() {
  return `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`
}

function headers() {
  return { Authorization: `Bearer ${API_KEY}` }
}

export async function fetchAllSessions(): Promise<ChatSession[]> {
  if (!API_KEY || !BASE_ID) return []

  const url = `${baseUrl()}?sort[0][field]=timestamp&sort[0][direction]=desc&maxRecords=200`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) return []

  const data = await res.json()
  const records: AirtableRecord[] = data.records ?? []

  // Group by chat_id, keep the latest record per chat_id as representative
  const sessionMap = new Map<string, ChatSession>()
  for (const r of records) {
    const chatId = r.fields.chat_id
    if (!chatId || sessionMap.has(chatId)) continue
    sessionMap.set(chatId, {
      chatId,
      title: r.fields.user_message?.slice(0, 60) ?? 'Νέα Συνομιλία',
      timestamp: new Date(r.fields.timestamp ?? Date.now()),
    })
  }

  return Array.from(sessionMap.values())
}

export async function fetchMessagesForChat(chatId: string): Promise<Message[]> {
  if (!API_KEY || !BASE_ID) return []

  const filter = encodeURIComponent(`{chat_id}="${chatId}"`)
  const url = `${baseUrl()}?filterByFormula=${filter}&sort[0][field]=timestamp&sort[0][direction]=asc`
  const res = await fetch(url, { headers: headers() })
  if (!res.ok) return []

  const data = await res.json()
  const records: AirtableRecord[] = data.records ?? []

  const messages: Message[] = []
  for (const r of records) {
    messages.push({
      id: uuidv4(),
      role: 'user',
      content: r.fields.user_message ?? '',
      timestamp: new Date(r.fields.timestamp ?? Date.now()),
    })
    if (r.fields.ai_response) {
      let parsed: { message?: string; html?: string; wp_link?: string; seo_title?: string; meta_description?: string; seo_keywords?: string } = {}
      try {
        parsed = JSON.parse(r.fields.ai_response)
      } catch {
        parsed = { message: r.fields.ai_response }
      }
      messages.push({
        id: uuidv4(),
        role: 'assistant',
        content: parsed.message ?? r.fields.ai_response,
        html: parsed.html,
        wpLink: parsed.wp_link ?? r.fields.wp_link,
        seoTitle: parsed.seo_title,
        metaDescription: parsed.meta_description,
        seoKeywords: parsed.seo_keywords,
        timestamp: new Date(r.fields.timestamp ?? Date.now()),
      })
    }
  }
  return messages
}
