import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Pagina non trovata</h2>
          <p>La pagina che stai cercando non esiste o è stata spostata.</p>
          <Link to="/" className="home-button">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
