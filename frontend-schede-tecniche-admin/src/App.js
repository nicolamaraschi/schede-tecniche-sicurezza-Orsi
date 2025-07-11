import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main'; // Utilizziamo Main come Home page
import Login from './pages/login';
import CreateProduct from './components/CreateProduct';
import UploadDocument from './components/UploadDocument';
import ViewDocuments from './components/ViewDocuments';
import ProductInfo from './components/ProductInfo';
import './App.css';

// Componente per le rotte protette
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Reindirizza alla pagina di login se non c'è token
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Componente per verificare la scadenza del token
const TokenVerifier = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    };
    
    // Controlla subito
    checkTokenExpiration();
    
    // Controlla periodicamente
    const intervalId = setInterval(checkTokenExpiration, 60000); // ogni minuto
    
    return () => clearInterval(intervalId);
  }, [navigate]);
  
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Controlla se esiste un token al caricamento dell'app
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <TokenVerifier>
        <div className="App">
          <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
          <Routes>
            {/* Pagina di login accessibile a tutti */}
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            
            {/* Main page come Home (protetta) */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                  <ProtectedRoute><Main /></ProtectedRoute> : 
                  <Navigate to="/login" replace />
              } 
            />
            
            {/* Rotte protette che richiedono autenticazione */}
            <Route 
              path="/create-product" 
              element={<ProtectedRoute><CreateProduct /></ProtectedRoute>} 
            />
            <Route 
              path="/upload-document" 
              element={<ProtectedRoute><UploadDocument /></ProtectedRoute>} 
            />
            <Route 
              path="/view-documents" 
              element={<ProtectedRoute><ViewDocuments /></ProtectedRoute>} 
            />
            <Route 
              path="/product-info" 
              element={<ProtectedRoute><ProductInfo /></ProtectedRoute>} 
            />
            
            {/* Redirect alla pagina di login per qualsiasi altra rotta */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </TokenVerifier>
    </Router>
  );
}

export default App;