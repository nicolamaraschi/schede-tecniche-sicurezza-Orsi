// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUtente } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Effetto per reindirizzare se già autenticato
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validazione basilare
    if (!username.trim() || !password.trim()) {
      setError('Inserisci nome utente e password');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUtente({ username, password });
      
      if (response && response.token) {
        // Effettua il login attraverso il context
        login(response.token, username);
        navigate('/');
      } else {
        setError('Si è verificato un errore durante il login');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Nome utente o password non validi');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-icon">
                <FaUser />
              </div>
            </div>
            <h1>Accedi</h1>
            <p>Inserisci le tue credenziali per accedere al sistema</p>
          </div>
          
          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Nome Utente"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={toggleShowPassword}
                  disabled={loading}
                >
                  {showPassword ? "Nascondi" : "Mostra"}
                </button>
              </div>
            </div>
            
            <div className="form-group remember-me">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Ricordami
              </label>
              <button type="button" className="btn btn-link forgot-password">Password dimenticata?</button>
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner" />
                  <span>Accesso in corso...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Accedi</span>
                </>
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <p>© {new Date().getFullYear()} EGStore. Tutti i diritti riservati.</p>
          </div>
        </div>
        
        <div className="login-decoration">
          <div className="decoration-image"></div>
          <div className="decoration-text">
            <h2>Benvenuto in EGStore</h2>
            <p>Sistema di gestione per prodotti e cataloghi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;