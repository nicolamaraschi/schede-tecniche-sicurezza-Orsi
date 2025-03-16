// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api';

const ProtectedRoute = ({ children }) => {
  // Verifica se l'utente è autenticato
  if (!isAuthenticated()) {
    // Se non è autenticato, reindirizza al login con parametro di sessione scaduta
    return <Navigate to="/login?sessionExpired=true" replace />;
  }

  // Se l'utente è autenticato, mostra il componente protetto
  return children;
};

export default ProtectedRoute;