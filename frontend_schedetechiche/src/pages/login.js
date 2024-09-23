import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Aggiungi Link qui
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5002/api/auth/login', {
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
        navigate('/');
      } else {
        setError(data.message || 'Errore durante il login.');
      }
    } catch (err) {
      setError('Errore di rete. Riprova più tardi.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Accedi</h2>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>
        {menuOpen && (
          <div className="menu">
            <Link to="/login" className="menu-item">Login</Link>
            <Link to="/create-product" className="menu-item">Crea Prodotto</Link>
            <Link to="/upload-document" className="menu-item">Carica Documento</Link>
            <Link to="/view-documents" className="menu-item">Visualizza Documenti</Link>
            <Link to="/product-info" className="menu-item">Info Prodotto</Link>
          </div>
        )}
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
