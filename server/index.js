import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: './server/.env', quiet: true });
dotenv.config({ quiet: true }); // fallback to root .env

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.API_KEY || process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.warn(
    '[server] API-ключ Gemini не задан — /api/chat будет отвечать ошибкой, пока ты не добавишь GEMINI_API_KEY в server/.env',
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const SYSTEM_PROMPT =
  'Ты опытный шеф-повар. Помогаешь приготовить блюдо из ингредиентов пользователя. ' +
  'Отвечай структурированно: название, ингредиенты с граммовкой, пошаговые инструкции, время готовки. ' +
  'Учитывай диетические ограничения. Будь дружелюбным и кратким.';

app.post('/api/chat', async (req, res) => {
  if (!genAI) {
    return res
      .status(500)
      .json({ error: 'API-ключ Gemini не настроен на сервере' });
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
    const generativeModel = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: system,
    });

    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await generativeModel.generateContent({
      contents,
    });

    const reply = response.response.text();

    res.json({
      reply: reply || 'Не удалось сформировать ответ, попробуй переформулировать запрос.',
    });
  } catch (err) {
    console.error('[server] Gemini API error:', err);
    res.status(502).json({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] Chef assistant proxy listening on http://localhost:${PORT}`);
});
