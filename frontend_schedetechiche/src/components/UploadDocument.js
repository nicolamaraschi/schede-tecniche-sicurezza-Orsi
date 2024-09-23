import React, { useState, useEffect } from 'react';
import { fetchProducts, uploadDocument } from '../api';
import './UploadDocument.css'; // Importa il CSS personalizzato

const UploadDocument = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('Scheda Tecnica');
  const [documentCode, setDocumentCode] = useState(''); // Stato per il codice documento
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(token);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    loadProducts();
  }, [token]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProductName || !documentCode) {
      alert('File, nome prodotto o codice documento mancante.');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      alert('Si prega di caricare un file PDF valido.');
      return;
    }

    setLoading(true);
    try {
      await uploadDocument(token, selectedFile, selectedProductName, uploadType, documentCode); // Aggiungi il codice documento
      alert('Documento caricato con successo!');
      setSelectedFile(null);
      setUploadType('Scheda Tecnica');
      setSelectedProductName('');
      setDocumentCode(''); // Resetta il codice documento
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Errore nel caricamento del documento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-document-card">
      <h2>Carica Schede Tecniche e di Sicurezza</h2>
      <select className="upload-document-select" onChange={(e) => setSelectedProductName(e.target.value)} value={selectedProductName}>
        <option value="">Seleziona un Prodotto</option>
        {products.map(product => (
          <option key={product.id} value={product.name}>{product.name}</option>
        ))}
      </select>

      <select className="upload-document-select" onChange={(e) => setUploadType(e.target.value)} value={uploadType}>
        <option value="Scheda Tecnica">Scheda Tecnica</option>
        <option value="Scheda di Sicurezza">Scheda di Sicurezza</option>
      </select>

      <input 
        type="text" 
        placeholder="Inserisci il codice documento" 
        value={documentCode} 
        onChange={(e) => setDocumentCode(e.target.value)} 
        className="upload-document-input" // Aggiungi una classe per il CSS
      />

      <div className="upload-document-upload-section">
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Caricamento...' : 'Carica Scheda'}
        </button>
      </div>
    </div>
  );
};

export default UploadDocument;
