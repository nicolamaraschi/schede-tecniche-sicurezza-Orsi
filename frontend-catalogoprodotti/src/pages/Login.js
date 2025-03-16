// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUtente, isAuthenticated } from '../api';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();

  // Verifica se è stata effettuata una redirezione a causa di sessione scaduta
  useEffect(() => {
    // Verifica se c'è un parametro nella URL che indica sessione scaduta
    const urlParams = new URLSearchParams(window.location.search);
    const sessionExpired = urlParams.get('sessionExpired');
    
    if (sessionExpired === 'true') {
      setIsSessionExpired(true);
      setError('La tua sessione è scaduta. Effettua nuovamente il login.');
    }
    
    // Se l'utente è già autenticato, reindirizza alla home
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', { username, password });
      const response = await loginUtente({ username, password });
      console.log('Login successful, token:', response.token);
      
      // Reimposta il flag sessione scaduta
      setIsSessionExpired(false);
      
      // Reindirizza dopo il login
      navigate('/home');
    } catch (err) {
      setError('Nome utente o password errati');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Login</h2>
        
        {isSessionExpired && (
          <div className="alert alert-warning">
            La tua sessione è scaduta. Per favore, effettua nuovamente il login.
          </div>
        )}
        
        {error && !isSessionExpired && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              <FaEnvelope className="me-2" />
              Nome Utente:
            </label>
            <input 
              type="text" 
              className="form-control" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              <FaLock className="me-2" />
              Password:
            </label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Accedendo...' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;