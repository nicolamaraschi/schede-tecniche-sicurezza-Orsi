import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faBox, 
  faFileUpload, 
  faSearch, 
  faInfo, 
  faSignOutAlt,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Gestisce lo stato del menu mobile
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Chiude il menu mobile quando si cambia pagina
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Aggiunge effetto di scroll alla navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Gestisce il logout
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Determina se il link è attivo
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-highlight">Tech</span>Sheets
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>
        
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/" 
                className={`nav-item ${isActive('/') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/product-info" 
                className={`nav-item ${isActive('/product-info') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faInfo} className="nav-icon" />
                <span>Info Prodotti</span>
              </Link>
              
              <Link 
                to="/create-product" 
                className={`nav-item ${isActive('/create-product') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faBox} className="nav-icon" />
                <span>Crea Prodotto</span>
              </Link>
              
              <Link 
                to="/view-documents" 
                className={`nav-item ${isActive('/view-documents') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faSearch} className="nav-icon" />
                <span>Schede</span>
              </Link>
              
              <Link 
                to="/upload-document" 
                className={`nav-item ${isActive('/upload-document') ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={faFileUpload} className="nav-icon" />
                <span>Carica Scheda</span>
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="logout-button"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item">
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;