import React, { useState } from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  if (!product) {
    return <div className="product-detail-loading">Caricamento...</div>;
  }
  
  const { nome, tipo, prezzo, unita, categoria, descrizione, immagini } = product;
  
  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="main-image">
          {immagini && immagini.length > 0 ? (
            <img 
              src={immagini[activeImage]} 
              alt={nome} 
              className="animate-fade-in"
            />
          ) : (
            <div className="image-placeholder">
              <span>Immagine non disponibile</span>
            </div>
          )}
        </div>
        
        {immagini && immagini.length > 1 && (
          <div className="thumbnail-gallery">
            {immagini.map((img, index) => (
              <div 
                key={index} 
                className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={img} alt={`${nome} - immagine ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">{categoria}</div>
        <h1 className="product-title">{nome}</h1>
        <div className="product-type">{tipo}</div>
        
        <div className="product-price">
          <span className="price">{prezzo.toFixed(2)} €</span>
          <span className="unit">{unita}</span>
        </div>
        
        <div className="product-description">
          <h3>Descrizione</h3>
          <p>{descrizione || 'Nessuna descrizione disponibile per questo prodotto.'}</p>
        </div>
        
        <div className="product-actions">
          <button className="contact-button">
            Richiedi Informazioni
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
