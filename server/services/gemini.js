// services/gemini.js
const axios = require('axios');
require('dotenv').config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = 'gemini-1.5-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    if (!this.apiKey) {
      console.error('❌ Gemini API key is missing. Please add GEMINI_API_KEY to your .env');
    }
  }

  async sendMessage(prompt) {
    console.log('📡 [Gemini] Sending prompt:', prompt);
    if (!this.apiKey || !prompt) {
      console.error('❌ Gemini API key or prompt is missing');
      return 'Gemini API key or prompt is missing.';
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 20000, // 🔥 Increased timeout from 10000 → 20000
        }
      );

      const text =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        '⚠️ Gemini gave no response.';
      console.log('✅ [Gemini] Response:', text);
      return text;
    } catch (error) {
      console.error('❌ [Gemini] API Error:', error.message, error.response?.data);
      throw new Error(`Gemini failed: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
