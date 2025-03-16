// src/pages/AddProduct.js
import React, { useState } from 'react';
import { createProdotto } from '../api';

const AddProduct = () => {
  // Stato per il form
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    prezzo: '',
    unita: '',
    categoria: '',
    descrizione: ''
  });
  
  // Stato per le immagini
  const [immagini, setImmagini] = useState([]);
  
  // Stati per il feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Opzioni per i dropdown
  const tipiProdotto = [
    'BULK',
    'BARATTOLO',
    'SECCHIO',
    'ASTUCCIO VUOTO',
    'ASTUCCIO PERSONALIZZATO',
    'MONODOSE CARTA'
  ];
  
  const unitaMisura = ['KG', 'PZ'];
  
  // Gestione input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Gestione selezione immagini
  const handleImageChange = (e) => {
    setImmagini(Array.from(e.target.files));
  };
  
  // Invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await createProdotto(formData, immagini);
      
      // Reset del form
      setFormData({
        nome: '',
        tipo: '',
        prezzo: '',
        unita: '',
        categoria: '',
        descrizione: ''
      });
      setImmagini([]);
      
      // Mostra messaggio di successo
      setSuccessMessage('Prodotto aggiunto con successo!');
      
      // Nascondi messaggio dopo 3 secondi
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Errore:', error);
      setErrorMessage('Si è verificato un errore durante il salvataggio del prodotto.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Aggiungi Nuovo Prodotto</h4>
            </div>
            <div className="card-body">
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}
              
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome Prodotto *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo *</label>
                  <select
                    className="form-select"
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleziona un tipo</option>
                    {tipiProdotto.map((tipo, index) => (
                      <option key={index} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="prezzo" className="form-label">Prezzo *</label>
                    <input
                      type="number"
                      className="form-control"
                      id="prezzo"
                      name="prezzo"
                      value={formData.prezzo}
                      onChange={handleChange}
                      step="0.01"
                      min="0.01"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="unita" className="form-label">Unità di Misura *</label>
                    <select
                      className="form-select"
                      id="unita"
                      name="unita"
                      value={formData.unita}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleziona unità</option>
                      {unitaMisura.map((unita, index) => (
                        <option key={index} value={unita}>{unita}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="categoria" className="form-label">Categoria *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="descrizione" className="form-label">Descrizione</label>
                  <textarea
                    className="form-control"
                    id="descrizione"
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                    rows="3"
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="immagini" className="form-label">Immagini Prodotto *</label>
                  <input
                    type="file"
                    className="form-control"
                    id="immagini"
                    onChange={handleImageChange}
                    multiple
                    accept="image/*"
                    required
                  />
                  <div className="form-text">
                    Puoi selezionare più immagini. Formati supportati: JPG, PNG, GIF.
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvataggio in corso...' : 'Salva Prodotto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;