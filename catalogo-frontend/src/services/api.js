import axios from 'axios';

// Rimuovi OGNI spazio e gestisci fallback
const API_URL = (process.env.REACT_APP_API_URL || 'https://orsi-production.up.railway.app/api')
  .trim()
  .replace(/\s+/g, '');

console.group('🔍 API Configuration');
console.log('Raw Environment URL:', process.env.REACT_APP_API_URL);
console.log('Cleaned Base URL:', API_URL);
console.log('URL Type:', typeof API_URL);
console.log('URL Validity:', {
  exists: !!API_URL,
  length: API_URL.length,
  isValid: API_URL.startsWith('http')
});
console.groupEnd();

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor di richiesta
api.interceptors.request.use(
  (config) => {
    // Override per tentativi di connessione a localhost
    if (config.url?.includes('localhost')) {
      config.baseURL = API_URL;
      config.url = config.url.replace('http://localhost:5002/api', '');
    }

    console.group('🌐 Request Details');
    console.log('Full Request URL:', `${config.baseURL}${config.url}`);
    console.log('Method:', config.method);
    console.log('Headers:', config.headers);
    
    // Log payload per richieste POST/PUT
    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
      console.log('Request Payload:', config.data);
    }
    
    console.groupEnd();

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor di risposta
api.interceptors.response.use(
  (response) => {
    console.group('✅ Response Success');
    console.log('Status:', response.status);
    console.log('Data Length:', JSON.stringify(response.data).length);
    console.log('Data Type:', typeof response.data);
    console.groupEnd();

    return response.data;
  },
  (error) => {
    console.group('❌ Detailed API Error');
    console.error('Error Context:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    // Analisi dettagliata dell'errore
    if (error.response) {
      console.error('Server Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });

      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Errore del server',
        details: error.response.data,
        fullError: error
      });
    } 
    
    if (error.request) {
      console.error('Request Details:', {
        method: error.request.method,
        url: error.request.url,
        readyState: error.request.readyState
      });

      return Promise.reject({
        message: 'Nessuna risposta ricevuta dal server',
        details: {
          method: error.request.method,
          url: error.request.url
        },
        fullError: error
      });
    }

    // Errore generico di configurazione
    console.error('Configurazione richiesta errata', error);
    return Promise.reject({
      message: 'Errore nella configurazione della richiesta',
      details: error.message,
      fullError: error
    });
  }
);

export default api;