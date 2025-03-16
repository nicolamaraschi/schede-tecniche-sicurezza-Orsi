import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products and select a few for the featured section
        const productsData = await productService.getAllProducts();
        // Take 4 random products or fewer if there are less than 4
        const randomProducts = productsData
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(4, productsData.length));
        
        setFeaturedProducts(randomProducts);
        
        // Fetch categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="home-page">
      {/* Hero section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="animate-slide-from-left">Prodotti Professionali per la Pulizia</h1>
            <p className="animate-slide-from-left delay-100">
              Scopri la nostra gamma completa di soluzioni per ogni esigenza di pulizia e igiene
            </p>
            <Link to="/catalogo" className="cta-button animate-slide-from-left delay-200">
              Esplora il Catalogo
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Prodotti in Evidenza</h2>
            <Link to="/catalogo" className="view-all">Vedi Tutti</Link>
          </div>
          
          {error ? (
            <div className="error-message">
              <p>Si è verificato un errore durante il caricamento dei prodotti.</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="no-products">
              <p>Nessun prodotto disponibile al momento.</p>
            </div>
          ) : (
            <div className="featured-products">
              {featuredProducts.map((product) => (
                <div key={product._id} className="featured-product-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Esplora per Categoria</h2>
          </div>
          
          <div className="categories-grid">
            {categories.map((category) => (
              <Link 
                key={category._id} 
                to={`/catalogo/categoria/${category._id}`}
                className="category-card"
              >
                <div className="category-icon">
                  {/* Icon placeholder */}
                  <div className="category-icon-placeholder"></div>
                </div>
                <h3>{category.name}</h3>
                <span className="category-count">
                  {category.subcategories?.length || 0} sottocategorie
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section className="benefits-section">
        <div className="container">
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon quality-icon"></div>
              <h3>Qualità Garantita</h3>
              <p>Tutti i nostri prodotti sono sottoposti a rigorosi controlli di qualità</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon delivery-icon"></div>
              <h3>Consegna Veloce</h3>
              <p>Consegniamo in tutta Italia in tempi rapidi</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon support-icon"></div>
              <h3>Supporto Tecnico</h3>
              <p>I nostri esperti sono sempre disponibili per consigliarti</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon eco-icon"></div>
              <h3>Eco-Sostenibile</h3>
              <p>Prodotti rispettosi dell'ambiente e delle persone</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
