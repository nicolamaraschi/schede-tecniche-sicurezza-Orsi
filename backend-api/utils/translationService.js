const { GoogleGenerativeAI } = require('@google/generative-ai');

// Inizializza il client di Gemini con la chiave API dall'ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const TARGET_LANGUAGES = ['en', 'fr', 'es', 'de'];

/**
 * Traduce un testo dall'italiano in più lingue utilizzando Gemini.
 * @param {string} text - Il testo in italiano da tradurre.
 * @returns {Promise<Object>} - Un oggetto con le traduzioni, inclusa quella originale in italiano.
 * Es: { it: 'Ciao', en: 'Hello', fr: 'Bonjour', ... }
 */
async function translateText(text) {
  // Se il testo è vuoto o non è una stringa, restituisce un oggetto con tutte le lingue vuote
  if (!text || typeof text !== 'string' || text.trim() === '') {
    const emptyTranslations = { it: text || '' };
    TARGET_LANGUAGES.forEach(lang => {
      emptyTranslations[lang] = '';
    });
    return emptyTranslations;
  }

  const prompt = `Traduci il seguente testo italiano in queste lingue: ${TARGET_LANGUAGES.join(', ')}.
Il testo da tradurre è: "${text}".
Restituisci il risultato come un oggetto JSON valido con le seguenti chiavi: ${TARGET_LANGUAGES.map(lang => `"${lang}"`).join(', ')}.
Non includere markdown o altre formattazioni, solo l'oggetto JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Pulizia della risposta per estrarre solo il JSON
    const jsonString = response.text().replace(/```json|```/g, '').trim();
    
    const translated = JSON.parse(jsonString);

    // Aggiunge la versione italiana originale all'oggetto
    return {
      it: text,
      ...translated,
    };
  } catch (error) {
    console.error('Errore durante la traduzione con Gemini:', error);
    // In caso di errore, ritorna un oggetto con il testo originale e stringhe vuote per le altre lingue
    const fallbackTranslations = { it: text };
    TARGET_LANGUAGES.forEach(lang => {
      fallbackTranslations[lang] = ''; // O potresti mettere un messaggio di errore
    });
    return fallbackTranslations;
  }
}

module.exports = { translateText };
