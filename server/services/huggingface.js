// services/huggingface.js
const axios = require('axios');

class HuggingFaceService {
  constructor() {
    this.apiKey = process.env.HF_API_KEY || '';
    this.apiUrl = 'https://api-inference.huggingface.co/models/bionlp/bluebert_pubmed_mimic_uncased_L-12_H-768_A-12';

    if (!this.apiKey) {
      console.warn('HuggingFace API key is missing. Please add HF_API_KEY to your .env');
    }
  }

  async sendMessage(prompt) {
    if (!this.apiKey || !prompt) {
      return 'HuggingFace API key or prompt is missing.';
    }

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          inputs: prompt,
          parameters: { max_length: 500 },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // Increased slightly to match backend timeout window
        }
      );

      // Depending on the model, Hugging Face responses can vary in structure
      const result = Array.isArray(response.data)
        ? response.data[0]?.generated_text
        : response.data?.generated_text;

      return result || 'HuggingFace gave no response.';
    } catch (error) {
      console.error('HuggingFace API Error:', error.message, error.response?.data || '');
      return `HuggingFace failed: ${error.message}`;
    }
  }
}

module.exports = new HuggingFaceService();
