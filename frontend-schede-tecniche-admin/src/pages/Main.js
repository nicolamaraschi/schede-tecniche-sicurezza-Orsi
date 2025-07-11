import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchDocuments } from '../api';
import './Main.css';
// Import Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxes, 
  faFilePdf, 
  faPlusCircle, 
  faUpload, 
  faSearch, 
  faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';

const Main = () => {
  const [productsCount, setProductsCount] = useState(0);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch products count
      const products = await fetchProducts(token);
      setProductsCount(products.length);
      
      // Fetch documents and count
      const documents = await fetchDocuments(token);
      setDocumentsCount(documents.length);
      
      // Get the 5 most recent documents
      const sortedDocuments = [...documents].sort((a, b) => {
        // Ordina per ID documento, presumendo che ID più recenti siano più grandi
        return b.idDocument?.localeCompare(a.idDocument);
      }).slice(0, 5);
      
      setRecentDocuments(sortedDocuments);
      setError('');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Impossibile caricare i dati. Verifica la tua connessione e riprova.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="main-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Sistema di Gestione Schede Tecniche e di Sicurezza</h1>
          <p>Gestisci, organizza e condividi facilmente le schede tecniche e di sicurezza dei tuoi prodotti</p>
        </div>
      </section>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Caricamento in corso...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="retry-button">
            Riprova
          </button>
        </div>
      ) : (
        <>
          <section className="stats-section">
            <div className="stat-card">
              <div className="stat-icon products-icon">
                <FontAwesomeIcon icon={faBoxes} />
              </div>
              <div className="stat-content">
                <h2>{productsCount}</h2>
                <p>Prodotti Totali</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon documents-icon">
                <FontAwesomeIcon icon={faFilePdf} />
              </div>
              <div className="stat-content">
                <h2>{documentsCount}</h2>
                <p>Schede Gestite</p>
              </div>
            </div>
          </section>

          <section className="features-section">
            <h2>Funzionalità Principali</h2>
            <div className="features-grid">
              <Link to="/create-product" className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faPlusCircle} />
                </div>
                <h3>Crea Prodotto</h3>
                <p>Aggiungi nuovi prodotti e assegna loro un codice identificativo univoco</p>
              </Link>
              <Link to="/upload-document" className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faUpload} />
                </div>
                <h3>Carica Schede</h3>
                <p>Carica e associa schede tecniche e di sicurezza ai prodotti esistenti</p>
              </Link>
              <Link to="/view-documents" className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <h3>Visualizza Schede</h3>
                <p>Cerca e visualizza tutte le schede archiviate per prodotto o codice scheda</p>
              </Link>
              <Link to="/product-info" className="feature-card">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <h3>Gestione Prodotti</h3>
                <p>Visualizza, modifica o elimina i prodotti presenti nel sistema</p>
              </Link>
            </div>
          </section>

          <section className="recent-documents-section">
            <h2>Schede Recenti</h2>
            {recentDocuments.length > 0 ? (
              <div className="documents-table-container">
                <table className="documents-table">
                  <thead>
                    <tr>
                      <th>Prodotto</th>
                      <th>Codice Prodotto</th>
                      <th>Tipo Scheda</th>
                      <th>Codice Scheda</th>
                      <th>Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocuments.map((doc) => (
                      <tr key={doc.idDocument}>
                        <td>{doc.productName}</td>
                        <td>{doc.productCode}</td>
                        <td>{doc.documentType}</td>
                        <td>{doc.documentCode}</td>
                        <td>
                          <a 
                            href={`https://orsi-production.up.railway.app/api/${doc.fileUrl}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="view-button"
                          >
                            Visualizza
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-documents">Nessuna scheda disponibile. Inizia caricando una scheda tecnica o di sicurezza.</p>
            )}
            <div className="view-all-container">
              <Link to="/view-documents" className="view-all-button">
                Visualizza tutte le schede
              </Link>
            </div>
          </section>

          <section className="help-section">
            <h2>Guida Rapida</h2>
            <div className="help-cards">
              <div className="help-card">
                <h3>1. Crea un Prodotto</h3>
                <p>Inizia creando un prodotto e assegnandogli un codice univoco.</p>
              </div>
              <div className="help-card">
                <h3>2. Carica una Scheda</h3>
                <p>Carica una scheda tecnica o di sicurezza (PDF) e associala a un prodotto.</p>
              </div>
              <div className="help-card">
                <h3>3. Gestisci le Schede</h3>
                <p>Visualizza, cerca, condividi o elimina le schede in base alle tue necessità.</p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Main;