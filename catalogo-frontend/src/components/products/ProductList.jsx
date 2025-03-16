import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';
import './ProductList.css';

const ProductList = ({ products, loading, error }) => {
  const [visibleProducts, setVisibleProducts] = useState([]);
  
  useEffect(() => {
    if (products && products.length > 0) {
      // Simulate progressive loading for smooth animation
      const timer = setTimeout(() => {
        setVisibleProducts(products);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [products]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Si è verificato un errore durante il caricamento dei prodotti.</p>
        <p>{error.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>Nessun prodotto trovato.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {visibleProducts.map((product, index) => (
        <div 
          key={product._id} 
          className="product-item animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
