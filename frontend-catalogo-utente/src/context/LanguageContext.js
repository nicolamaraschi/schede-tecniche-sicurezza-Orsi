import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  it: require('../locales/it.json'),
  en: require('../locales/en.json'),
  fr: require('../locales/fr.json'),
  es: require('../locales/es.json'),
  de: require('../locales/de.json'),
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('it'); // Imposta l'italiano come lingua predefinita
  const [t, setT] = useState(() => (key) => translations.it[key] || key); // Funzione di traduzione iniziale

  useEffect(() => {
    setT(() => (key) => translations[language][key] || key);
  }, [language]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    } else {
      console.warn(`Language ${lang} not supported.`);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);