import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../api'; // Assicurati di importare la funzione deleteProduct
import './ProductInfo.css'; // Importa il CSS personalizzato

const ProductInfo = () => {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts(token);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    loadProducts();
  }, [token]);

  const handleDelete = async (productCode, productName) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questo prodotto?');
    if (!confirmDelete) return;

    try {
      await deleteProduct(token, productCode, productName); // Chiama la funzione per eliminare il prodotto
      setProducts(products.filter(product => product.code !== productCode)); // Aggiorna lo stato per rimuovere il prodotto
      alert('Prodotto eliminato con successo!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Errore nell\'eliminazione del prodotto.');
    }
  };

  return (
    <div className="product-info-card">
      <h2>Info Codice Prodotto</h2>
      <ul className="product-info-ul">
        {products.length > 0 ? (
          products.map(product => (
            <li key={product.code} className="product-info-li">
              {product.name} - {product.code}
              <button className="product-info-delete-button" onClick={() => handleDelete(product.code, product.name)}>
                Elimina
              </button>
            </li>
          ))
        ) : (
          <li className="product-info-li">Nessun prodotto trovato.</li>
        )}
      </ul>
    </div>
  );
};

export default ProductInfo;
