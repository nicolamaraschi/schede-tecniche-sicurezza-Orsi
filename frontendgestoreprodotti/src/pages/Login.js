import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api'; // Assicurati di avere una funzione loginUser nel tuo file API
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Importa le icone da react-icons

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Stato per il caricamento
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Imposta il caricamento a true

    try {
      console.log('Attempting login with:', { email, password });
      await loginUser({ email, password });
      navigate('/'); // Redirect dopo il login
    } catch (err) {
      setError('Email o password errati');
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
            <label htmlFor="email" className="form-label">
              <FaEnvelope className="me-2" />
              Email:
            </label>
            <input 
              type="text"  // Mantieni come text per uso con email di test
              className="form-control" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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
