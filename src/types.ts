export type AIModel = 'gpt-4o' | 'dall-e-3'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  html?: string
  wpLink?: string
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  timestamp: Date
}

export interface ChatSession {
  chatId: string
  title: string
  timestamp: Date
}

export interface N8NResponse {
  message?: string
  output?: string
  wp_link?: string
  html?: string
  seo_title?: string
  meta_description?: string
  seo_keywords?: string
}

export interface AirtableRecord {
  id: string
  fields: {
    chat_id: string
    user_message: string
    ai_response: string
    timestamp?: string
    wp_link?: string
  }
}
