import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import './CategoryMenu.css';

const CategoryMenu = ({ loading = false, activeCategory = null, activeSubcategory = null }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [categories] = useState(['Domestico', 'Industriale']); // Categorie fisse
  const [subcategories, setSubcategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Fetch sottocategorie all'avvio
  useEffect(() => {
    const fetchAllSubcategories = async () => {
      try {
        setIsLoading(true);
        // Usa il servizio API centralizzato
        const response = await api.get('/prodottiCatalogo/sottocategorie');
        console.log("All subcategories response:", response);
        setSubcategories(response || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Errore nel recupero delle sottocategorie:', error);
        setIsLoading(false);
      }
    };

    fetchAllSubcategories();
  }, []);

  // Determina la categoria attiva in base all'URL
  useEffect(() => {
    // Estrai la categoria dall'URL
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('categoria');
    
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      const categoryFromUrl = decodeURIComponent(pathParts[categoryIndex + 1]);
      
      // Se è una delle nostre categorie principali, espandila
      if (categories.includes(categoryFromUrl)) {
        setExpandedCategories(prev => ({
          ...prev,
          [categoryFromUrl]: true
        }));
      }
    }
  }, [location.pathname, categories]);

  // Gestisce l'espansione/contrazione di una categoria
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Funzione per codificare in modo sicuro i parametri nell'URL
  const encodeUrlParam = (param) => {
    return encodeURIComponent(param);
  };

  // Renderizzazione durante il caricamento
  if (loading || isLoading) {
    return (
      <div className="category-menu">
        <div className="category-menu-loading">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-menu">
      <h2 className="category-menu-title">Categorie</h2>
      
      <ul className="category-list">
        <li key="all-products" className={!activeCategory ? 'active' : ''}>
          <Link to="/catalogo">Tutti i Prodotti</Link>
        </li>
        
        {categories.map(category => {
          const isActive = category === activeCategory;
          const categorySubcategories = subcategories[category] || [];
          const hasSubcategories = categorySubcategories.length > 0;
          const isExpanded = !!expandedCategories[category];
          
          return (
            <li key={`category-${category}`} className={isActive ? 'active' : ''}>
              <div className="category-item">
                <Link to={`/catalogo/categoria/${encodeUrlParam(category)}`}>
                  {category}
                </Link>
                
                {hasSubcategories && (
                  <button 
                    className={`toggle-button ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleCategory(category)}
                    aria-label={isExpanded ? 'Nascondi sottocategorie' : 'Mostra sottocategorie'}
                    type="button"
                  >
                    <span className="toggle-icon"></span>
                  </button>
                )}
              </div>
              
              {hasSubcategories && (
                <ul className={`subcategory-list ${isExpanded ? 'expanded' : ''}`}>
                  {categorySubcategories.map(subcategory => (
                    <li 
                      key={`subcategory-${subcategory}`}
                      className={subcategory === activeSubcategory ? 'active' : ''}
                    >
                      <Link to={`/catalogo/categoria/${encodeUrlParam(category)}/sottocategoria/${encodeUrlParam(subcategory)}`}>
                        {subcategory}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryMenu;