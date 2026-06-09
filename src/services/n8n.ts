import type { AIModel, N8NResponse } from '../types'

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string

export async function sendToN8N(
  message: string,
  chatId: string,
  model: AIModel
): Promise<N8NResponse> {
  if (!WEBHOOK_URL) throw new Error('VITE_N8N_WEBHOOK_URL is not configured')

  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, chat_id: chatId, model }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`n8n error ${response.status}: ${text}`)
  }

  const data = await response.json()
  // n8n can return an array with one item or a plain object
  return Array.isArray(data) ? data[0] : data
}
