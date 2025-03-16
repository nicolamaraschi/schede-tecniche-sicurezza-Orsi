import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClipboardList, 
  faTrashAlt, 
  faExclamationCircle, 
  faSpinner,
  faInfoCircle,
  faSearch,
  faBox,
  faSort,
  faSortUp,
  faSortDown
} from '@fortawesome/free-solid-svg-icons';
import './ProductInfo.css';

const ProductInfo = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(token);
        setProducts(data);
        setFilteredProducts(data);
        setError('');
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Impossibile caricare la lista dei prodotti. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [token]);

  // Filtra i prodotti in base al termine di ricerca
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Gestione dell'ordinamento
  const requestSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredProducts(sortedProducts);
    setSortConfig({ key, direction });
  };

  // Funzione per ottenere l'icona di ordinamento appropriata
  const getSortIcon = (name) => {
    if (!sortConfig.key || sortConfig.key !== name) {
      return <FontAwesomeIcon icon={faSort} />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} /> 
      : <FontAwesomeIcon icon={faSortDown} />;
  };

  // Gestisce la richiesta di eliminazione
  const handleDeleteRequest = (product) => {
    setConfirmDelete(product);
  };

  // Gestisce l'eliminazione del prodotto
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    setLoading(true);
    try {
      await deleteProduct(token, confirmDelete.code, confirmDelete.name);
      
      // Rimuovi il prodotto dalla lista
      setProducts(prevProducts => 
        prevProducts.filter(p => p.code !== confirmDelete.code)
      );
      setFilteredProducts(prevFiltered => 
        prevFiltered.filter(p => p.code !== confirmDelete.code)
      );
      
      setConfirmDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Errore durante l\'eliminazione del prodotto.');
    } finally {
      setLoading(false);
    }
  };

  // Annulla l'eliminazione
  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="product-info-container">
      <div className="product-info-card">
        <div className="card-header">
          <h2>Gestione Prodotti</h2>
          <p>Visualizza e gestisci la lista dei prodotti</p>
        </div>
        
        <div className="search-section">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input 
              type="text" 
              placeholder="Cerca per nome o codice prodotto" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="product-count">
            {filteredProducts.length} prodotti trovati
          </div>
        </div>
        
        {loading && products.length === 0 ? (
          <div className="loading-container">
            <FontAwesomeIcon icon={faSpinner} spin className="loading-icon" />
            <p>Caricamento prodotti...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
            <p>{error}</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => requestSort('name')}>
                    <div className="th-content">
                      <span>Nome Prodotto</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="sortable" onClick={() => requestSort('code')}>
                    <div className="th-content">
                      <span>Codice Prodotto</span>
                      {getSortIcon('code')}
                    </div>
                  </th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.code}>
                    <td>
                      <div className="product-name">
                        <FontAwesomeIcon icon={faBox} className="product-icon" />
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td><code>{product.code}</code></td>
                    <td>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteRequest(product)}
                        title="Elimina Prodotto"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-products">
            <FontAwesomeIcon icon={faClipboardList} className="empty-icon" />
            {searchTerm ? (
              <p>Nessun prodotto trovato per "{searchTerm}". Prova con un termine di ricerca diverso.</p>
            ) : (
              <p>Nessun prodotto disponibile. Aggiungi un nuovo prodotto per iniziare.</p>
            )}
          </div>
        )}
        
        <div className="info-box">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          <div className="info-content">
            <p>
              I prodotti possono essere creati nella sezione <strong>Crea Prodotto</strong>. 
              Una volta creati, puoi associare loro schede tecniche e di sicurezza.
            </p>
          </div>
        </div>
      </div>
      
      {/* Finestra di conferma eliminazione */}
      {confirmDelete && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-dialog">
            <h3>Conferma eliminazione</h3>
            <p>
              Sei sicuro di voler eliminare il prodotto <strong>{confirmDelete.name}</strong> (codice: {confirmDelete.code})?
            </p>
            <p className="warning-text">
              <FontAwesomeIcon icon={faExclamationCircle} className="warning-icon" />
              Questa azione eliminerà anche tutte le schede associate al prodotto.
            </p>
            <div className="confirm-actions">
              <button className="cancel-button" onClick={handleDeleteCancel}>
                Annulla
              </button>
              <button className="confirm-button" onClick={handleDeleteConfirm}>
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;