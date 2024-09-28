import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Logo</Link>
        <button className="hamburger" onClick={toggleMenu}>
          &#9776; {/* Icona hamburger */}
        </button>
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/login" className="navbar-item">Login</Link>
          <Link to="/product-info" className="navbar-item">Info Prodotto</Link>
          <Link to="/create-product" className="navbar-item">Crea Prodotto</Link>
          <Link to="/view-documents" className="navbar-item">Visualizza Documenti</Link>
          <Link to="/upload-document" className="navbar-item">Carica Documento</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
