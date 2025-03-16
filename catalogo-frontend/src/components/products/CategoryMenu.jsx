import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './CategoryMenu.css';

const CategoryMenu = ({ categories = [], loading = false, activeId = null }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const location = useLocation();

  // Determina la categoria attiva basandosi sull'URL o sul prop
  useEffect(() => {
    // Se activeId è fornito, utilizzalo
    if (activeId) {
      setExpandedCategories(prev => ({
        ...prev,
        [activeId]: true
      }));
      return;
    }
    
    // Altrimenti, estrai l'ID dalla URL
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('categoria');
    
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      const categoryId = pathParts[categoryIndex + 1];
      setExpandedCategories(prev => ({
        ...prev,
        [categoryId]: true
      }));
    }
  }, [location.pathname, activeId]);

  // Gestisce l'espansione/contrazione di una categoria
  const toggleCategory = (categoryId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Renderizzazione durante il caricamento
  if (loading) {
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

  // Renderizzazione senza categorie
  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="category-menu">
        <h2 className="category-menu-title">Categorie</h2>
        <p className="empty-message">Nessuna categoria disponibile</p>
      </div>
    );
  }

  return (
    <div className="category-menu">
      <h2 className="category-menu-title">Categorie</h2>
      
      <ul className="category-list">
        <li key="all-products" className={!activeId ? 'active' : ''}>
          <Link to="/catalogo">Tutti i Prodotti</Link>
        </li>
        
        {categories.map(category => {
          if (!category || !category._id) {
            return null; // Salta categorie non valide
          }
          
          const isActive = category._id === activeId;
          const hasSubcategories = category.subcategories && 
                                  Array.isArray(category.subcategories) && 
                                  category.subcategories.length > 0;
          const isExpanded = !!expandedCategories[category._id];
          
          // Genera un ID univoco per la categoria
          const categoryKey = `category-${category._id || Math.random().toString(36).substr(2, 9)}`;
          
          return (
            <li key={categoryKey} className={isActive ? 'active' : ''}>
              <div className="category-item">
                <Link to={`/catalogo/categoria/${category._id}`}>
                  {category.name || 'Categoria senza nome'}
                </Link>
                
                {hasSubcategories && (
                  <button 
                    className={`toggle-button ${isExpanded ? 'expanded' : ''}`}
                    onClick={(e) => toggleCategory(category._id, e)}
                    aria-label={isExpanded ? 'Nascondi sottocategorie' : 'Mostra sottocategorie'}
                    type="button"
                  >
                    <span className="toggle-icon"></span>
                  </button>
                )}
              </div>
              
              {hasSubcategories && (
                <ul className={`subcategory-list ${isExpanded ? 'expanded' : ''}`}>
                  {category.subcategories.map(subcategory => {
                    if (!subcategory) return null;
                    
                    // Genera un ID univoco per la sottocategoria
                    const subcategoryKey = `subcategory-${subcategory.id || Math.random().toString(36).substr(2, 9)}`;
                    
                    return (
                      <li key={subcategoryKey}>
                        <Link to={`/catalogo/categoria/${category._id}/sottocategoria/${subcategory.id}`}>
                          {subcategory.name || 'Sottocategoria senza nome'}
                        </Link>
                      </li>
                    );
                  })}
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
