// src/pages/CategoryCreate.js
import React, { useState, useEffect } from 'react';
import { createCategory, fetchCategories, addSubcategory } from '../api';

import { useAuth } from '../contexts/AuthContext';
import './CategoryCreate.css'; // Utilizzando il file CSS esistente
import { FaPlus, FaFolder, FaFolderPlus, FaListAlt, FaSave, FaUndo, FaLayerGroup } from 'react-icons/fa';

const CategoryCreate = () => {
  // Stati per la categoria
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState({ show: false, message: '', type: '' });
  
  // Stati per la sottocategoria
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [tempSubcategories, setTempSubcategories] = useState([]);
  
  // Stati per l'UI
  const [activeTab, setActiveTab] = useState('category');
  const [showCategoryDetails, setShowCategoryDetails] = useState(null);
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const { checkTokenExpiration } = useAuth();

  // Carica le categorie esistenti
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        // Verifica se il token è scaduto
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        console.error('Errore nel caricamento delle categorie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [checkTokenExpiration]);

  // Funzione per mostrare un messaggio di successo/errore
  const showMessage = (message, type = 'success') => {
    setSuccess({ show: true, message, type });
    setTimeout(() => {
      setSuccess({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Gestisci la creazione di una nuova categoria
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      showMessage('Inserisci un nome valido per la categoria', 'error');
      return;
    }

    try {
      const category = { 
        name: categoryName,
        subcategories: tempSubcategories.map(sub => ({ name: sub }))
      };
      
      await createCategory(category);
      
      showMessage('Categoria creata con successo!');
      
      // Aggiorna la lista delle categorie
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      // Resetta i campi del form
      setCategoryName('');
      setTempSubcategories([]);
    } catch (error) {
      if (checkTokenExpiration) {
        checkTokenExpiration(error);
      }
      showMessage('Errore durante la creazione della categoria', 'error');
      console.error(error);
    }
  };

  // Gestisci l'aggiunta di una sottocategoria a una categoria esistente
  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      showMessage('Seleziona una categoria', 'error');
      return;
    }
    
    if (!subcategoryName.trim()) {
      showMessage('Inserisci un nome valido per la sottocategoria', 'error');
      return;
    }

    try {
      await addSubcategory(selectedCategory, { name: subcategoryName });
      showMessage('Sottocategoria aggiunta con successo!');
      
      // Aggiorna la lista delle categorie
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      // Resetta i campi del form
      setSubcategoryName('');
    } catch (error) {
      if (checkTokenExpiration) {
        checkTokenExpiration(error);
      }
      showMessage('Errore durante l\'aggiunta della sottocategoria', 'error');
      console.error(error);
    }
  };

  // Aggiungi una sottocategoria temporanea durante la creazione di una categoria
  const addTempSubcategory = () => {
    if (!categoryName.trim()) {
      showMessage('Inserisci prima il nome della categoria', 'error');
      return;
    }
    
    if (!subcategoryName.trim()) {
      showMessage('Inserisci un nome valido per la sottocategoria', 'error');
      return;
    }
    
    setTempSubcategories([...tempSubcategories, subcategoryName]);
    setSubcategoryName('');
  };

  // Rimuovi una sottocategoria temporanea
  const removeTempSubcategory = (index) => {
    const newSubcategories = [...tempSubcategories];
    newSubcategories.splice(index, 1);
    setTempSubcategories(newSubcategories);
  };

  // Renderizza il messaggio di successo/errore
  const renderMessage = () => {
    if (!success.show) return null;
    
    return (
      <div className={`alert ${success.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
        {success.message}
        <button type="button" className="btn-close" onClick={() => setSuccess({ show: false, message: '', type: '' })}></button>
      </div>
    );
  };

  // Renderizza la vista delle categorie esistenti
  const renderCategoriesList = () => {
    if (loading) {
      return <div className="text-center py-4"><div className="spinner-border" role="status"></div></div>;
    }
    
    if (categories.length === 0) {
      return <div className="text-center py-4 text-muted">Nessuna categoria disponibile</div>;
    }
    
    return (
      <div className="categories-list">
        {categories.map(category => (
          <div key={category._id} className="category-card">
            <div className="category-header" onClick={() => setShowCategoryDetails(showCategoryDetails === category._id ? null : category._id)}>
              <FaFolder className="category-icon" />
              <h5>{category.name}</h5>
              <span className="badge bg-primary">{category.subcategories.length}</span>
            </div>
            {showCategoryDetails === category._id && (
              <div className="subcategories-list">
                <h6 className="subcategories-title">Sottocategorie:</h6>
                {category.subcategories.length > 0 ? (
                  <ul>
                    {category.subcategories.map((sub, idx) => (
                      <li key={idx}>{sub.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">Nessuna sottocategoria</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="enhanced-category-container">
      <div className="page-header">
        <h2>Gestione Categorie e Sottocategorie</h2>
        <p>Crea, visualizza e gestisci le categorie e sottocategorie dei prodotti</p>
      </div>
      
      {renderMessage()}
      
      <div className="nav-tabs-container">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'category' ? 'active' : ''}`} 
              onClick={() => setActiveTab('category')}
            >
              <FaFolderPlus /> Nuova Categoria
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'subcategory' ? 'active' : ''}`} 
              onClick={() => setActiveTab('subcategory')}
            >
              <FaLayerGroup /> Aggiungi Sottocategoria
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'list' ? 'active' : ''}`} 
              onClick={() => setActiveTab('list')}
            >
              <FaListAlt /> Visualizza Tutte
            </button>
          </li>
        </ul>
      </div>
      
      <div className="tab-content">
        {/* Tab per creare una nuova categoria */}
        {activeTab === 'category' && (
          <div className="category-create-tab">
            <div className="form-card">
              <div className="card-header">
                <h3><FaFolderPlus /> Crea Nuova Categoria</h3>
                <p>Aggiungi una nuova categoria con eventuali sottocategorie</p>
              </div>
              <form onSubmit={handleCreateCategory}>
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="categoryName"
                    placeholder="Nome Categoria"
                    value={categoryName} 
                    onChange={(e) => setCategoryName(e.target.value)} 
                    required 
                  />
                  <label htmlFor="categoryName">Nome Categoria</label>
                </div>
                
                <div className="subcategories-section">
                  <h4>Sottocategorie</h4>
                  
                  <div className="input-group mb-3">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nome Sottocategoria" 
                      value={subcategoryName}
                      onChange={(e) => setSubcategoryName(e.target.value)}
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button"
                      onClick={addTempSubcategory}
                    >
                      <FaPlus /> Aggiungi
                    </button>
                  </div>
                  
                  {tempSubcategories.length > 0 ? (
                    <div className="subcategories-list">
                      <h5>Sottocategorie inserite:</h5>
                      <ul className="list-group">
                        {tempSubcategories.map((sub, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {sub}
                            <button 
                              className="btn btn-sm btn-danger" 
                              onClick={() => removeTempSubcategory(index)}
                              type="button"
                            >
                              &times;
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-muted">Nessuna sottocategoria aggiunta</p>
                  )}
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <FaSave /> Crea Categoria
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-lg"
                    onClick={() => {
                      setCategoryName('');
                      setTempSubcategories([]);
                      setSubcategoryName('');
                    }}
                  >
                    <FaUndo /> Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Tab per aggiungere una sottocategoria a una categoria esistente */}
        {activeTab === 'subcategory' && (
          <div className="subcategory-add-tab">
            <div className="form-card">
              <div className="card-header">
                <h3><FaLayerGroup /> Aggiungi Sottocategoria</h3>
                <p>Aggiungi una sottocategoria a una categoria esistente</p>
              </div>
              <form onSubmit={handleAddSubcategory}>
                <div className="form-floating mb-3">
                  <select 
                    className="form-select" 
                    id="categorySelect"
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)} 
                    required
                  >
                    <option value="">Seleziona una categoria</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name} ({category.subcategories.length} sottocategorie)
                      </option>
                    ))}
                  </select>
                  <label htmlFor="categorySelect">Categoria</label>
                </div>
                
                <div className="form-floating mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="subcategoryName"
                    placeholder="Nome Sottocategoria"
                    value={subcategoryName} 
                    onChange={(e) => setSubcategoryName(e.target.value)} 
                    required 
                  />
                  <label htmlFor="subcategoryName">Nome Sottocategoria</label>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-lg">
                    <FaPlus /> Aggiungi Sottocategoria
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary btn-lg"
                    onClick={() => {
                      setSelectedCategory('');
                      setSubcategoryName('');
                    }}
                  >
                    <FaUndo /> Reset
                  </button>
                </div>
              </form>
            </div>
            
            {selectedCategory && (
              <div className="selected-category-info">
                <h4>Informazioni sulla categoria selezionata</h4>
                {selectedCategory && (
                  <div className="category-details">
                    {categories.filter(cat => cat._id === selectedCategory).map(cat => (
                      <div key={cat._id} className="category-info-card">
                        <h5>{cat.name}</h5>
                        <p>Sottocategorie esistenti:</p>
                        {cat.subcategories.length > 0 ? (
                          <ul className="list-group">
                            {cat.subcategories.map((sub, idx) => (
                              <li key={idx} className="list-group-item">{sub.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted">Nessuna sottocategoria</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Tab per visualizzare tutte le categorie */}
        {activeTab === 'list' && (
          <div className="categories-list-tab">
            <div className="list-header">
              <h3>Categorie Esistenti</h3>
              <p>Tutte le categorie disponibili e le relative sottocategorie</p>
            </div>
            {renderCategoriesList()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryCreate;