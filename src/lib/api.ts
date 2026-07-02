import type { ChatMessage, DietaryRestriction } from '../data/types';

export interface ChefAssistantRequest {
  messages: Pick<ChatMessage, 'role' | 'content'>[];
  ingredients: string[];
  dietaryRestrictions: DietaryRestriction[];
}

export interface ChefAssistantResponse {
  reply: string;
}

/**
 * Calls the local proxy backend (see /server), which forwards the request to
 * the Anthropic API. The API key never reaches the browser.
 */
export async function askChefAssistant(
  payload: ChefAssistantRequest,
): Promise<ChefAssistantResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Ассистент недоступен (${res.status})`);
  }

  return res.json();
}
