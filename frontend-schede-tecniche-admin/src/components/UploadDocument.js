import React, { useState, useEffect, useRef } from 'react';
import { fetchProducts, uploadDocument } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faFileAlt, 
  faBox, 
  faTag, 
  faFileUpload, 
  faSpinner, 
  faCheckCircle,
  faExclamationCircle 
} from '@fortawesome/free-solid-svg-icons';
import './UploadDocument.css';

const UploadDocument = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductName, setSelectedProductName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadType, setUploadType] = useState('Scheda Tecnica');
  const [documentCode, setDocumentCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');

  const fileInputRef = useRef(null);
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const data = await fetchProducts(token);
        setProducts(data);
        setProductError('');
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductError('Impossibile caricare la lista dei prodotti. Riprova più tardi.');
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, [token]);

  const validateForm = () => {
    if (!selectedProductName) {
      setError('Seleziona un prodotto dalla lista');
      return false;
    }
    
    if (!selectedFile) {
      setError('Seleziona un file da caricare');
      return false;
    }
    
    if (!documentCode) {
      setError('Inserisci un codice per la scheda');
      return false;
    }
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Il file deve essere in formato PDF');
      return false;
    }
    
    return true;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      await uploadDocument(token, selectedFile, selectedProductName, uploadType, documentCode);
      
      // Reset form after successful upload
      setSelectedFile(null);
      setUploadType('Scheda Tecnica');
      setSelectedProductName('');
      setDocumentCode('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error uploading document:', error);
      setError(error.message || 'Errore nel caricamento del documento.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-document-container">
      <div className="upload-document-card">
        <div className="card-header">
          <h2>Carica Schede Tecniche e di Sicurezza</h2>
          <p>Carica e associa schede ai prodotti esistenti</p>
        </div>
        
        {loadingProducts ? (
          <div className="loading-products">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Caricamento prodotti...</p>
          </div>
        ) : productError ? (
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            <p>{productError}</p>
          </div>
        ) : (
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label htmlFor="product">
                <FontAwesomeIcon icon={faBox} className="input-icon" />
                Prodotto
              </label>
              <select 
                id="product"
                className="select-product" 
                onChange={(e) => setSelectedProductName(e.target.value)} 
                value={selectedProductName}
                disabled={loading}
              >
                <option value="">Seleziona un Prodotto</option>
                {products.map(product => (
                  <option key={product._id || product.id} value={product.name}>
                    {product.name} ({product.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="documentType">
                <FontAwesomeIcon icon={faFileAlt} className="input-icon" />
                Tipo di Scheda
              </label>
              <select 
                id="documentType"
                className="select-type" 
                onChange={(e) => setUploadType(e.target.value)} 
                value={uploadType}
                disabled={loading}
              >
                <option value="Scheda Tecnica">Scheda Tecnica</option>
                <option value="Scheda di Sicurezza">Scheda di Sicurezza</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="documentCode">
                <FontAwesomeIcon icon={faTag} className="input-icon" />
                Codice Scheda
              </label>
              <input 
                type="text" 
                id="documentCode"
                placeholder="Inserisci un codice per la scheda" 
                value={documentCode} 
                onChange={(e) => setDocumentCode(e.target.value)} 
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faFileUpload} className="input-icon" />
                File PDF
              </label>
              <div 
                className={`file-upload-wrapper ${selectedFile ? 'has-file' : ''}`}
                onClick={handleTriggerFileInput}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  disabled={loading}
                  className="file-input"
                />
                <div className="file-upload-content">
                  {selectedFile ? (
                    <>
                      <FontAwesomeIcon icon={faFileAlt} className="file-icon" />
                      <span className="file-name">{selectedFile.name}</span>
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                      <span>Clicca per selezionare un file PDF</span>
                    </>
                  )}
                </div>
              </div>
              <div className="file-help">Solo file PDF. Dimensione massima: 5MB</div>
            </div>
            
            {error && (
              <div className="error-message">
                <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="success-message">
                <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
                <span>Documento caricato con successo!</span>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="upload-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Caricamento in corso...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} />
                    Carica Scheda
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;