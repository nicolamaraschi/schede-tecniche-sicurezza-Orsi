// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold">Benvenuto nel Catalogo Prodotti</h1>
            <p className="lead">
              Gestisci facilmente il tuo catalogo con questo strumento semplice e intuitivo.
            </p>
          </div>

          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-plus-circle text-primary" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">Aggiungi Prodotti</h3>
                  <p>Inserisci nuovi prodotti nel catalogo con tutti i dettagli necessari.</p>
                  <Link to="/add-product" className="btn btn-primary mt-2">
                    Aggiungi Prodotto
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-list-ul text-success" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">Visualizza Prodotti</h3>
                  <p>Visualizza tutti i prodotti presenti nel catalogo.</p>
                  <Link to="/view-products" className="btn btn-success mt-2">
                    Visualizza Catalogo
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body text-center">
                  <i className="bi bi-pencil-square text-warning" style={{ fontSize: '3rem' }}></i>
                  <h3 className="mt-3">Modifica Prodotti</h3>
                  <p>Aggiorna le informazioni dei prodotti già esistenti.</p>
                  <Link to="/edit-product" className="btn btn-warning mt-2">
                    Modifica Prodotti
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 bg-light rounded text-center">
            <h2>Inizia Subito</h2>
            <p>Esplora le funzionalità e gestisci il tuo catalogo prodotti in modo semplice ed efficiente.</p>
            <Link to="/view-products" className="btn btn-primary btn-lg">
              Vai al Catalogo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;