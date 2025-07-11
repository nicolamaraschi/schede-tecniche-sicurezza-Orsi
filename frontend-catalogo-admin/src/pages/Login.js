import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Verifica sessione scaduta dal parametro URL
    const searchParams = new URLSearchParams(location.search);
    const sessionExpired = searchParams.get('sessionExpired');
    
    if (sessionExpired === 'true') {
      setError('La tua sessione è scaduta. Effettua nuovamente il login.');
    }
    
    // Verifica se l'utente è già autenticato
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/home');
    }
    
    // Carica username salvato se "ricordami" era attivo
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [location, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validazione form
    if (!username.trim() || !password.trim()) {
      setError('Inserisci username e password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://orsi-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.token) {
        // Gestione "ricordami"
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        localStorage.setItem('authToken', data.token);
        navigate('/home');
      } else {
        setError(data.message || 'Nome utente o password non validi');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Errore durante il login. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="catalog-login-page">
      <div className="login-content-wrapper">
        <div className="login-brand-section">
          <h1 className="login-brand-title">Catalogo <span>Prodotti</span></h1>
          <p className="login-brand-tagline">Sistema di gestione catalogo e schede prodotti</p>
        </div>
        
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <FaUser className="login-icon" />
            </div>
            <h2>Accesso Admin</h2>
            <p>Accedi per gestire i prodotti del catalogo</p>
          </div>
          
          {error && (
            <div className="login-alert error">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}
          
          {location.search.includes('sessionExpired') && (
            <div className="login-alert info">
              <FaInfoCircle />
              <span>Sessione scaduta per inattività. Effettua nuovamente il login.</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <FaUser className="input-icon" />
                <span>Username</span>
              </label>
              <input
                type="text"
                id="username"
                placeholder="Inserisci il tuo username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoComplete="username"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="input-icon" />
                <span>Password</span>
              </label>
              <div className="password-field">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
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
              <div className="remember-option">
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
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spinner-icon" />
                  <span>Autenticazione...</span>
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
            <p>&copy; {new Date().getFullYear()} EG Store. Tutti i diritti riservati.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;