import React, { useEffect, useState, useCallback } from 'react';
import { fetchDocuments, fetchDocumentByCode, deleteDocument } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFileAlt, 
  faTrashAlt, 
  faEye,
  faExclamationTriangle,
  faSpinner,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './ViewDocuments.css';

const ViewDocuments = () => {
  // ========== STATO ORIGINALE PRESERVATO ==========
  const [documents, setDocuments] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentsByDocumentCode, setDocumentsByDocumentCode] = useState([]);
  const [selectedDocumentCode, setSelectedDocumentCode] = useState('');
  const token = localStorage.getItem('token');

  // ========== FUNZIONI ORIGINALI PRESERVATE ==========
  // Carica i documenti: Se non viene fornito alcun codice prodotto, carica tutte le schede
  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      if (selectedProductCode === '') {
        // Se non c'è codice prodotto, recupera tutte le schede
        const data = await fetchDocuments(token);
        setDocuments(data);
      } else {
        // Se è presente un codice prodotto, cerca quel codice
        const data = await fetchDocuments(token, selectedProductCode);
        if (data.length === 0) {
          setError('Nessun documento trovato per il codice prodotto fornito.');
          setDocuments([]);
        } else {
          setDocuments(data);
        }
      }
    } catch (error) {
      setError(error.message.includes('404') ? 'Codice prodotto non trovato.' : error.message);
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [token, selectedProductCode]);

  // Carica il documento in base al codice scheda
  const loadDocumentByCode = useCallback(async () => {
    if (!selectedDocumentCode) {
      setDocumentsByDocumentCode([]); // Non mostrare nulla se non c'è codice scheda
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchDocumentByCode(token, selectedDocumentCode);
      setDocumentsByDocumentCode([data]); // Mostra solo il documento trovato
    } catch (error) {
      setError(error.message.includes('404') ? 'Codice scheda non trovato.' : error.message);
      console.error('Error fetching document by code:', error);
      setDocumentsByDocumentCode([]);
    } finally {
      setLoading(false);
    }
  }, [token, selectedDocumentCode]);

  // Effettua la ricerca documenti quando cambia il codice prodotto
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadDocuments();
    }, 1000); // Ritardo di 1000 millisecondi

    return () => clearTimeout(delayDebounceFn); // Cancella il timeout se cambia il codice
  }, [loadDocuments]);

  // Effettua la ricerca del documento per codice scheda quando il codice cambia
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadDocumentByCode();
    }, 1000); // Ritardo di 1000 millisecondi

    return () => clearTimeout(delayDebounceFn); // Cancella il timeout se cambia il codice
  }, [loadDocumentByCode]);

  // ========== FUNZIONE DI ELIMINAZIONE CORRETTA ==========
  const handleDelete = async (documentId) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo documento?')) return;

    try {
      console.log('Attempting to delete document with ID:', documentId);
      
      await deleteDocument(token, documentId);
      
      // Aggiorna le liste dopo l'eliminazione
      if (selectedDocumentCode) {
        // Se stiamo visualizzando un documento specifico per codice
        setDocumentsByDocumentCode([]);
        setSelectedDocumentCode('');
      } else {
        // Se stiamo visualizzando documenti per codice prodotto o tutti i documenti
        setDocuments(docs => docs.filter(doc => doc.idDocument !== documentId));
      }
      
      alert('Documento eliminato con successo!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Errore nell\'eliminazione del documento. ' + (error.message || ''));
    }
  };

  // ========== NUOVA FUNZIONE PER DETERMINARE QUALI DOCUMENTI MOSTRARE ==========
  const getDocumentsToDisplay = () => {
    if (selectedDocumentCode && documentsByDocumentCode.length > 0) {
      return documentsByDocumentCode;
    }
    return documents;
  };

  return (
    <div className="view-documents-container">
      <div className="view-documents-card">
        <div className="card-header">
          <h2>Visualizza Schede Tecniche e di Sicurezza</h2>
          <p>Cerca e gestisci le schede dei prodotti</p>
        </div>
        
        <div className="search-tabs">
          <div className="tab">
            <h3>Cerca per Codice Prodotto</h3>
            <div className="search-input-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Inserisci codice prodotto"
                value={selectedProductCode}
                onChange={(e) => {
                  setSelectedProductCode(e.target.value);
                  setSelectedDocumentCode(''); // Reset dell'altra ricerca
                  setDocumentsByDocumentCode([]);
                }}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="tab">
            <h3>Cerca per Codice Scheda</h3>
            <div className="search-input-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Inserisci codice scheda"
                value={selectedDocumentCode}
                onChange={(e) => {
                  setSelectedDocumentCode(e.target.value);
                  setSelectedProductCode(''); // Reset dell'altra ricerca
                  setDocuments([]);
                }}
                className="search-input"
              />
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="spinner-icon" />
            <p>Caricamento in corso...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        ) : (
          <div className="documents-container">
            {getDocumentsToDisplay().length > 0 ? (
              <>
                <div className="documents-count">
                  <FontAwesomeIcon icon={faFileAlt} />
                  <span>{getDocumentsToDisplay().length} documenti trovati</span>
                </div>
                
                <div className="documents-list">
                  {getDocumentsToDisplay().map((doc) => (
                    <div key={doc.idDocument} className="document-card">
                      <div className="document-header">
                        <span className={`document-type ${doc.documentType === 'Scheda Tecnica' ? 'technical' : 'safety'}`}>
                          {doc.documentType}
                        </span>
                      </div>
                      
                      <div className="document-content">
                        <h3 className="document-product">{doc.productName}</h3>
                        <div className="document-info">
                          <p><strong>Codice Prodotto:</strong> {doc.productCode}</p>
                          <p><strong>Codice Scheda:</strong> {doc.documentCode}</p>
                        </div>
                      </div>
                      
                      <div className="document-actions">
                        <a
                          href={`http://localhost:5002/${doc.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-button"
                        >
                          <FontAwesomeIcon icon={faEye} />
                          <span>Visualizza</span>
                        </a>
                        
                        <button
                          onClick={() => handleDelete(doc.idDocument)}
                          className="delete-button"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                          <span>Elimina</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-documents">
                <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                <p>
                  {selectedProductCode 
                    ? "Nessun documento trovato per questo codice prodotto." 
                    : selectedDocumentCode 
                      ? "Nessun documento trovato per questo codice scheda." 
                      : "Inserisci un codice prodotto o codice scheda per cercare i documenti."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDocuments;