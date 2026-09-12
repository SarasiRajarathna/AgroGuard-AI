require('dotenv').config();

module.exports = {
  apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || null,
  model: process.env.AI_MODEL || 'gemini-1.5-flash',
  highConfidenceThreshold: 90,
  lowConfidenceThreshold: 75,
  isAiConfigured: Boolean(process.env.AI_API_KEY || process.env.GEMINI_API_KEY),
};

