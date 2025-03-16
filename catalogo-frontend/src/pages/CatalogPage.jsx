import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductList from '../components/products/ProductList';
import CategoryMenu from '../components/products/CategoryMenu';
import ProductFilter from '../components/products/ProductFilter';
import './CatalogPage.css';

const CatalogPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name-asc',
    priceRange: [0, 1000]
  });

  // Funzione stabile per gestire i cambiamenti nei filtri
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => {
      // Verifica che i nuovi filtri siano effettivamente diversi
      const hasChanges = Object.keys(newFilters).some(
        key => prevFilters[key] !== newFilters[key]
      );
      
      // Se non ci sono cambiamenti, restituisci lo stato precedente invariato
      if (!hasChanges) return prevFilters;
      
      // Altrimenti, aggiorna i filtri
      return { ...prevFilters, ...newFilters };
    });
  }, []);

  // Fetch dei dati iniziali
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    
    const fetchData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        // Fetch products and categories in parallel with error handling
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts().catch(err => {
            console.error('Error fetching products:', err);
            return [];
          }),
          categoryService.getAllCategories().catch(err => {
            console.error('Error fetching categories:', err);
            return [];
          })
        ]);
        
        if (!isMounted) return;
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching catalog data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup per evitare memory leak e updates su componente smontato
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Calcolo memoizzato dei prodotti filtrati
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    return products
      .filter(product => {
        if (!product) return false;
        
        // Filtra per testo di ricerca
        if (filters.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
          const searchTerm = filters.search.toLowerCase();
          const productName = typeof product.nome === 'string' ? product.nome.toLowerCase() : '';
          
          if (!productName.includes(searchTerm)) {
            return false;
          }
        }
        
        // Filtra per range di prezzo
        if (Array.isArray(filters.priceRange) && filters.priceRange.length === 2) {
          const [minPrice, maxPrice] = filters.priceRange;
          const productPrice = typeof product.prezzo === 'number' ? product.prezzo : 0;
          
          if (productPrice < minPrice || productPrice > maxPrice) {
            return false;
          }
        }
        
        return true;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        
        // Ordina in base al criterio selezionato
        switch (filters.sort) {
          case 'name-asc':
            return (a.nome || '').localeCompare(b.nome || '');
          case 'name-desc':
            return (b.nome || '').localeCompare(a.nome || '');
          case 'price-asc':
            return (a.prezzo || 0) - (b.prezzo || 0);
          case 'price-desc':
            return (b.prezzo || 0) - (a.prezzo || 0);
          default:
            return 0;
        }
      });
  }, [products, filters.search, filters.priceRange, filters.sort]);

  // Gestisci errori fatali
  if (error && !loading) {
    return (
      <div className="catalog-page error-page">
        <div className="container">
          <h2>Si è verificato un errore</h2>
          <p>{error.message || 'Errore durante il caricamento dei dati del catalogo.'}</p>
          <button 
            onClick={() => navigate('/')} 
            className="button button-primary"
          >
            Torna alla Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <h1>Catalogo Prodotti</h1>
          <p>Esplora la nostra gamma completa di prodotti per la pulizia e l'igiene</p>
        </div>
        
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <CategoryMenu 
              categories={categories} 
              loading={loading} 
            />
          </aside>
          
          <div className="catalog-content">
            <ProductFilter 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              totalProducts={filteredProducts.length}
            />
            
            <ProductList 
              products={filteredProducts} 
              loading={loading} 
              error={error} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
