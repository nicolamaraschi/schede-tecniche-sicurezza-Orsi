// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchProducts, fetchCategories } from '../api';
import { 
  FaBox, 
  FaFolderOpen, 
  FaPlus, 
  FaEdit, 
  FaChartBar, 
  FaServer, 
  FaCog, 
  FaUserAlt, 
  FaThLarge,
  FaFileAlt,
  FaLayerGroup
} from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const { username, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    recentlyAddedProduct: null,
    recentlyAddedCategory: null,
    loading: true
  });

  useEffect(() => {
    const loadStats = async () => {
      if (!isAuthenticated) return;
      
      try {
        // Carica i prodotti e le categorie in parallelo
        const [products, categories] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        // Ordina i prodotti per id (assumendo che gli id più recenti siano "maggiori")
        // Nota: questo è un modo semplificato, potrebbe essere necessario un ordinamento diverso
        const sortedProducts = [...products].sort((a, b) => b._id.localeCompare(a._id));
        const sortedCategories = [...categories].sort((a, b) => b._id.localeCompare(a._id));
        
        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          recentlyAddedProduct: sortedProducts[0] || null,
          recentlyAddedCategory: sortedCategories[0] || null,
          loading: false
        });
      } catch (error) {
        console.error('Error loading stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    loadStats();
  }, [isAuthenticated]);

  // Dati per i widget delle funzionalità
  const features = [
    {
      id: 'products',
      title: 'Gestione Prodotti',
      description: 'Visualizza, aggiungi e modifica i prodotti nel catalogo',
      icon: <FaBox />,
      color: '#3498db',
      links: [
        { to: '/products', text: 'Lista Prodotti', icon: <FaThLarge /> },
        { to: '/products/create', text: 'Aggiungi Prodotto', icon: <FaPlus /> },
        { to: '/products/edit', text: 'Modifica Prodotti', icon: <FaEdit /> }
      ]
    },
    {
      id: 'categories',
      title: 'Gestione Categorie',
      description: 'Organizza i prodotti in categorie e sottocategorie',
      icon: <FaFolderOpen />,
      color: '#2ecc71',
      links: [
        { to: '/categories', text: 'Lista Categorie', icon: <FaLayerGroup /> },
        { to: '/categories/create', text: 'Aggiungi Categoria', icon: <FaPlus /> },
        { to: '/categories/edit', text: 'Modifica Categorie', icon: <FaEdit /> }
      ]
    },
    {
      id: 'system',
      title: 'Sistema',
      description: 'Configura le impostazioni del sistema e gestisci gli utenti',
      icon: <FaCog />,
      color: '#9b59b6',
      links: [
        { to: '/', text: 'Configurazione', icon: <FaServer /> },
        { to: '/', text: 'Gestione Utenti', icon: <FaUserAlt /> }
      ]
    }
  ];

  return (
    <div className="enhanced-home-container">
      {/* Header con benvenuto */}
      <div className="welcome-header">
        <div className="welcome-content">
          <h1>Benvenuto, {username || 'Utente'}!</h1>
          <p>Gestisci facilmente i tuoi prodotti, categorie e schede tecniche con il sistema EGStore.</p>
        </div>
        <div className="header-decoration"></div>
      </div>

      {/* Dashboard con statistiche */}
      <section className="stats-dashboard">
        <h2 className="section-title">
          <FaChartBar className="section-icon" /> Panoramica Generale
        </h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#3498db' }}>
              <FaBox />
            </div>
            <div className="stat-content">
              <h3>Prodotti</h3>
              {stats.loading ? (
                <div className="stat-loader"></div>
              ) : (
                <div className="stat-value">{stats.totalProducts}</div>
              )}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#2ecc71' }}>
              <FaFolderOpen />
            </div>
            <div className="stat-content">
              <h3>Categorie</h3>
              {stats.loading ? (
                <div className="stat-loader"></div>
              ) : (
                <div className="stat-value">{stats.totalCategories}</div>
              )}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#e74c3c' }}>
              <FaFileAlt />
            </div>
            <div className="stat-content">
              <h3>Ultimo Prodotto</h3>
              {stats.loading ? (
                <div className="stat-loader"></div>
              ) : (
                <div className="stat-value">
                  {stats.recentlyAddedProduct ? (
                    stats.recentlyAddedProduct.name
                  ) : (
                    'Nessun prodotto'
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#9b59b6' }}>
              <FaLayerGroup />
            </div>
            <div className="stat-content">
              <h3>Ultima Categoria</h3>
              {stats.loading ? (
                <div className="stat-loader"></div>
              ) : (
                <div className="stat-value">
                  {stats.recentlyAddedCategory ? (
                    stats.recentlyAddedCategory.name
                  ) : (
                    'Nessuna categoria'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sezione funzionalità */}
      <section className="features-section">
        <h2 className="section-title">
          <FaCog className="section-icon" /> Funzionalità Principali
        </h2>
        
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-header" style={{ backgroundColor: feature.color }}>
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
              </div>
              
              <div className="feature-content">
                <p>{feature.description}</p>
                
                <div className="feature-links">
                  {feature.links.map((link, index) => (
                    <Link key={index} to={link.to} className="feature-link">
                      {link.icon} {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sezione guida rapida */}
      <section className="quick-guide">
        <h2 className="section-title">
          <FaFileAlt className="section-icon" /> Guida Rapida
        </h2>
        
        <div className="guide-content">
          <div className="guide-card">
            <h3>Come iniziare</h3>
            <ol>
              <li>Crea categorie e sottocategorie</li>
              <li>Aggiungi i prodotti al catalogo</li>
              <li>Carica le schede tecniche per ogni prodotto</li>
              <li>Gestisci e aggiorna il catalogo quando necessario</li>
            </ol>
          </div>
          
          <div className="guide-card">
            <h3>Consigli utili</h3>
            <ul>
              <li>Utilizza nomi univoci per le categorie e i prodotti</li>
              <li>Carica immagini di alta qualità per i prodotti</li>
              <li>Aggiorna regolarmente le schede tecniche</li>
              <li>Utilizza la funzione di ricerca per trovare rapidamente i prodotti</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;