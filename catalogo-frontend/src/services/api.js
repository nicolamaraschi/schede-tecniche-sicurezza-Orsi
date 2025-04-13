import axios from 'axios';

// URL diretto al backend su Railway
const API_URL = 'https://orsi-production.up.railway.app/api';

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
    // Rimuovi riferimenti a localhost se presenti
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

// Interceptor di risposta
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
    console.error('Full Error:', error);
    console.groupEnd();
    return Promise.reject(error);
  }
);

export default api;