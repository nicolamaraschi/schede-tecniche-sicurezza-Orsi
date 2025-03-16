// src/services/authService.js

// Funzione per verificare se il token è presente
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };
  
  // Funzione per ottenere il token
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Funzione per impostare il token
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Funzione per rimuovere il token (logout)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  // Funzione per verificare se il token è scaduto
  export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;
    
    try {
      // Decodifica del token JWT (la parte centrale)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Verifica la scadenza del token (exp è in secondi)
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      // In caso di errore nel parsing, considera il token come scaduto
      console.error('Error parsing JWT token:', error);
      return true;
    }
  };
  
  // Funzione per impostare un interceptor globale per le richieste API
  export const setupAuthInterceptor = (navigate) => {
    // Questo potrebbe essere utilizzato con axios o simili
    // Ma possiamo implementare una soluzione personalizzata per fetch
    
    // Funzione wrapper per fetch che aggiunge l'header di autorizzazione
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      // Verifica se il token è scaduto prima di ogni richiesta
      if (isTokenExpired()) {
        removeToken();
        navigate('/login');
        throw new Error('Token expired. Please login again.');
      }
      
      // Aggiungi il token all'header Authorization se è presente
      const token = getToken();
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      
      // Esegui la richiesta originale
      return originalFetch(url, options);
    };
  };
  
  // Funzione per ripristinare fetch originale (utile nei test)
  export const resetFetchInterceptor = () => {
    window.fetch = originalFetch;
  };
  
  // Backup del fetch originale
  const originalFetch = window.fetch;