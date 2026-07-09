import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

const SYSTEM_PROMPT =
  'Ты опытный шеф-повар. Помогаешь приготовить блюдо из ингредиентов пользователя. ' +
  'Отвечай структурированно: название, ингредиенты с граммовкой, пошаговые инструкции, время готовки. ' +
  'Учитывай диетические ограничения. Будь дружелюбным и кратким.';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API-ключ не настроен на сервере' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const isAnthropic = apiKey.startsWith('sk-ant-');

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Неверный формат JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, ingredients = [], dietaryRestrictions = [] } = body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: 'Поле messages обязательно' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contextLines = [];
  if (ingredients.length) {
    contextLines.push(`Доступные ингредиенты у пользователя: ${ingredients.join(', ')}.`);
  }
  if (dietaryRestrictions.length) {
    contextLines.push(`Диетические ограничения: ${dietaryRestrictions.join(', ')}.`);
  }

  const system = contextLines.length
    ? `${SYSTEM_PROMPT}\n\n${contextLines.join('\n')}`
    : SYSTEM_PROMPT;

  try {
    let reply = '';
    if (isAnthropic) {
      const anthropic = new Anthropic({ apiKey });
      const response = await anthropic.messages.create({
        model: ANTHROPIC_MODEL,
        system: system,
        messages: messages.map((m) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        max_tokens: 1024,
      });
      reply = response.content[0].text;
    } else {
      const ai = new GoogleGenAI({ apiKey });
      let geminiMessages = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }],
      }));

      if (geminiMessages.length > 0 && geminiMessages[0].role === 'model') {
        geminiMessages.shift();
      }

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: geminiMessages,
        config: {
          systemInstruction: system,
          maxOutputTokens: 1024,
        },
      });

      reply = response.text || 'Не удалось сформировать ответ, попробуй переформулировать запрос.';
    }

    return new Response(
      JSON.stringify({ reply: reply.trim() }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[chat function] API error:', err);
    return new Response(JSON.stringify({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/chat',
};
