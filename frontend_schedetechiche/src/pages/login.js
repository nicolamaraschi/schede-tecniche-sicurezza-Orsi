import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Alert, Spinner, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from 'react-icons/fa';
import { FaUser, FaLock, FaSignInAlt, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';
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
  
  // Check for query parameters like session expiration
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const sessionExpired = searchParams.get('sessionExpired');
    
    if (sessionExpired === 'true') {
      setError('La tua sessione è scaduta. Effettua nuovamente il login.');
    }
    
    // Check if the user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/home');
    }
    
    // Load saved username if remember me was used
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, [location, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
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
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        localStorage.setItem('authToken', data.token);
        
        // Redirect to home after successful login
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
    <Container fluid className="login-page-container">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={8} lg={6} xl={5}>
          {/* Brand Header */}
          <div className="text-center mb-4">
            <h1 className="brand-title">Catalogo <span>Prodotti</span></h1>
            <p className="brand-subtitle">Sistema di gestione catalogo e schede prodotti</p>
          </div>
          
          <Card className="login-card shadow">
            <Card.Body className="p-4 p-md-5">
              {/* Login Header */}
              <div className="text-center mb-4">
                <div className="login-icon-container">
                  <FaUser size={24} className="login-icon" />
                </div>
                <h2 className="login-title">Accesso Admin</h2>
                <p className="login-subtitle">Accedi per gestire i prodotti del catalogo</p>
              </div>
              
              {/* Error Message */}
              {error && (
                <Alert variant="danger" className="d-flex align-items-center mb-4">
                  <FaExclamationCircle className="me-2" />
                  <span>{error}</span>
                </Alert>
              )}
              
              {/* Session expiration info box */}
              {location.search.includes('sessionExpired') && (
                <Alert variant="info" className="d-flex align-items-center mb-4">
                  <FaInfoCircle className="me-2" />
                  <span>Sessione scaduta per inattività. Effettua nuovamente il login.</span>
                </Alert>
              )}
              
              {/* Login Form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="username">
                  <Form.Label className="d-flex align-items-center">
                    <FaUser className="me-2 text-primary" />
                    <span>Username</span>
                  </Form.Label>
                  <Form.Control 
                    type="text"
                    placeholder="Inserisci il tuo username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    className="form-control-lg"
                    autoComplete="username"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label className="d-flex align-items-center">
                    <FaLock className="me-2 text-primary" />
                    <span>Password</span>
                  </Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Inserisci la tua password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="form-control-lg"
                      autoComplete="current-password"
                    />
                    <Button 
                      variant="link" 
                      className="password-toggle-btn"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? "Nascondi" : "Mostra"}
                    </Button>
                  </div>
                </Form.Group>
                
                <Form.Group className="mb-4 d-flex justify-content-between align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="remember-me"
                    label="Ricordami"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  
                  <Button variant="link" className="p-0 text-decoration-none">
                    Password dimenticata?
                  </Button>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="w-100 py-3 d-flex justify-content-center align-items-center"
                >
                  {loading ? (
                    <>
                      <Spinner 
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      <span>Accesso in corso...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="me-2" />
                      <span>Accedi</span>
                    </>
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4">
                <p className="login-footer-text">
                  &copy; {new Date().getFullYear()} Catalogo Prodotti. Tutti i diritti riservati.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;