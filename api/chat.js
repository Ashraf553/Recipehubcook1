import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

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
    return res.status(500).json({ error: 'API-ключ Gemini не настроен в настройках проекта Vercel' });
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
    const genAI = new GoogleGenerativeAI(apiKey);
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

    return res.status(200).json({
      reply: reply || 'Не удалось сформировать ответ, попробуй переформулировать запрос.',
    });
  } catch (err) {
    console.error('[Vercel API chat] Gemini error:', err);
    return res.status(502).json({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' });
  }
}
