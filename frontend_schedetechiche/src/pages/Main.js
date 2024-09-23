import React, { useEffect, useState, useCallback } from 'react';
import './Main.css';
import { fetchProducts, fetchDocuments, uploadDocument, deleteDocument, createProduct } from '../api';

const Main = () => {
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState(''); // Cambiato da selectedProductCode a selectedProductName
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('Scheda Tecnica');
  const [newProductName, setNewProductName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [loading, setLoading] = useState(false); // Stato di caricamento

  const token = localStorage.getItem('token');

  const loadDocuments = useCallback(async () => {
    if (!selectedProductName) return; // Non caricare documenti se non c'è un prodotto selezionato
    try {
      const data = await fetchDocuments(token, selectedProductName);
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, [token, selectedProductName]);

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts(token);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [token]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments, selectedProductName]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProductName) {
      console.error('File or product name is missing.');
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      console.error('Please upload a valid PDF file.');
      return;
    }

    setLoading(true);
    try {
      await uploadDocument(token, selectedFile, selectedProductName, uploadType); // Invia nome prodotto
      await loadDocuments(); // Ricarica i documenti
      setSelectedFile(null);
      setUploadType('Scheda Tecnica');
      setSelectedProductName(''); // Reset del nome prodotto dopo il caricamento
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(token, documentId);
      setDocuments(documents.filter(doc => doc._id !== documentId));
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductName || !newProductCode) return;

    try {
      const createdProduct = await createProduct(token, newProductName, newProductCode);
      setProducts(prevProducts => [...prevProducts, createdProduct]);
      setNewProductName('');
      setNewProductCode('');
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="main-container">
      <h1>Benvenuti nella Pagina Principale</h1>

      <div className="card">
        <h2>Crea Nuovo Prodotto</h2>
        <input 
          type="text" 
          placeholder="Nome Prodotto" 
          value={newProductName} 
          onChange={(e) => setNewProductName(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Codice Prodotto" 
          value={newProductCode} 
          onChange={(e) => setNewProductCode(e.target.value)} 
        />
        <button onClick={handleCreateProduct}>Crea Prodotto</button>
      </div>

      <div className="card">
        <h2>Carica Schede Tecniche e di Sicurezza</h2>
        <select onChange={(e) => setSelectedProductName(e.target.value)} value={selectedProductName}>
          <option value="">Seleziona un Prodotto</option>
          {products.map(product => (
            <option key={product.id} value={product.name}>{product.name}</option> // Usa product.name
          ))}
        </select>

        <select onChange={(e) => setUploadType(e.target.value)} value={uploadType}>
          <option value="Scheda Tecnica">Scheda Tecnica</option>
          <option value="Scheda di Sicurezza">Scheda di Sicurezza</option>
        </select>
        <div className="upload-section">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? 'Caricamento...' : 'Carica Scheda'}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Visualizza Schede Tecniche e di Sicurezza</h2>
        <input
          type="text"
          placeholder="Nome Prodotto"
          value={selectedProductName}
          onChange={(e) => setSelectedProductName(e.target.value)}
        />
        <ul>
          {documents.length > 0 ? (
            documents.map(doc => (
              <li key={doc._id}>
                <div>
                  <strong>Tipo di Scheda:</strong> {doc.type} <br />
                  <strong>Prodotto:</strong> {doc.productName} <br />
                  <strong>Codice Prodotto:</strong> {doc.productCode} <br />
                  <a href={`http://localhost:5002/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                    {doc.fileUrl}
                  </a>
                  <button className="delete-button" onClick={() => handleDelete(doc._id)}>Elimina</button>
                </div>
              </li>
            ))
          ) : (
            <li>Nessuna scheda trovata.</li>
          )}
        </ul>
      </div>

      <div className="card">
        <h2>Info Codice Prodotto</h2>
        <ul>
          {products.length > 0 ? (
            products.map(product => (
              <li key={product.code}>
                {product.name} - {product.code}
              </li>
            ))
          ) : (
            <li>Nessun prodotto trovato.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Main;
