import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import productService from '../services/productService';
import ProductDetail from '../components/products/ProductDetail';
import Loader from '../components/common/Loader';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(productId);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching product with ID ${productId}:`, err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-message">
            <h2>Si è verificato un errore</h2>
            <p>{error.message || 'Impossibile caricare i dettagli del prodotto.'}</p>
            <button className="back-button" onClick={handleGoBack}>
              Torna Indietro
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="not-found-message">
            <h2>Prodotto non trovato</h2>
            <p>Il prodotto richiesto non è disponibile o è stato rimosso.</p>
            <button className="back-button" onClick={handleGoBack}>
              Torna Indietro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/catalogo">Catalogo</Link> / 
          <span>{product.nome}</span>
        </div>
        
        <ProductDetail product={product} />
      </div>
    </div>
  );
};

export default ProductDetailPage;
