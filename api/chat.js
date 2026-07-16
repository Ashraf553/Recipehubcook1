import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

const SYSTEM_PROMPT =
  'Ты опытный шеф-повар. Помогаешь приготовить блюдо из ингредиентов пользователя. ' +
  'Отвечай структурированно: название, ингредиенты с граммовкой, пошаговые инструкции, время готовки. ' +
  'Учитывай диетические ограничения. Будь дружелюбным и кратким.';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API-ключ не настроен в настройках проекта' });
  }

  const isAnthropic = apiKey.startsWith('sk-ant-');

  const { messages, ingredients = [], dietaryRestrictions = [] } = req.body ?? {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Поле messages обязательно' });
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

    return res.status(200).json({
      reply: reply.trim(),
    });
  } catch (err) {
    console.error('[Vercel API chat] API error:', err);
    return res.status(502).json({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' });
  }
}
