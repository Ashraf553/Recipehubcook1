import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config({ path: './server/.env', quiet: true });
dotenv.config({ quiet: true }); // fallback to root .env

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || process.env.ANTHROPIC_API_KEY;
const isAnthropic = apiKey && apiKey.startsWith('sk-ant-');

if (!apiKey) {
  console.warn(
    '[server] API-ключ не задан — /api/chat будет отвечать ошибкой, пока ты не добавишь GEMINI_API_KEY в server/.env',
  );
}

const ai = (apiKey && !isAnthropic) ? new GoogleGenAI({ apiKey }) : null;
const anthropic = (apiKey && isAnthropic) ? new Anthropic({ apiKey }) : null;

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

const SYSTEM_PROMPT =
  'Ты опытный шеф-повар. Помогаешь приготовить блюдо из ингредиентов пользователя. ' +
  'Отвечай структурированно: название, ингредиенты с граммовкой, пошаговые инструкции, время готовки. ' +
  'Учитывай диетические ограничения. Будь дружелюбным и кратким.';

app.post('/api/chat', async (req, res) => {
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: 'API-ключ не настроен на сервере' });
  }

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
      let geminiMessages = messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }],
      }));

      // Gemini requires conversation history to start with a user message.
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

    res.json({
      reply: reply.trim(),
    });
  } catch (err) {
    console.error('[server] API error:', err);
    res.status(502).json({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] Chef assistant proxy listening on http://localhost:${PORT}`);
});
