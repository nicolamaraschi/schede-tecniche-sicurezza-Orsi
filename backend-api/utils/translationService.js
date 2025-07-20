const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const TARGET_LANGUAGES = ['en', 'fr', 'es', 'de'];

/**
 * Traduce un testo dall'italiano in più lingue utilizzando OpenAI GPT-3.5-turbo.
 * @param {string} text - Il testo in italiano da tradurre.
 * @returns {Promise<Object>} - Un oggetto con le traduzioni, inclusa quella originale in italiano.
 * Es: { it: 'Ciao', en: 'Hello', fr: 'Bonjour', ... }
 */
async function translateText(text) {
  console.log(`[TranslationService] Attempting to translate: "${text}" using OpenAI`);

  if (!text || typeof text !== 'string' || text.trim() === '') {
    const emptyTranslations = { it: text || '' };
    TARGET_LANGUAGES.forEach(lang => {
      emptyTranslations[lang] = '';
    });
    console.log(`[TranslationService] Empty or invalid text, returning fallback:`, emptyTranslations);
    return emptyTranslations;
  }

  const openaiApiKey = process.env.OPENAI_API_KEY;
  console.log(`[TranslationService] OPENAI_API_KEY value: ${openaiApiKey ? '*****' + openaiApiKey.slice(-4) : 'NOT SET'}`); // Log solo le ultime 4 cifre per sicurezza
  if (!openaiApiKey) {
    console.error('[TranslationService] OPENAI_API_KEY is not set.');
    const fallbackTranslations = { it: text };
    TARGET_LANGUAGES.forEach(lang => {
      fallbackTranslations[lang] = '';
    });
    return fallbackTranslations;
  }

  const prompt = `Translate the following Italian text into these languages: ${TARGET_LANGUAGES.join(', ')}.\nReturn the result as a valid JSON object with the following keys: ${TARGET_LANGUAGES.map(lang => `"${lang}"`).join(', ')}.\nDo not include markdown or any other formatting, only the JSON object.\nItalian text to translate: "${text}"`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo as requested
      messages: [
        { role: 'system', content: 'You are a helpful assistant for translations. Always respond with a JSON object.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    });

    const jsonString = chatCompletion.choices[0].message.content.trim();
    console.log(`[TranslationService] Raw OpenAI response text: ${jsonString}`);
    
    let translated = JSON.parse(jsonString);

    // Ensure translations are flat strings, handling potential nested objects from OpenAI
    const cleanedTranslations = {};
    for (const lang of TARGET_LANGUAGES) {
      if (translated[lang]) {
        if (typeof translated[lang] === 'object' && translated[lang].translation) {
          cleanedTranslations[lang] = translated[lang].translation;
        } else if (typeof translated[lang] === 'string') {
          cleanedTranslations[lang] = translated[lang];
        }
      }
    }
    translated = cleanedTranslations;

    const finalTranslations = {
      it: text,
      ...translated,
    };
    console.log(`[TranslationService] Successfully translated:`, finalTranslations);
    return finalTranslations;
  } catch (error) {
    console.error('[TranslationService] Error during translation with OpenAI:', error);
    const fallbackTranslations = { it: text };
    TARGET_LANGUAGES.forEach(lang => {
      fallbackTranslations[lang] = '';
    });
    console.log(`[TranslationService] Returning fallback due to error:`, fallbackTranslations);
    return fallbackTranslations;
  }
}

module.exports = { translateText };