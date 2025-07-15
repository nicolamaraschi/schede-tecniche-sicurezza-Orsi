import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductList from '../components/products/ProductList';
import CategoryMenu from '../components/products/CategoryMenu';
import ProductFilter from '../components/products/ProductFilter';
import { useLanguage } from '../context/LanguageContext';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import './CategoryPage.css';

const CategoryPage = () => {
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams();
  const { language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'name-asc'
  });
  
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prevFilters => {
      const hasChanges = Object.keys(newFilters).some(
        key => prevFilters[key] !== newFilters[key]
      );
      
      if (!hasChanges) return prevFilters;
      
      return { ...prevFilters, ...newFilters };
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let productsData;
        
        if (subcategoryId && categoryId) {
          productsData = await productService.getProductsBySubcategory(categoryId, subcategoryId, language);
          const subcategoriesData = await categoryService.getSubcategoriesByCategory(categoryId);
          setSubcategories(subcategoriesData || []);
        } else if (categoryId) {
          productsData = await productService.getProductsByCategory(categoryId, language);
          const subcategoriesData = await categoryService.getSubcategoriesByCategory(categoryId);
          setSubcategories(subcategoriesData || []);
        } else {
          productsData = await productService.getAllProducts(language);
        }
        
        setProducts(productsData || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId, subcategoryId, language]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      return [];
    }
    
    const filtered = products
      .filter(product => {
        if (!product) return false;
        
        if (filters.search && typeof filters.search === 'string' && filters.search.trim() !== '') {
          const searchTerm = filters.search.toLowerCase();
          const productName = typeof product.nome === 'string' ? product.nome.toLowerCase() : '';
          const productCode = typeof product.codice === 'string' ? product.codice.toLowerCase() : '';
          
          return productName.includes(searchTerm) || productCode.includes(searchTerm);
        }
        
        return true;
      })
      .sort((a, b) => {
        if (!a || !b) return 0;
        
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
    
    return filtered;
  }, [products, filters.search, filters.sort]);

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