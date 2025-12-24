const { GoogleGenerativeAI } = require('@google/generative-ai');

// Key from .dev.vars
const API_KEY = 'AIzaSyAITmkUblckQXzhZ3mmsKvPDdqK1vGkV9Q';

async function testEmbedding() {
  console.log('Testing Gemini Embedding with key:', API_KEY);
  const client = new GoogleGenerativeAI(API_KEY);
  const model = client.getGenerativeModel({ model: 'text-embedding-004' });

  try {
    const result = await model.embedContent('Hello world');
    console.log(
      'Embedding Success! Vector length:',
      result.embedding.values.length
    );
  } catch (error) {
    console.error('Embedding Error:', error);
  }
}

testEmbedding();
