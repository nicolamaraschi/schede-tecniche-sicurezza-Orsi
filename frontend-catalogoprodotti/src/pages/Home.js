import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="home-content text-center">
        <h1 className="display-4">🌟 Benvenuto nel Catalogo Prodotti 🌟</h1>
        <p className="lead">
          Questo programma è progettato per semplificare la gestione dei tuoi prodotti. 
          Puoi aggiungere nuovi prodotti al tuo catalogo, visualizzare tutti i prodotti esistenti, 
          modificarne i dettagli e persino eliminarli quando non ti servono più.
        </p>
        <h2>🚀 Funzionalità Principali</h2>
        <p>
          Con un'interfaccia intuitiva e user-friendly, potrai:
        </p>
        <ul className="features-list">
          <li>➕ Aggiungere prodotti con informazioni dettagliate, come nome, prezzo, tipo e descrizione.</li>
          <li>📋 Visualizzare la lista dei prodotti in un formato chiaro e accessibile, con la possibilità di modificarli o eliminarli.</li>
          <li>✏️ Modificare le informazioni di un prodotto in modo semplice, tramite un comodo popup.</li>
          <li>🗑️ Eliminare i prodotti che non sono più necessari con un semplice clic.</li>
        </ul>
        <p>
          🌈 Inizia subito a gestire il tuo catalogo prodotti in modo semplice e veloce! 
          Siamo qui per rendere la tua esperienza fantastica!
        </p>
      </div>
    </div>
  );
};

export default Home;
