import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Debug log per variabile d'ambiente
console.log('API Base URL:', {
  url: process.env.REACT_APP_API_URL,
  type: typeof process.env.REACT_APP_API_URL,
  trimmed: process.env.REACT_APP_API_URL?.trim(),
  exists: !!process.env.REACT_APP_API_URL
});

api.interceptors.request.use( 
  (config) => {
    console.log('Request Interceptor:', {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response Interceptor Success:', {
      status: response.status,
      data: response.data
    });
    return response.data;
  },
  (error) => {
    console.error('Detailed API Error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      config: {
        baseURL: error.config?.baseURL,
        url: error.config?.url,
        method: error.config?.method
      },
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      } : null,
      request: error.request ? {
        method: error.request.method,
        path: error.request.path
      } : null
    });

    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message || 'Server error',
        details: error.response.data
      });
    } else if (error.request) {
      return Promise.reject({
        message: 'No response received from server',
        request: {
          method: error.request.method,
          path: error.request.path
        }
      });
    } else {
      return Promise.reject({
        message: 'Error setting up the request',
        errorMessage: error.message
      });
    }
  }
);

export default api;