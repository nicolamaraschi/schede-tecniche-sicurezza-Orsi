import React, { useEffect, useState } from 'react';
import './Main.css';

const Main = () => {
  const [documents, setDocuments] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchDocuments(); // Fetch iniziale per ottenere tutti i documenti
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/products'); // Endpoint testato
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/documents'); // Fetch per ottenere tutti i documenti
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async (type) => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('productId', selectedProductId);
    formData.append('type', type);

    await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    fetchDocuments(); // Ricarica i documenti
  };

  const handleDelete = async (id) => {
    await fetch(`/api/documents/${id}`, {
      method: 'DELETE',
    });
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main-container">
      <h1>Benvenuti nella Pagina Principale</h1>

      <div className="card max-width">
        <h2>Carica Schede Tecniche e di Sicurezza</h2>
        <select onChange={(e) => setSelectedProductId(e.target.value)} value={selectedProductId}>
          <option value="">Seleziona un Prodotto</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <div className="upload-section">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button onClick={() => handleUpload('Scheda Tecnica')}>Carica Scheda Tecnica</button>
        </div>
        <div className="upload-section">
          <input type="file" accept=".pdf" onChange={handleFileChange} />
          <button onClick={() => handleUpload('Scheda di Sicurezza')}>Carica Scheda di Sicurezza</button>
        </div>
      </div>

      <div className="card max-width">
        <h2>Visualizza Schede Tecniche e di Sicurezza</h2>
        <input
          type="text"
          placeholder="Cerca schede..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredDocuments.map(doc => (
            <li key={doc.id}>
              {doc.title}
              <button onClick={() => handleDelete(doc.id)}>Elimina</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card max-width">
        <h2>Elimina Schede</h2>
        <ul>
          {documents.map(doc => (
            <li key={doc.id}>
              {doc.title}
              <button onClick={() => handleDelete(doc.id)}>Elimina</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Main;
