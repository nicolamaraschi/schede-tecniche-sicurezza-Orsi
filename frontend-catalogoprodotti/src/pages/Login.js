// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUtente } from '../api'; // Assicurati di avere una funzione loginUtente nel tuo file API
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importa le icone da react-icons

const Login = () => {
  const [username, setUsername] = useState(''); // Cambiato da email a username
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Stato per il caricamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Imposta il caricamento a true

    try {
      console.log('Attempting login with:', { username, password });
      const response = await loginUtente({ username, password }); // Usa la funzione di login corretta
      alert('Login avvenuto con successo!');
      console.log('Token:', response.token); // Memorizza il token come necessario
      navigate('/'); // Redirect dopo il login
    } catch (err) {
      setError('Nome utente o password errati');
      console.error('Login error:', err);
    } finally {
      setLoading(false); // Imposta il caricamento a false dopo il tentativo
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: '400px' }}>
        <h2 className="mb-4 text-center">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
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
            {loading ? 'Accedendo...' : 'Accedi'} {/* Mostra stato di caricamento */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
