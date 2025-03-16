// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Componente per proteggere le route private
const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Se l'utente è autenticato, mostra il contenuto della rotta
  // altrimenti, reindirizza alla pagina di login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;