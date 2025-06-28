// services/MultiAIApiService.js
const GeminiService = require('./gemini');

async function getGeminiResponse(prompt, userId) {
  console.log('📡 [MultiAI] Gemini Prompt:', prompt, 'User ID:', userId);

  try {
    const response = await GeminiService.sendMessage(prompt);
    console.log('✅ [MultiAI] Gemini Response:', response);
    return { provider: 'gemini', response };
  } catch (error) {
    console.error('❌ [MultiAI] Gemini Error:', error.message);
    throw error;
  }
}

async function getResponse(prompt, userId) {
  console.log('🧠 [MultiAI] getResponse Started →', { prompt, userId });

  try {
    const res = await getGeminiResponse(prompt, userId);
    console.log('✅ [MultiAI] Response from:', res.provider);
    return res;
  } catch (err) {
    console.error('❌ [MultiAI] Failed:', err.message);
    throw new Error('Could not fetch AI response. Please try again.');
  }
}

module.exports = {
  getResponse,
};