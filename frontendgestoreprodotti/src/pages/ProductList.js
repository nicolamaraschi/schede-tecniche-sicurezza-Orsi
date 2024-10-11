import React, { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '../api';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProductsList();
  }, []);

  const fetchProductsList = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProductsList();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Elenco dei Prodotti</h2>
      <Link to="/products/create" className="btn btn-primary mb-3">Crea Nuovo Prodotto</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Immagini</th>
            <th>Categoria</th>
            <th>Sottocategoria</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                {product.images.length > 0 ? (
                  product.images.map((img, index) => {
                    // Costruisci l'URL completo per l'immagine
                    const imageUrl = `http://localhost:5002/${img}`; // Modifica qui
                    console.log(`Image URL: ${imageUrl}`); // Log dell'URL dell'immagine
                    return (
                      <img 
                        key={index} 
                        src={imageUrl} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', marginRight: '5px', objectFit: 'cover' }} 
                      />
                    );
                  })
                ) : (
                  <p>Nessuna immagine disponibile</p>
                )}
              </td>
              <td>{product.category?.name}</td>
              <td>
                {product.category?.subcategories.map((sub, index) => (
                  <div key={index}>{sub.name}</div>
                ))}
              </td>
              <td>
                <button onClick={() => handleDelete(product._id)} className="btn btn-danger">Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
