import axios from 'axios';

// Usa sempre un URL relativo per il proxy di Vercel o l'URL assoluto come fallback
const API_URL = '/api';
const FALLBACK_URL = 'https://orsi-production.up.railway.app/api';

console.group('🔍 API Configuration');
console.log('Using API URL:', API_URL);
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
    // Gestione di URL hardcoded a localhost
    if (config.url?.includes('localhost')) {
      config.url = config.url.replace(/http:\/\/localhost:5002\/api/, '');
    }

    console.group('🌐 Request Details');
    console.log('Full Request URL:', `${config.baseURL}${config.url}`);
    console.log('Method:', config.method);
    console.groupEnd();

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor per gestire errori di rete
api.interceptors.response.use(
  (response) => {
    console.group('✅ Response Success');
    console.log('Status:', response.status);
    console.log('Data Length:', JSON.stringify(response.data).length);
    console.groupEnd();

    return response.data;
  },
  (error) => {
    console.group('❌ API Error');
    console.error('Error Context:', error.message);
    
    // Tenta di utilizzare il FALLBACK_URL se la richiesta originale fallisce
    if (error.message === 'Network Error' && error.config && !error.config._isRetry) {
      console.log('Attempting fallback to direct API URL...');
      
      const originalRequest = error.config;
      originalRequest._isRetry = true;
      originalRequest.baseURL = FALLBACK_URL;
      
      return axios(originalRequest)
        .then(response => response.data)
        .catch(fallbackError => {
          console.error('Fallback request also failed:', fallbackError.message);
          return Promise.reject(fallbackError);
        });
    }
    
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default api;