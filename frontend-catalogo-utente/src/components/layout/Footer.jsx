import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>EG Store</h3>
            <p>
              Offriamo prodotti di alta qualità per l'igiene e la pulizia, 
              con un'attenzione particolare alla sostenibilità e all'efficacia.
            </p>
            <div className="contact">
              <p><i className="icon-phone"></i> +39 123 456 7890</p>
              <p><i className="icon-envelope"></i> info@egstore.it</p>
              <p><i className="icon-map-marker"></i> Via Roma 123, Milano</p>
            </div>
          </div>

          <div className="footer-section links">
            <h3>Link Utili</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/catalogo">Catalogo Prodotti</Link></li>
              <li><Link to="/contatti">Contatti</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section newsletter">
            <h3>Newsletter</h3>
            <p>Iscriviti per ricevere aggiornamenti sui nostri prodotti</p>
            <form className="newsletter-form">
              <input type="email" placeholder="La tua email" required />
              <button type="submit" className="btn-primary">Iscriviti</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} EG Store. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
