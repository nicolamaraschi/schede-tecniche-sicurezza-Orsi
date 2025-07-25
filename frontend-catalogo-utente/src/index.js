import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';
import translationES from './locales/es.json';
import translationDE from './locales/de.json';
import translationIT from './locales/it.json';

const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  },
  es: {
    translation: translationES
  },
  de: {
    translation: translationDE
  },
  it: {
    translation: translationIT
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "it", // default language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false // react already escapes by default
    }
  });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <React.Suspense fallback="loading">
      <App />
    </React.Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
