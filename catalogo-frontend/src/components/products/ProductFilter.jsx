import React, { useState, useRef, useEffect } from 'react';
import './ProductFilter.css';

// Versione completamente ridisegnata per interrompere il loop infinito
const ProductFilter = React.memo(({ filters, onFilterChange, totalProducts }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef(null);
  const previousFiltersRef = useRef(filters);
  
  // Sincronizza lo stato locale quando cambia il filtro esterno
  // ma SOLO se è cambiato esternamente, non per le nostre azioni
  useEffect(() => {
    // Salta il primo mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      previousFiltersRef.current = filters;
      return;
    }

    // Verifica se filters.search è cambiato esternamente
    if (filters.search !== previousFiltersRef.current.search && 
        filters.search !== localSearch) {
      setLocalSearch(filters.search);
    }
    
    // Aggiorna il riferimento
    previousFiltersRef.current = filters;
  }, [filters, localSearch]);

  // Gestione dell'input di ricerca
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setLocalSearch(newValue);
    
    // Cancella il timer esistente, se presente
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Imposta un nuovo timer
    debounceTimerRef.current = setTimeout(() => {
      onFilterChange({ search: newValue });
    }, 300);
  };
  
  // Clean up del timer quando il componente si smonta
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Gestione dell'ordinamento
  const handleSortChange = (e) => {
    onFilterChange({ sort: e.target.value });
  };
  
  // Pulizia della ricerca
  const clearSearch = () => {
    setLocalSearch('');
    onFilterChange({ search: '' });
  };
  
  return (
    <div className="product-filter">
      <div className="filter-options">
        <div className="search-box">
          <input
            type="text"
            placeholder="Cerca prodotti..."
            value={localSearch}
            onChange={handleSearchChange}
          />
          <button 
            className="clear-search"
            onClick={clearSearch}
            style={{ visibility: localSearch ? 'visible' : 'hidden' }}
            aria-label="Cancella ricerca"
            type="button"
          >
            ×
          </button>
        </div>
        
        <div className="sort-box">
          <label htmlFor="sort">Ordina per:</label>
          <select
            id="sort"
            value={filters.sort || 'name-asc'}
            onChange={handleSortChange}
          >
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="price-asc">Prezzo (Crescente)</option>
            <option value="price-desc">Prezzo (Decrescente)</option>
          </select>
        </div>
      </div>
      
      <div className="filter-summary">
        <span className="products-count">
          {totalProducts} {totalProducts === 1 ? 'prodotto' : 'prodotti'}
        </span>
      </div>
    </div>
  );
});

ProductFilter.displayName = 'ProductFilter';

export default ProductFilter;
