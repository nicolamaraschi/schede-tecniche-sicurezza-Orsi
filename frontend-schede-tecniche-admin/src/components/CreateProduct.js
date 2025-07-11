import React, { useState } from 'react';
import { createProduct } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faBox, faTag } from '@fortawesome/free-solid-svg-icons';
import './CreateProduct.css';

const CreateProduct = () => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const validateForm = () => {
    if (!newProductName.trim()) {
      setError('Il nome del prodotto è obbligatorio');
      return false;
    }
    if (!newProductCode.trim()) {
      setError('Il codice del prodotto è obbligatorio');
      return false;
    }
    return true;
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      await createProduct(token, newProductName, newProductCode);
      
      setNewProductName('');
      setNewProductCode('');
      setSuccess(true);
      setShowSuccessMessage(true);
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Errore nella creazione del prodotto.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setNewProductName('');
    setNewProductCode('');
    setError('');
  };

  return (
    <div className="create-product-container">
      <div className="create-product-card">
        <div className="card-header">
          <h2>Crea Nuovo Prodotto</h2>
          <p>Inserisci i dettagli per aggiungere un nuovo prodotto al sistema</p>
        </div>
        
        <form onSubmit={handleCreateProduct} className="product-form">
          <div className="form-group">
            <label htmlFor="productName">
              <FontAwesomeIcon icon={faBox} className="input-icon" />
              Nome Prodotto
            </label>
            <input 
              type="text" 
              id="productName"
              placeholder="Inserisci il nome del prodotto" 
              value={newProductName} 
              onChange={(e) => setNewProductName(e.target.value)} 
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="productCode">
              <FontAwesomeIcon icon={faTag} className="input-icon" />
              Codice Prodotto
            </label>
            <input 
              type="text" 
              id="productCode"
              placeholder="Inserisci il codice univoco" 
              value={newProductCode} 
              onChange={(e) => setNewProductCode(e.target.value)} 
              disabled={loading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {showSuccessMessage && (
            <div className="success-message">
              Prodotto creato con successo!
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="reset-button" 
              onClick={handleReset}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTimes} /> Annulla
            </button>
            
            <button 
              type="submit" 
              className="submit-button" 
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <><FontAwesomeIcon icon={faSave} /> Salva Prodotto</>
              )}
            </button>
          </div>
        </form>
        
        {success && (
          <div className="recently-added">
            <h3>Prodotti Creati Recentemente</h3>
            <ul>
              <li>
                <div className="product-info">
                  <span className="product-name">{newProductName}</span>
                  <span className="product-code">{newProductCode}</span>
                </div>
                <span className="label-new">Nuovo</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;