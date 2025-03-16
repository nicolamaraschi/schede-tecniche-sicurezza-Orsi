import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductList from '../components/products/ProductList';
import CategoryMenu from '../components/products/CategoryMenu';
import ProductFilter from '../components/products/ProductFilter';
import './CategoryPage.css';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name-asc',
    priceRange: [0, 1000]
  });
  
  // Creazione stabile della funzione handleFilterChange
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

  // Fetch data con protezione da errori
  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();
    
    const fetchData = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        // Fetch categories
        let categoriesPromise = categoryService.getAllCategories();
        
        // Fetch current category if needed
        let categoryPromise = categoryId 
          ? categoryService.getCategoryById(categoryId)
          : Promise.resolve(null);
        
        // Fetch products
        let productsPromise;
        if (subcategoryId && categoryId) {
          productsPromise = productService.getProductsBySubcategory(categoryId, subcategoryId);
        } else if (categoryId) {
          productsPromise = productService.getProductsByCategory(categoryId);
        } else {
          productsPromise = productService.getAllProducts();
        }
        
        // Wait for all promises to resolve
        const [categoriesData, categoryData, productsData] = await Promise.all([
          categoriesPromise,
          categoryPromise,
          productsPromise
        ]);
        
        if (!isMounted) return;
        
        // Update state with fetched data
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setCategory(categoryData);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setLoading(false);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching category data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [categoryId, subcategoryId]);

  // Applicazione dei filtri (memoizzata per prevenire calcoli ripetuti)
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

  // Trova la sottocategoria corrente
  const currentSubcategory = useMemo(() => {
    if (!subcategoryId || !category || !Array.isArray(category.subcategories)) {
      return null;
    }
    
    return category.subcategories.find(sub => sub && sub.id === subcategoryId) || null;
  }, [subcategoryId, category]);

  // Gestisci errori fatali
  if (error && !loading) {
    return (
      <div className="category-page error-page">
        <div className="container">
          <h2>Si è verificato un errore</h2>
          <p>{error.message || 'Errore durante il caricamento dei dati.'}</p>
          <button 
            onClick={() => navigate('/catalogo')} 
            className="button button-primary"
          >
            Torna al catalogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/catalogo">Catalogo</Link>
          {category && (
            <>
              {' / '}
              <Link to={`/catalogo/categoria/${categoryId}`}>{category.name}</Link>
            </>
          )}
          {currentSubcategory && (
            <>
              {' / '}
              <span>{currentSubcategory.name}</span>
            </>
          )}
        </div>
        
        <div className="category-header">
          <h1>
            {currentSubcategory 
              ? currentSubcategory.name
              : category 
                ? category.name
                : 'Tutti i Prodotti'}
          </h1>
          
          {category && !currentSubcategory && category.subcategories && 
           Array.isArray(category.subcategories) && category.subcategories.length > 0 && (
            <div className="subcategories-list">
              {category.subcategories.map((sub) => sub && (
                <Link 
                  key={sub.id || `subcategory-${Math.random().toString(36).substr(2, 9)}`} 
                  to={`/catalogo/categoria/${categoryId}/sottocategoria/${sub.id}`}
                  className="subcategory-link"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <CategoryMenu 
              categories={categories} 
              loading={loading}
              activeId={categoryId}
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
