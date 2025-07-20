import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext'; // Importa useLanguage
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { t } = useLanguage(); // Ottieni la funzione di traduzione
  console.log("ProductCard rendering with product:", product);
  
  if (!product) {
    console.log("ProductCard received null/undefined product");
    return (
      <div className="product-card product-card-empty">
        <div className="product-info">
          <h3 className="product-title">{t('product_not_available')}</h3>
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
        <img src={mainImage} alt={nome || t('product_without_name')} />
        <div className="product-overlay">
          <Link to={`/prodotto/${_id}`} className="view-product">
            {t('view')}
          </Link>
        </div>
      </div>
      <div className="product-info">
        <div className="product-category-tag">{categoria || t('category_not_specified')}</div>
        {sottocategoria && (
          <div className="product-subcategory-tag">{sottocategoria}</div>
        )}
        <h3 className="product-title">{nome || t('product_without_name')}</h3>
        {codice && <div className="product-code">{t('code_short')} {codice}</div>}
        <p className="product-type">{tipo || t('type_not_specified')}</p>
        {tipoImballaggio && <p className="product-packaging">{tipoImballaggio}</p>}
        <div className="product-price">
          <span className="price">{formattedPrice} €</span>
          <span className="unit">{unita || t('unit_pz')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;