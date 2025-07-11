// src/pages/ProductCreate.js - Versione ultra-stabile
import React, { useState, useEffect } from 'react';
import { createProduct, fetchCategories } from '../api';
import { useNavigate } from 'react-router-dom';
import './ProductCreate.css';

const ProductCreate = () => {
  // Stati principali
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Carica le categorie
  useEffect(() => {
    // Funzione per caricare le categorie
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data || []);
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
        setErrorMessage('Errore nel caricamento delle categorie');
      }
    };

    loadCategories();
  }, []);

  // Aggiorna le sottocategorie quando cambia la categoria
  useEffect(() => {
    if (category) {
      const selectedCategory = categories.find(cat => cat._id === category);
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
      setSubcategory(''); // Reset sottocategoria
    } else {
      setSubcategories([]);
    }
  }, [category, categories]);

  // Gestione dei campi del form
  const handleNameChange = (e) => setName(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);
  const handleSubcategoryChange = (e) => setSubcategory(e.target.value);
  
  // Gestione del file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  // Validazione del form
  const validateForm = () => {
    // Reset dei messaggi di errore
    setErrorMessage('');
    
    // Controlli di base
    if (!name.trim()) {
      setErrorMessage('Il nome del prodotto è obbligatorio');
      return false;
    }
    
    if (!description.trim()) {
      setErrorMessage('La descrizione è obbligatoria');
      return false;
    }
    
    if (!category) {
      setErrorMessage('La categoria è obbligatoria');
      return false;
    }
    
    if (!subcategory) {
      setErrorMessage('La sottocategoria è obbligatoria');
      return false;
    }
    
    if (files.length === 0) {
      setErrorMessage('È necessario caricare almeno un\'immagine');
      return false;
    }
    
    return true;
  };

  // Submission del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validazione
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      // Preparazione dell'oggetto prodotto
      const productData = {
        name,
        description,
        category,
        subcategory: {
          id: subcategory,
          name: subcategories.find(sub => sub._id === subcategory)?.name || ''
        }
      };
      
      // Invio al server
      await createProduct(productData, files);
      
      // Mostro il messaggio di successo
      setSuccessMessage('Prodotto creato con successo!');
      
      // Attendo un secondo prima di navigare
      setTimeout(() => {
        navigate('/products');
      }, 1000);
      
    } catch (error) {
      console.error('Errore nella creazione del prodotto:', error);
      setErrorMessage('Si è verificato un errore durante la creazione del prodotto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-create-container">
      <div className="page-header">
        <h2>Creazione Nuovo Prodotto</h2>
        <p>Inserisci i dettagli del nuovo prodotto</p>
      </div>

      {/* Messaggi di errore o successo */}
      {errorMessage && (
        <div className="alert alert-danger">{errorMessage}</div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {/* Form di creazione prodotto */}
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Dati base */}
            <div className="form-section">
              <h3>Informazioni prodotto</h3>
              
              <div className="form-group">
                <label htmlFor="name">Nome prodotto <span className="required">*</span></label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Descrizione <span className="required">*</span></label>
                <textarea
                  id="description"
                  className="form-control"
                  value={description}
                  onChange={handleDescriptionChange}
                  rows="4"
                  required
                ></textarea>
              </div>
            </div>
            
            {/* Categorizzazione */}
            <div className="form-section">
              <h3>Categoria e sottocategoria</h3>
              
              <div className="form-group">
                <label htmlFor="category">Categoria <span className="required">*</span></label>
                <select
                  id="category"
                  className="form-control"
                  value={category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">-- Seleziona una categoria --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="subcategory">Sottocategoria <span className="required">*</span></label>
                <select
                  id="subcategory"
                  className="form-control"
                  value={subcategory}
                  onChange={handleSubcategoryChange}
                  disabled={!category || subcategories.length === 0}
                  required
                >
                  <option value="">-- Seleziona una sottocategoria --</option>
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Immagini */}
            <div className="form-section">
              <h3>Immagini prodotto</h3>
              
              <div className="form-group">
                <label htmlFor="images">Immagini <span className="required">*</span></label>
                <input
                  type="file"
                  id="images"
                  className="form-control"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*"
                  required
                />
                <small className="form-text text-muted">
                  Seleziona una o più immagini per il prodotto (JPG, PNG)
                </small>
              </div>
              
              {/* Mostra solo i nomi dei file selezionati senza preview */}
              {files.length > 0 && (
                <div className="selected-files">
                  <p>File selezionati:</p>
                  <ul>
                    {files.map((file, index) => (
                      <li key={`file-${index}`}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Pulsanti di azione */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Annulla
              </button>
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creazione in corso...' : 'Crea Prodotto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;