import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [categories] = useState(['Domestico', 'Industriale']); // Categorie fisse
  const [subcategories, setSubcategories] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch sottocategorie all'avvio
  useEffect(() => {
    const fetchAllSubcategories = async () => {
      try {
        setIsLoading(true);
        // Chiama l'endpoint che restituisce tutte le sottocategorie per categoria
        const response = await axios.get('http://localhost:5002/api/prodottiCatalogo/sottocategorie');
        console.log("Sidebar subcategories:", response.data);
        setSubcategories(response.data || {});
        setIsLoading(false);
      } catch (error) {
        console.error('Errore nel recupero delle sottocategorie:', error);
        setIsLoading(false);
      }
    };

    fetchAllSubcategories();
  }, []);

  // Determina la categoria e sottocategoria attiva dall'URL
  useEffect(() => {
    // Estrai la categoria e sottocategoria dall'URL
    const pathParts = location.pathname.split('/');
    const categoryIndex = pathParts.indexOf('categoria');
    
    if (categoryIndex !== -1 && pathParts[categoryIndex + 1]) {
      const categoryFromUrl = decodeURIComponent(pathParts[categoryIndex + 1]);
      setActiveCategory(categoryFromUrl);
      
      // Verifica se c'è una sottocategoria nella URL
      if (
        pathParts.length > categoryIndex + 3 && 
        pathParts[categoryIndex + 2] === 'sottocategoria' && 
        pathParts[categoryIndex + 3]
      ) {
        setActiveSubcategory(decodeURIComponent(pathParts[categoryIndex + 3]));
      } else {
        setActiveSubcategory(null);
      }
      
      // Espandi la categoria attiva
      setExpandedCategories(prev => ({
        ...prev,
        [categoryFromUrl]: true
      }));
    } else {
      setActiveCategory(null);
      setActiveSubcategory(null);
    }
  }, [location.pathname]);

  // Gestisce l'espansione/contrazione di una categoria
  const toggleCategory = (category, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Funzione per codificare in modo sicuro i parametri nell'URL
  const encodeUrlParam = (param) => {
    return encodeURIComponent(param);
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
            {!isLoading && categories.map(category => {
              const isActive = category === activeCategory;
              const categorySubcategories = subcategories[category] || [];
              const hasSubcategories = categorySubcategories.length > 0;
              const isExpanded = !!expandedCategories[category];
              
              return (
                <li key={`sidebar-category-${category}`} className={isActive ? 'active' : ''}>
                  <div className="category-item">
                    <Link to={`/catalogo/categoria/${encodeUrlParam(category)}`} onClick={onClose}>
                      {category}
                    </Link>
                    
                    {hasSubcategories && (
                      <button 
                        className={`toggle-button ${isExpanded ? 'expanded' : ''}`}
                        onClick={(e) => toggleCategory(category, e)}
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
                          key={`sidebar-subcategory-${subcategory}`}
                          className={subcategory === activeSubcategory ? 'active' : ''}
                        >
                          <Link 
                            to={`/catalogo/categoria/${encodeUrlParam(category)}/sottocategoria/${encodeUrlParam(subcategory)}`}
                            onClick={onClose}
                          >
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