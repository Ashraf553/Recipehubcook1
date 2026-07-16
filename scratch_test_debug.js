import { GoogleGenAI } from '@google/genai';

const apiKey = 'AIzaSyAm4gZh6UytqiAfiFmhcSCdkDynfA8_1bg';
console.log('Using API key:', apiKey);

const ai = new GoogleGenAI({ apiKey });

async function run() {
  console.log('--- Test 1 (Simple string content) ---');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello, are you there?',
    });
    console.log('Test 1 Success! Response:', response.text);
  } catch (err) {
    console.error('Test 1 Failed:', err.message);
  }

  console.log('\n--- Test 2 (Detailed content/config) ---');
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: 'Привет!' }] }],
      config: {
        systemInstruction: 'Ты шеф-повар.',
      }
    });
    console.log('Test 2 Success! Response:', response.text);
  } catch (err) {
    console.error('Test 2 Failed:', err.message);
  }
}

run();
