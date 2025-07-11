// src/utils/tokenExpiredHandler.js
import { useAuth } from '../contexts/AuthContext';

// Questa funzione può essere utilizzata nelle chiamate API per verificare se il token è scaduto
export const useTokenExpiredHandler = () => {
  const { logout } = useAuth();

  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    // Verifica se l'errore è relativo al token scaduto o non valido
    if (error.message === 'Invalid or expired token' || 
        error.status === 401 || 
        (error.response && error.response.status === 401)) {
      
      // Effettua il logout e reindirizza alla pagina di login
      logout();
      
      // Restituisci un messaggio di errore user-friendly
      return "La tua sessione è scaduta. Effettua nuovamente il login.";
    }
    
    // Per altri tipi di errori, restituisci il messaggio originale
    return error.message || "Si è verificato un errore durante la richiesta.";
  };

  return { handleApiError };
};