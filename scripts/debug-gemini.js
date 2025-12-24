const { GoogleGenerativeAI } = require('@google/generative-ai');

// Key from .dev.vars
const API_KEY = 'AIzaSyAITmkUblckQXzhZ3mmsKvPDdqK1vGkV9Q';

async function testGemini() {
  console.log('Testing Gemini API with key:', API_KEY);
  const client = new GoogleGenerativeAI(API_KEY);
  const model = client.getGenerativeModel({ model: 'gemini-pro' });

  const criteria = 'AI';
  const prompt = `
  As a database expert for the Taiwan Stock Market (TWSE/TPEX), 
  list the top 30 stock tickers that match the following criteria: "${criteria}".
  
  Strict Rules:
  1. Return ONLY a valid JSON array of strings. No markdown, no explanations.
  2. Format: ["2330", "2454", "2317", ...] (Remove .TW suffix)
  3. Ensure the stocks are real, listed Taiwan stocks.
  4. If the criteria mentions a sector (e.g. "Semiconductor"), include the leaders.
  5. If the criteria implies fundamental data (e.g. "High Yield"), interpret broadly to potential candidates (we will verify data later).
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Response:', text);

    // Clean code block if present
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    console.log('Parsed:', JSON.parse(cleanedText));
  } catch (error) {
    console.error('Gemini Error:', error);
  }
}

testGemini();
