import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
    
    // Load saved username if remember me was used
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Username e password sono obbligatori');
      return;
    }
    
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
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setSuccess('Login effettuato con successo!');
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setError(data.message || 'Credenziali non valide. Riprova.');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Errore di connessione al server. Riprova più tardi.');
      setIsAuthenticated(false);
    }

    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-branding">
          <h1 className="app-title">Tech<span>Sheets</span></h1>
          <p className="app-description">Sistema di gestione schede tecniche e di sicurezza</p>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <h2>Accedi al tuo account</h2>
            <p>Inserisci le tue credenziali per continuare</p>
          </div>
          
          {error && <div className="message-box error">{error}</div>}
          {success && <div className="message-box success">{success}</div>}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Inserisci il tuo username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Inserisci la tua password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                >
                  {isPasswordVisible ? "Nascondi" : "Mostra"}
                </button>
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember-me">Ricordami</label>
              </div>
              <a href="#/" className="forgot-password">Password dimenticata?</a>
            </div>
            
            <button
              type="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Accesso in corso...' : 'Accedi'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>&copy; {new Date().getFullYear()} TechSheets. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;