// src/components/AuthWrapper.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Componente per gestire gli errori di autenticazione nelle chiamate API
const AuthWrapper = ({ children }) => {
  const { isAuthenticated, checkTokenExpiration } = useAuth();
  const [error, setError] = useState(null);

  // Intercetta gli errori globali per verificare se il token è scaduto
  useEffect(() => {
    const handleError = (event) => {
      // Se l'errore è un errore di rete, non lo gestiamo qui
      if (event.message === 'Failed to fetch') return;
      
      // Controlla se l'errore è relativo al token
      if (isAuthenticated && event.message && 
         (event.message.includes('token') || 
          event.message.includes('unauthorized') || 
          event.message.includes('401'))) {
        
        // Verifica se il token è scaduto e gestisci di conseguenza
        const isExpired = checkTokenExpiration(event);
        
        if (isExpired) {
          setError('Sessione scaduta. Effettua nuovamente il login.');
        }
      }
    };

    // Aggiungi l'event listener
    window.addEventListener('error', handleError);
    
    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener('error', handleError);
    };
  }, [isAuthenticated, checkTokenExpiration]);

  // Mostra il messaggio di errore se presente
  return (
    <>
      {error && (
        <div className="alert alert-warning" role="alert">
          {error}
        </div>
      )}
      {children}
    </>
  );
};

export default AuthWrapper;