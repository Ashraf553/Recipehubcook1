import { GoogleGenerativeAI } from '@google/generative-ai';

const MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

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
    return new Response(JSON.stringify({ error: 'API-ключ Gemini не настроен на сервере' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

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

    return new Response(
      JSON.stringify({ reply: reply || 'Не удалось сформировать ответ, попробуй переформулировать запрос.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[chat function] Gemini API error:', err);
    return new Response(JSON.stringify({ error: 'Ошибка при обращении к ИИ. Попробуй позже.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  path: '/api/chat',
};
