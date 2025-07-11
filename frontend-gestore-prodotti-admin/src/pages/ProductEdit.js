// src/pages/ProductEdit.js
import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct, deleteProduct, fetchCategories } from '../api';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaTrash, FaImage, FaSave, FaUndo, FaSearch, FaFilter, FaSortAlphaDown, FaTimes } from 'react-icons/fa';
import './ProductEdit.css';

const ProductEdit = () => {
  // Stati per la gestione dei prodotti
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState('');
  const [newImages, setNewImages] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Stati per filtraggio e ordinamento
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const { checkTokenExpiration } = useAuth();

  // Carica prodotti e categorie all'avvio del componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [productData, categoryData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        showNotification('Errore nel caricamento dei dati', 'danger');
        console.error("Error fetching products or categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [checkTokenExpiration]);

  // Funzione per mostrare notifiche
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Gestisce il click sul pulsante modifica
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setSelectedCategoryId(product.category?._id || '');
    setSelectedSubcategoryId(product.subcategory?.id || '');
    setImagesToRemove([]);
    setNewImages([]);
    setShowModal(true);
  };

  // Chiude il modal e resetta gli stati
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setImagesToRemove([]);
    setNewImages([]);
  };

  // Gestisce il cambio di categoria
  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
    setSelectedSubcategoryId('');
  };

  // Gestisce il cambio di sottocategoria
  const handleSubcategoryChange = (event) => {
    setSelectedSubcategoryId(event.target.value);
  };

  // Gestisce la selezione di nuove immagini
  const handleImageChange = (event) => {
    setNewImages(Array.from(event.target.files));
  };

  // Gestisce l'eliminazione di un prodotto
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Sei sicuro di voler eliminare il prodotto "${productName}"?`)) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) => prevProducts.filter((prod) => prod._id !== productId));
        showNotification('Prodotto eliminato con successo');
      } catch (error) {
        if (checkTokenExpiration) {
          checkTokenExpiration(error);
        }
        showNotification('Errore durante l\'eliminazione del prodotto', 'danger');
        console.error("Error deleting product:", error);
      }
    }
  };

  // Gestisce l'aggiornamento di un prodotto
  const handleUpdateProduct = async (event) => {
    event.preventDefault();

    if (!selectedProduct) return;

    const formData = new FormData(event.target);
    
    const name = formData.get('name')?.trim();
    const description = formData.get('description')?.trim();

    if (!name || !description || !selectedCategoryId) {
      showNotification("Nome, descrizione e categoria sono campi obbligatori", "danger");
      return;
    }

    const updatedProductData = {
      ...selectedProduct,
      name,
      description,
      category: selectedCategoryId,
      subcategory: {
        id: selectedSubcategoryId,
        name: categories
          .find(cat => cat._id === selectedCategoryId)
          ?.subcategories
          .find(sub => sub._id === selectedSubcategoryId)
          ?.name || ''
      },
    };

    try {
      // Aggiunge le immagini caricate
      await updateProduct(selectedProduct._id, updatedProductData, newImages, imagesToRemove);
      
      // Aggiorna la lista dei prodotti
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
      
      showNotification("Prodotto aggiornato con successo");
      handleCloseModal();
    } catch (error) {
      if (checkTokenExpiration) {
        checkTokenExpiration(error);
      }
      showNotification("Errore durante l'aggiornamento del prodotto", "danger");
      console.error("Error updating product:", error);
    }
  };

  // Filtra e ordina i prodotti in base ai criteri impostati
  const filteredAndSortedProducts = () => {
    return [...products]
      .filter(product => {
        // Filtra per termine di ricerca
        const matchesSearchTerm = 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Filtra per categoria
        const matchesCategory = !filterCategory || product.category?._id === filterCategory;
        
        return matchesSearchTerm && matchesCategory;
      })
      .sort((a, b) => {
        let valA, valB;
        
        // Determina i valori da confrontare in base al campo di ordinamento
        switch (sortField) {
          case 'name':
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
            break;
          case 'category':
            valA = a.category?.name?.toLowerCase() || '';
            valB = b.category?.name?.toLowerCase() || '';
            break;
          default:
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
        }
        
        // Applica la direzione di ordinamento
        if (sortDirection === 'asc') {
          return valA.localeCompare(valB);
        } else {
          return valB.localeCompare(valA);
        }
      });
  };

  // Inverte la direzione di ordinamento
  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Renderizza un indicatore di caricamento
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p>Caricamento dei prodotti...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-product-edit-container">
      <div className="page-header">
        <h2>Gestione Prodotti</h2>
        <p>Modifica e aggiorna i tuoi prodotti</p>
      </div>
      
      {/* Mostra la notifica se presente */}
      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ show: false, message: '', type: '' })}></button>
        </div>
      )}
      
      {/* Barra di ricerca e filtri */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Cerca prodotti..."
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
        
        <div className="filters-section">
          <div className="filter-group">
            <label>
              <FaFilter className="filter-icon" />
              Filtra per categoria:
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-select filter-select"
            >
              <option value="">Tutte le categorie</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label>
              <FaSortAlphaDown className="filter-icon" />
              Ordina per:
            </label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="form-select filter-select"
            >
              <option value="name">Nome</option>
              <option value="category">Categoria</option>
            </select>
            <button
              className="btn btn-sm btn-outline-secondary sort-direction"
              onClick={toggleSortDirection}
              title={sortDirection === 'asc' ? 'Ordine crescente' : 'Ordine decrescente'}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Tabella dei prodotti */}
      <div className="products-table-container">
        {filteredAndSortedProducts().length === 0 ? (
          <div className="no-products">
            {searchTerm || filterCategory ? (
              <p>Nessun prodotto corrisponde ai criteri di ricerca.</p>
            ) : (
              <p>Non ci sono prodotti disponibili.</p>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Immagine</th>
                  <th>Nome</th>
                  <th>Descrizione</th>
                  <th>Categoria</th>
                  <th>Sottocategoria</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedProducts().map((product) => (
                  <tr key={product._id} className="product-row">
                    <td className="product-image-cell">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={`http://localhost:5002/${product.images[0]}`}
                          alt={product.name}
                          className="product-thumbnail"
                        />
                      ) : (
                        <div className="no-image">No Img</div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td className="description-cell">
                      <div className="truncated-text">{product.description}</div>
                    </td>
                    <td>{product.category?.name || 'N/A'}</td>
                    <td>{product.subcategory?.name || 'N/A'}</td>
                    <td className="actions-cell">
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEditClick(product)}
                      title="Modifica prodotto"
                    >
                      <FaEdit className="me-1" /> Modifica
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product._id, product.name)}
                      title="Elimina prodotto"
                    >
                      <FaTrash className="me-1" /> Elimina
                    </button>
                  </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal di modifica prodotto */}
      {showModal && selectedProduct && (
        <div className="edit-modal-backdrop">
          <div className="edit-modal">
            <div className="modal-header">
              <h3>Modifica Prodotto</h3>
              <button className="btn-close" onClick={handleCloseModal}></button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleUpdateProduct}>
                <div className="form-group">
                  <label htmlFor="name">Nome Prodotto:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    defaultValue={selectedProduct.name}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="description">Descrizione:</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    defaultValue={selectedProduct.description}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="category">Categoria:</label>
                  <select 
                    id="category" 
                    name="category" 
                    className="form-select"
                    value={selectedCategoryId} 
                    onChange={handleCategoryChange}
                    required
                  >
                    <option value="">Seleziona una categoria</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="subcategory">Sottocategoria:</label>
                  <select 
                    id="subcategory" 
                    name="subcategory" 
                    className="form-select"
                    value={selectedSubcategoryId} 
                    onChange={handleSubcategoryChange}
                    required
                    disabled={!selectedCategoryId}
                  >
                    <option value="">Seleziona una sottocategoria</option>
                    {categories
                      .find(category => category._id === selectedCategoryId)
                      ?.subcategories.map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    <FaImage /> Immagini:
                  </label>
                  
                  <div className="images-container">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <div className="current-images">
                        <p>Immagini attuali:</p>
                        <div className="images-grid">
                          {selectedProduct.images.map((img, index) => (
                            <div 
                              key={index} 
                              className={`image-item ${imagesToRemove.includes(img) ? 'marked-for-removal' : ''}`}
                            >
                              <img 
                                src={img} 
                                alt={`${selectedProduct.name} - ${index}`} 
                              />
                              <button
                                type="button"
                                className={`btn ${imagesToRemove.includes(img) ? 'btn-success' : 'btn-danger'}`}
                                onClick={() => {
                                  if (imagesToRemove.includes(img)) {
                                    setImagesToRemove(imagesToRemove.filter(i => i !== img));
                                  } else {
                                    setImagesToRemove([...imagesToRemove, img]);
                                  }
                                }}
                                title={imagesToRemove.includes(img) ? 'Annulla rimozione' : 'Rimuovi immagine'}
                              >
                                {imagesToRemove.includes(img) ? 'Annulla' : 'Rimuovi'}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="no-images-message">Nessuna immagine disponibile</p>
                    )}
                    
                    <div className="new-images">
                      <p>Aggiungi nuove immagini:</p>
                      <input 
                        type="file" 
                        name="images" 
                        multiple 
                        onChange={handleImageChange}
                        className="form-control"
                      />
                      
                      {newImages.length > 0 && (
                        <div className="selected-new-images">
                          <p>Nuove immagini selezionate: {newImages.length}</p>
                          <ul>
                            {newImages.map((img, idx) => (
                              <li key={idx}>{img.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    <FaSave /> Salva Modifiche
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    <FaUndo /> Annulla
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

export default ProductEdit;