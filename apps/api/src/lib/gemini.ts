import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
// Note: In Cloudflare Workers, environment variables are accessed via the global env object passed to the handler.
// We will modify this to accept the API key or env object.

let geminiClient: GoogleGenerativeAI | null = null;

export const getGeminiClient = (apiKey: string) => {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }
  return geminiClient;
};

export const generateEmbedding = async (text: string, apiKey: string) => {
  const client = getGeminiClient(apiKey);
  const model = client.getGenerativeModel({ model: 'text-embedding-004' });

  const result = await model.embedContent(text);
  const embedding = result.embedding;
  return embedding.values;
};

export const generateAnalysis = async (
  symbolOrId: string, 
  name: string, 
  apiKey: string,
  type: 'stock' | 'concept' = 'stock'
) => {
  const client = getGeminiClient(apiKey);
  // Use a cost-effective model for text generation
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  let prompt = '';
  
  if (type === 'stock') {
    prompt = `As an investment analyst, generate a concise 3-bullet point analysis for ${name} (${symbolOrId}).
    Focus on:
    1. Its main business or product.
    2. Its role in current AI or tech trends (if applicable).
    3. Key growth drivers or risks.
    Keep it professional, concise, and in Traditional Chinese (Taiwan).`;
  } else {
    prompt = `As an industry analyst, generate a concise 3-bullet point future outlook for the "${name}" sector/concept.
    Focus on:
    1. Current market trends and demand.
    2. Key technologies or drivers pushing this concept.
    3. Future growth potential over the next 1-3 years.
    Keep it professional, concise, and in Traditional Chinese (Taiwan).`;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Analysis generation failed:', error);
    return '暫時無法生成 AI 分析。';
  }
};

export const generateStockCandidates = async (criteria: string, apiKey: string): Promise<string[]> => {
  const client = getGeminiClient(apiKey);
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    
    // Clean code block if present
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini Candidate generation failed:', error);
    // Fallback for demo/dev when API Key is invalid or quota exceeded
    console.warn('Using Fallback Candidate List');
    return ['2330', '2317', '2454', '2308', '2303', '2603', '2382', '3231', '6669', '3008'];
  }
};
