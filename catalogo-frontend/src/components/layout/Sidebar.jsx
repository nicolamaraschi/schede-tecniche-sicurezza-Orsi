import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, categories = [] }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    // Extract category ID from URL if present
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('categoria');
    
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      setActiveCategory(pathParts[categoryIndex + 1]);
      setExpandedCategories(prev => ({
        ...prev,
        [pathParts[categoryIndex + 1]]: true
      }));
    } else {
      setActiveCategory(null);
    }
  }, [location.pathname]);

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

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className="sidebar-content">
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-button" onClick={onClose} aria-label="Chiudi menu">×</button>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li key="home" className={location.pathname === "/" ? "active" : ""}>
              <Link to="/" onClick={onClose}>Home</Link>
            </li>
            <li key="catalog" className={location.pathname.includes("/catalogo") && !location.pathname.includes("/categoria") ? "active" : ""}>
              <Link to="/catalogo" onClick={onClose}>Catalogo</Link>
            </li>
          </ul>
          
          <h3 className="sidebar-section-title">Categorie</h3>
          <ul className="category-list">
            {Array.isArray(categories) && categories.map(category => {
              if (!category || !category._id) return null;
              
              const isActive = category._id === activeCategory;
              const hasSubcategories = category.subcategories && 
                                      Array.isArray(category.subcategories) && 
                                      category.subcategories.length > 0;
              const isExpanded = !!expandedCategories[category._id];
              
              // Genera un ID univoco per la categoria
              const categoryKey = `sidebar-category-${category._id || Math.random().toString(36).substr(2, 9)}`;
              
              return (
                <li key={categoryKey} className={isActive ? 'active' : ''}>
                  <div className="category-item">
                    <Link to={`/catalogo/categoria/${category._id}`} onClick={onClose}>
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
                        if (!subcategory || !subcategory.id) return null;
                        
                        // Genera un ID univoco per la sottocategoria
                        const subcategoryKey = `sidebar-subcategory-${subcategory.id || Math.random().toString(36).substr(2, 9)}`;
                        
                        return (
                          <li key={subcategoryKey}>
                            <Link 
                              to={`/catalogo/categoria/${category._id}/sottocategoria/${subcategory.id}`}
                              onClick={onClose}
                            >
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
          
          <h3 className="sidebar-section-title">Pagine</h3>
          <ul className="nav-list">
            <li key="contacts" className={location.pathname === "/contatti" ? "active" : ""}>
              <Link to="/contatti" onClick={onClose}>Contatti</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
