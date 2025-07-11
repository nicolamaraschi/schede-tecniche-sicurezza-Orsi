import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ product }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  if (!product) {
    return <div className="product-detail-loading">Caricamento...</div>;
  }
  
  const { 
    nome, 
    tipo, 
    prezzo, 
    unita, 
    categoria,
    sottocategoria, 
    descrizione, 
    immagini, 
    codice,
    tipoImballaggio,
    pezziPerCartone,
    cartoniPerEpal,
    pezziPerEpal
  } = product;
  
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
        <div className="product-category">
          <Link to={`/catalogo/categoria/${categoria}`}>{categoria}</Link>
        </div>
        
        {sottocategoria && (
          <div className="product-subcategory">
            <Link to={`/catalogo/categoria/${categoria}/sottocategoria/${sottocategoria}`}>
              {sottocategoria}
            </Link>
          </div>
        )}
        
        <h1 className="product-title">{nome}</h1>
        {codice && <div className="product-code">Codice: {codice}</div>}
        <div className="product-type">{tipo}</div>
        
        <div className="product-price">
          <span className="price">{typeof prezzo === 'number' ? prezzo.toFixed(2) : '0.00'} €</span>
          <span className="unit">{unita}</span>
        </div>
        
        {tipoImballaggio && (
          <div className="product-packaging">
            <h3>Informazioni di Imballaggio</h3>
            <table className="packaging-table">
              <tbody>
                <tr>
                  <td>Tipo Imballaggio:</td>
                  <td><strong>{tipoImballaggio}</strong></td>
                </tr>
                {pezziPerCartone && (
                  <tr>
                    <td>Pezzi per Cartone:</td>
                    <td><strong>{pezziPerCartone}</strong></td>
                  </tr>
                )}
                {cartoniPerEpal && (
                  <tr>
                    <td>Cartoni per Epal:</td>
                    <td><strong>{cartoniPerEpal}</strong></td>
                  </tr>
                )}
                {pezziPerEpal && (
                  <tr>
                    <td>Totale Pezzi per Epal:</td>
                    <td><strong>{pezziPerEpal}</strong></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
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