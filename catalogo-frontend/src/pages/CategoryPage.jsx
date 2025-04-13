import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductList from '../components/products/ProductList';
import CategoryMenu from '../components/products/CategoryMenu';
import ProductFilter from '../components/products/ProductFilter';
import './CategoryPage.css';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name-asc'
  });
  
  // Funzione stabile per gestire i cambiamenti nei filtri
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => ({...prevFilters, ...newFilters}));
  }, []);

  // Carica i prodotti e le sottocategorie
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let productsEndpoint;
        let subcategoriesEndpoint;
        
        // Determina gli endpoint in base ai parametri URL
        if (subcategoryId && categoryId) {
          // Codifica correttamente i parametri nell'URL
          const encodedCategory = encodeURIComponent(categoryId);
          const encodedSubcategory = encodeURIComponent(subcategoryId);
          
          productsEndpoint = `https://orsi-production.up.railway.app/api/prodottiCatalogo/categoria/${encodedCategory}/sottocategoria/${encodedSubcategory}`;
          subcategoriesEndpoint = `https://orsi-production.up.railway.app/api/prodottiCatalogo/categoria/${encodedCategory}/sottocategorie`;
        } else if (categoryId) {
          const encodedCategory = encodeURIComponent(categoryId);
          productsEndpoint = `https://orsi-production.up.railway.app/api/prodottiCatalogo/categoria/${encodedCategory}`;
          subcategoriesEndpoint = `https://orsi-production.up.railway.app/api/prodottiCatalogo/categoria/${encodedCategory}/sottocategorie`;
        } else {
          productsEndpoint = 'https://orsi-production.up.railway.app/api/prodottiCatalogo/prodotti';
        }
        
        console.log("Fetching products from:", productsEndpoint);
        
        // Carica prodotti
        const productsResponse = await axios.get(productsEndpoint);
        console.log("Products response:", productsResponse.data);
        
        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data);
        } else {
          console.error("API non ha restituito un array:", productsResponse.data);
          setProducts([]);
        }
        
        // Carica sottocategorie se necessario
        if (subcategoriesEndpoint) {
          console.log("Fetching subcategories from:", subcategoriesEndpoint);
          const subcategoriesResponse = await axios.get(subcategoriesEndpoint);
          console.log("Subcategories response:", subcategoriesResponse.data);
          setSubcategories(Array.isArray(subcategoriesResponse.data) ? subcategoriesResponse.data : []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId, subcategoryId]);

  // Applicazione dei filtri di ricerca e ordinamento
  const filteredProducts = useMemo(() => {
    console.log("Filtering products, total:", products.length);
    
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    // Filtro solo per ricerca testuale
    const filtered = products.filter(product => {
      if (!product) return false;
      
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        const productName = (product.nome || '').toLowerCase();
        const productCode = (product.codice || '').toLowerCase();
        return productName.includes(searchTerm) || productCode.includes(searchTerm);
      }
      
      return true;
    });
    
    // Ordinamento
    filtered.sort((a, b) => {
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
    
    console.log("Filtered products result:", filtered.length);
    return filtered;
  }, [products, filters.search, filters.sort]);

  // Gestisci errori fatali
  if (error && !loading) {
    return (
      <div className="category-page error-page">
        <div className="container">
          <h2>Si è verificato un errore</h2>
          <p>{error.message || 'Errore durante il caricamento dei dati.'}</p>
          <button onClick={() => navigate('/catalogo')} className="button button-primary">
            Torna al catalogo
          </button>
        </div>
      </div>
    );
  }

  console.log("Rendering CategoryPage with:", {
    categoryId,
    subcategoryId,
    productsCount: filteredProducts.length,
    subcategoriesCount: subcategories.length,
    loading
  });

  // Funzione per codificare in modo sicuro i parametri nell'URL
  const encodeUrlParam = (param) => {
    return encodeURIComponent(param);
  };

  return (
    <div className="category-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/catalogo">Catalogo</Link>
          {categoryId && (
            <>
              {' / '}
              <Link to={`/catalogo/categoria/${encodeUrlParam(categoryId)}`}>{categoryId}</Link>
            </>
          )}
          {subcategoryId && (
            <>
              {' / '}
              <span>{subcategoryId}</span>
            </>
          )}
        </div>
        
        <div className="category-header">
          <h1>
            {subcategoryId 
              ? subcategoryId
              : categoryId 
                ? categoryId
                : 'Tutti i Prodotti'}
          </h1>
          
          {categoryId && subcategories && subcategories.length > 0 && !subcategoryId && (
            <div className="subcategories-list">
              {subcategories.map(subcategory => (
                <Link 
                  key={`subcategory-${subcategory}`} 
                  to={`/catalogo/categoria/${encodeUrlParam(categoryId)}/sottocategoria/${encodeUrlParam(subcategory)}`}
                  className="subcategory-link"
                >
                  {subcategory}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <CategoryMenu 
              loading={loading}
              activeCategory={categoryId}
              activeSubcategory={subcategoryId}
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

export default CategoryPage;