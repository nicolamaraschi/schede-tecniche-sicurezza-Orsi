import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage(); // Ottieni la funzione di traduzione

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <button className="menu-toggle" onClick={onMenuClick} aria-label={t('toggle_menu')}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="Orsi Logo" className="header-logo" />
            </Link>
          </div>
          
          <nav className="site-nav hide-on-mobile">
            <ul>
              <li>
                <Link to="/" className={location.pathname === "/" ? "active" : ""}>
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className={location.pathname.includes("/catalogo") ? "active" : ""}>
                  {t('catalog')}
                </Link>
              </li>
              <li>
                <Link to="/contatti" className={location.pathname === "/contatti" ? "active" : ""}>
                  {t('contacts')}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="language-selector">
            <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
              <option value="it">IT</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="de">DE</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;