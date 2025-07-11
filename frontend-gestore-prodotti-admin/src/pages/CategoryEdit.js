// src/pages/CategoryEdit.js
import React, { useEffect, useState } from 'react';
import { fetchCategories, updateCategory, deleteCategory } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaSave, FaUndo, FaSearch, FaFolder, FaLayerGroup, FaPlus, FaMinus, FaSortAlphaDown, FaTimes } from 'react-icons/fa';
import './CategoryEdit.css';

const CategoryEdit = () => {
  // Stati per la gestione delle categorie
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Stati per la modifica delle sottocategorie
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  
  // Stati per filtri e ricerca
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const { checkTokenExpiration } = useAuth();

  // Carica le categorie all'avvio
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        showNotification('Errore durante il caricamento delle categorie', 'danger');
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [checkTokenExpiration]);

  // Mostra notifica
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Apre il modal per modificare una categoria
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    // Clona le sottocategorie per poterle modificare senza alterare l'originale
    setSubcategories(category.subcategories.map(sub => ({ ...sub })));
    setShowModal(true);
  };

  // Chiude il modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setSubcategories([]);
    setNewSubcategoryName('');
  };

  // Gestisce l'aggiornamento della categoria
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const categoryName = formData.get('categoryName').trim();
    
    if (!categoryName) {
      showNotification('Il nome della categoria è obbligatorio', 'danger');
      return;
    }
    
    // Verifica che tutte le sottocategorie abbiano un nome
    const invalidSubcategories = subcategories.filter(sub => !sub.name || !sub.name.trim());
    if (invalidSubcategories.length > 0) {
      showNotification('Tutte le sottocategorie devono avere un nome', 'danger');
      return;
    }
    
    try {
      const updatedCategory = {
        ...selectedCategory,
        name: categoryName,
        subcategories: subcategories
      };
      
      await updateCategory(selectedCategory._id, updatedCategory);
      
      // Aggiorna la lista delle categorie
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);
      
      showNotification('Categoria aggiornata con successo');
      handleCloseModal();
    } catch (error) {
      if (checkTokenExpiration) {
        checkTokenExpiration(error);
      }
      showNotification('Errore durante l\'aggiornamento della categoria', 'danger');
      console.error('Error updating category:', error);
    }
  };

  // Gestisce l'eliminazione di una categoria
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Sei sicuro di voler eliminare la categoria "${categoryName}"? Questa operazione non può essere annullata.`)) {
      try {
        await deleteCategory(categoryId);
        
        // Aggiorna la lista delle categorie
        setCategories(categories.filter(cat => cat._id !== categoryId));
        
        showNotification('Categoria eliminata con successo');
      } catch (error) {
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        showNotification('Errore durante l\'eliminazione della categoria', 'danger');
        console.error('Error deleting category:', error);
      }
    }
  };

  // Aggiunge una nuova sottocategoria
  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim()) {
      showNotification('Inserisci un nome per la sottocategoria', 'danger');
      return;
    }
    
    // Aggiungi la nuova sottocategoria
    setSubcategories([...subcategories, { name: newSubcategoryName.trim() }]);
    setNewSubcategoryName('');
  };

  // Rimuove una sottocategoria
  const handleRemoveSubcategory = (index) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories.splice(index, 1);
    setSubcategories(updatedSubcategories);
  };

  // Aggiorna il nome di una sottocategoria
  const handleSubcategoryNameChange = (index, newName) => {
    const updatedSubcategories = [...subcategories];
    updatedSubcategories[index].name = newName;
    setSubcategories(updatedSubcategories);
  };

  // Inverte la direzione di ordinamento
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Filtra e ordina le categorie
  const getFilteredAndSortedCategories = () => {
    return [...categories]
      .filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategories.some(sub => 
          sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .sort((a, b) => {
        const comparison = a.name.localeCompare(b.name);
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  };

  // Mostra stato di caricamento
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p>Caricamento delle categorie...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-category-edit-container">
      <div className="page-header">
        <h2>Gestione Categorie</h2>
        <p>Modifica e aggiorna le categorie e le sottocategorie dei prodotti</p>
      </div>
      
      {/* Mostra notifiche */}
      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`}>
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification({ show: false, message: '', type: '' })}
          ></button>
        </div>
      )}
      
      {/* Barra di ricerca e filtri */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cerca categorie o sottocategorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              title="Cancella ricerca"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="sort-controls">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleSortDirection}
            title={`Ordine ${sortDirection === 'asc' ? 'crescente' : 'decrescente'}`}
          >
            <FaSortAlphaDown /> Ordine: {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
          </button>
        </div>
      </div>
      
      {/* Lista delle categorie */}
      <div className="categories-container">
        {getFilteredAndSortedCategories().length === 0 ? (
          <div className="no-categories">
            {searchTerm ? (
              <p>Nessuna categoria corrisponde ai criteri di ricerca</p>
            ) : (
              <p>Nessuna categoria disponibile</p>
            )}
          </div>
        ) : (
          <div className="categories-grid">
            {getFilteredAndSortedCategories().map(category => (
              <div key={category._id} className="category-card">
                <div className="category-header">
                  <div className="category-title">
                    <FaFolder className="category-icon" />
                    <h4>{category.name}</h4>
                  </div>
                  <div className="category-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(category)}
                      title="Modifica categoria"
                    >
                      <FaEdit className="me-1" /> Modifica
                    </button>
                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => handleDeleteCategory(category._id, category.name)}
                      title="Elimina categoria"
                    >
                      <FaTrash className="me-1" /> Elimina
                    </button>
                  </div>
                </div>
                
                <div className="category-body">
                  <h5>
                    <FaLayerGroup className="subcategory-icon" /> 
                    Sottocategorie ({category.subcategories.length})
                  </h5>
                  {category.subcategories.length > 0 ? (
                    <ul className="subcategories-list">
                      {category.subcategories.map((sub, index) => (
                        <li key={index} className="subcategory-item">
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-subcategories">Nessuna sottocategoria disponibile</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal di modifica */}
      {showModal && selectedCategory && (
        <div className="edit-modal-backdrop">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Modifica Categoria</h3>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleUpdateCategory}>
                <div className="form-group">
                  <label htmlFor="categoryName">Nome Categoria:</label>
                  <input
                    type="text"
                    id="categoryName"
                    name="categoryName"
                    className="form-control"
                    defaultValue={selectedCategory.name}
                    required
                  />
                </div>
                
                <div className="subcategories-section">
                  <h4>
                    <FaLayerGroup className="me-2" /> 
                    Gestione Sottocategorie
                  </h4>
                  
                  <div className="subcategories-manager">
                    {subcategories.length > 0 ? (
                      <div className="current-subcategories">
                        <h5>Sottocategorie esistenti:</h5>
                        <ul className="subcategories-edit-list">
                          {subcategories.map((sub, index) => (
                            <li key={index} className="subcategory-edit-item">
                              <input
                                type="text"
                                className="form-control subcategory-input"
                                value={sub.name}
                                onChange={(e) => handleSubcategoryNameChange(index, e.target.value)}
                                placeholder="Nome sottocategoria"
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemoveSubcategory(index)}
                                title="Rimuovi sottocategoria"
                              >
                                <FaMinus />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="no-subcategories">Nessuna sottocategoria presente</p>
                    )}
                    
                    <div className="add-subcategory">
                      <h5>Aggiungi nuova sottocategoria:</h5>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          placeholder="Nome nuova sottocategoria"
                        />
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddSubcategory}
                        >
                          <FaPlus className="me-1" /> Aggiungi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave className="me-1" /> Salva Modifiche
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    <FaUndo className="me-1" /> Annulla
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryEdit;