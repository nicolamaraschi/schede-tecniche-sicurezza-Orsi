// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Crea il context per l'autenticazione
export const AuthContext = createContext();

// Custom hook per utilizzare il context dell'autenticazione
export const useAuth = () => useContext(AuthContext);

// Provider del context per l'autenticazione
export const AuthProvider = ({ children }) => {
  // Stato per memorizzare il token
  const [token, setToken] = useState(localStorage.getItem('token'));
  // Stato per memorizzare l'username dell'utente
  const [username, setUsername] = useState(localStorage.getItem('username'));
  // Stato per verificare se l'utente è autenticato
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  // Stato per verificare se stiamo caricando
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Effetto per aggiornare localStorage quando cambia il token
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
  }, [token]);

  // Effetto per aggiornare localStorage quando cambia l'username
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  // Funzione per effettuare il login
  const login = (newToken, user) => {
    setToken(newToken);
    setUsername(user);
    setIsAuthenticated(true);
    navigate('/');
  };

  // Funzione per effettuare il logout
  const logout = () => {
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  // Funzione per verificare se il token è scaduto
  const checkTokenExpiration = (error) => {
    if (error.message === 'Invalid or expired token' || 
        error.message.includes('token') || 
        error.message.includes('unauthorized') ||
        error.status === 401) {
      logout();
      return true;
    }
    return false;
  };

  // Valori forniti dal context
  const contextValue = {
    token,
    username,
    isAuthenticated,
    loading,
    setLoading,
    login,
    logout,
    checkTokenExpiration
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};