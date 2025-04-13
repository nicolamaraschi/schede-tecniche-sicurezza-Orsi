import axios from 'axios';

// Aggiungi un fallback per l'URL
const API_URL = process.env.REACT_APP_API_URL || 'https://orsi-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Debug log più dettagliato
console.group('API Configuration');
console.log('Configured Base URL:', API_URL);
console.log('Environment URL:', process.env.REACT_APP_API_URL);
console.log('Type of URL:', typeof API_URL);
console.log('URL Exists:', !!API_URL);
console.groupEnd();

api.interceptors.request.use(
  (config) => {
    console.group('Request Interceptor');
    console.log('Full Request URL:', `${config.baseURL}${config.url}`);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    console.groupEnd();
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.group('Response Interceptor');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.groupEnd();
    return response.data;
  },
  (error) => {
    console.group('Detailed API Error');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    
    if (error.request) {
      console.error('Request Details:', {
        method: error.request.method,
        url: error.request.url,
        readyState: error.request.readyState
      });
    }
    
    console.groupEnd();

    // Gestione degli errori più dettagliata
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Errore del server',
        details: error.response.data
      });
    } 
    
    if (error.request) {
      return Promise.reject({
        message: 'Nessuna risposta ricevuta dal server',
        details: {
          method: error.request.method,
          url: error.request.url
        }
      });
    }

    return Promise.reject({
      message: 'Errore nella configurazione della richiesta',
      details: error.message
    });
  }
);

export default api;