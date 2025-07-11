// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();

  // Funzione per gestire il logout
  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">🔧 Gestione Prodotti</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {isAuthenticated ? (
            // Menu di navigazione per utenti autenticati
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">🏠 Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">📋 Lista Prodotti e 🗑️ Eliminazione</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products/create">➕ Crea Prodotto</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/products/edit">✏️ Modifica Prodotto</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories">📂 Lista Categorie</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories/create">🆕 Crea Categoria</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/categories/edit">🖊️ Modifica Categoria</Link>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <span className="nav-link">👤 {username}</span>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link" onClick={handleLogout}>🚪 Logout</a>
                </li>
              </ul>
            </>
          ) : (
            // Menu di navigazione per utenti non autenticati
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">🔑 Login</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;