import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  console.log("ProductCard rendering with product:", product);
  
  if (!product) {
    console.log("ProductCard received null/undefined product");
    return (
      <div className="product-card product-card-empty">
        <div className="product-info">
          <h3 className="product-title">Prodotto non disponibile</h3>
        </div>
      </div>
    );
  }
  
  const { 
    _id, 
    nome, 
    tipo, 
    prezzo, 
    unita, 
    immagini, 
    categoria,
    sottocategoria,
    codice,
    tipoImballaggio
  } = product;
  
  // Gestisci il caso in cui il prezzo sia undefined o non sia un numero
  const formattedPrice = typeof prezzo === 'number' 
    ? prezzo.toFixed(2) 
    : '0.00';
  
  // Usa direttamente l'URL completo dall'API
  const mainImage = immagini && Array.isArray(immagini) && immagini.length > 0 
    ? immagini[0] 
    : '/placeholder-product.jpg';

  console.log("ProductCard image:", mainImage);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={mainImage} alt={nome || 'Prodotto'} />
        <div className="product-overlay">
          <Link to={`/prodotto/${_id}`} className="view-product">
            Visualizza
          </Link>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category-tag">{categoria || 'Categoria non specificata'}</div>
        {sottocategoria && (
          <div className="product-subcategory-tag">{sottocategoria}</div>
        )}
        <h3 className="product-title">{nome || 'Prodotto senza nome'}</h3>
        {codice && <div className="product-code">Cod: {codice}</div>}
        <p className="product-type">{tipo || 'Tipo non specificato'}</p>
        {tipoImballaggio && <p className="product-packaging">{tipoImballaggio}</p>}
        <div className="product-price">
          <span className="price">{formattedPrice} €</span>
          <span className="unit">{unita || 'PZ'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;