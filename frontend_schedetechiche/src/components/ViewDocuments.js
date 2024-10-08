import React, { useEffect, useState, useCallback } from 'react';
import { fetchDocuments, fetchDocumentByCode, deleteDocument } from '../api';
import './ViewDocuments.css';

const ViewDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentsByDocumentCode, setDocumentsByDocumentCode] = useState([]);
  const [selectedDocumentCode, setSelectedDocumentCode] = useState('');
  const token = localStorage.getItem('token');

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
      setError(error.message.includes('404') ? 'Codice prodotto non trovato.' : '');
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
     setError(error.message.includes('404') ? 'Codice scheda non trovato.' : '');
      console.error('Error fetching document by code:', error);
    } finally {
      setLoading(false);
    }
  }, [token, selectedDocumentCode]);
  

  // Effettua la ricerca documenti quando cambia il codice prodotto
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    loadDocuments();
  }, 1000); // Ritardo di 1000 millisecondi

  return () => clearTimeout(delayDebounceFn); // Cancella il timeout se cambia il codice prodotto prima che termini
}, [loadDocuments]);

// Effettua la ricerca del documento per codice scheda quando il codice cambia
useEffect(() => {
  const delayDebounceFn = setTimeout(() => {
    loadDocumentByCode();
  }, 1000); // Ritardo di 1000 millisecondi

  return () => clearTimeout(delayDebounceFn); // Cancella il timeout se cambia il codice scheda prima che termini
}, [loadDocumentByCode, selectedDocumentCode]);



  const handleDelete = async (document) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo documento?');
    if (!confirmDelete) return;

    try {
      await deleteDocument(token, document.idDocument);
      setDocuments(documents.filter(doc => doc.idDocument !== document.idDocument));
      alert('Documento eliminato con successo!');
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Errore nell\'eliminazione del documento.');
    }
  };

  return (
    <div className="view-documents-card">
      <h2>Visualizza Schede Tecniche e di Sicurezza</h2>

      {/* Prima card: ricerca per codice prodotto */}
      <input
        className="view-documents-input"
        type="text"
        placeholder="Codice Prodotto"
        value={selectedProductCode}
        onChange={(e) => setSelectedProductCode(e.target.value)}
      />
      {loading && <p>Caricamento documenti...</p>}
      {error && <p className="view-documents-error-message">{error}</p>}
      <ul className="view-documents-list">
        {documents.length > 0 ? (
          documents.map(doc => (
            <li key={doc.idDocument}>
              <div>
                <strong>Tipo di Scheda:</strong> {doc.documentType} <br />
                <strong>Prodotto:</strong> {doc.productName} <br />
                <strong>Codice Prodotto:</strong> {doc.productCode} <br />
                <strong>Codice Scheda:</strong> {doc.documentCode} <br />
                <a href={`http://localhost:5002/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                  {doc.fileUrl}
                </a>
                <button className="delete-button" onClick={() => handleDelete(doc)}>Elimina</button>
              </div>
            </li>
          ))
        ) : (
          <li>Nessuna scheda trovata.</li>
        )}
      </ul>

      {/* Seconda card: ricerca per codice scheda */}
      <div className="search-document-card">
        <h3>Ricerca per Codice Scheda</h3>
        <input
          className="view-documents-input"
          type="text"
          placeholder="Codice Scheda"
          value={selectedDocumentCode}
          onChange={(e) => setSelectedDocumentCode(e.target.value)}
        />
        {loading && <p>Caricamento documento...</p>}
        {error && <p className="view-documents-error-message">{error}</p>}
        <ul className="view-documents-list">
          {documentsByDocumentCode.length > 0 ? (
            documentsByDocumentCode.map(doc => (
              <li key={doc.idDocument}>
                <div>
                  <strong>Tipo di Scheda:</strong> {doc.documentType} <br />
                  <strong>Prodotto:</strong> {doc.productName} <br />
                  <strong>Codice Prodotto:</strong> {doc.productCode} <br />
                  <strong>Codice Scheda:</strong> {doc.documentCode} <br />
                  <a href={`http://localhost:5002/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                    {doc.fileUrl}
                  </a>
                  <button className="delete-button" onClick={() => handleDelete(doc)}>Elimina</button>
                </div>
              </li>
            ))
          ) : (
            <li>Nessuna scheda trovata.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ViewDocuments;
