import React from 'react';
import './Home.css'; // Assicurati di avere un file CSS per lo styling

const Home = () => {
  return (
    <div className="home">
      <h1 className="home-title">🌟 Benvenuto nel Gestore Prodotti e Categorie! 🌟</h1>
      <p className="home-description">Questa applicazione ti consente di gestire i prodotti e le categorie in modo semplice ed efficace. 🎉</p>
      <p className="home-intro">Utilizza il menu di navigazione sopra per accedere alle varie funzionalità:</p>
      <ul className="home-features">
        <li>📦 <strong>Visualizza, crea e modifica prodotti.</strong></li>
        <li>🏷️ <strong>Gestisci le categorie dei prodotti.</strong></li>
        <li>🔑 <strong>Accedi all'area di login per gestire le tue impostazioni.</strong></li>
      </ul>
      <p className="home-footer">Inizia a gestire i tuoi prodotti e categorie oggi stesso! 🚀</p>
    </div>
  );
};

export default Home;
