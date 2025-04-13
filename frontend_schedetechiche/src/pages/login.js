import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se l'utente è già autenticato
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Reindirizza alla home se c'è già un token
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://orsi-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login effettuato con successo!');
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true); // Imposta lo stato di autenticazione
        
        // Breve ritardo per mostrare il messaggio di successo
        setTimeout(() => {
          navigate('/'); // Reindirizza alla home dopo il login
        }, 1000);
      } else {
        setError(data.message || 'Errore durante il login.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Errore di rete. Riprova più tardi.');
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Accedi</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Inserisci il tuo username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Inserisci la tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {loading ? (
            <button type="submit" disabled className="loading-btn">
              Caricamento...
            </button>
          ) : (
            <button type="submit" className="login-btn">
              Accedi
            </button>
          )}
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Login;