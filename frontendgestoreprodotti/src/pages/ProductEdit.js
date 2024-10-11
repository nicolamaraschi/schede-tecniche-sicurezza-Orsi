import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct, deleteProduct } from '../api'; // Assicurati di importare deleteProduct
import './ProductEdit.css';

const ProductEdit = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const loadProductsList = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductsList();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async (event) => {
    // La tua funzione di aggiornamento rimane qui
  };

  // Funzione per gestire la cancellazione del prodotto
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId); // Chiama la funzione per eliminare il prodotto
      setProducts((prevProducts) => prevProducts.filter((prod) => prod._id !== productId)); // Aggiorna la lista dei prodotti
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Elenco dei Prodotti</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrizione</th>
            <th>Categoria</th>
            <th>Sottocategoria</th>
            <th>Immagini</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.category?.name}</td>
              <td>{product.category?.subcategories.map(sub => sub.name).join(', ')}</td>
              <td>{product.images.join(', ')}</td>
              <td>
                <button onClick={() => handleEditClick(product)} className="btn btn-warning">Modifica</button>
                <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-danger">Elimina</button> {/* Pulsante di eliminazione */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <h2>Modifica Prodotto</h2>
            {selectedProduct && (
              <form onSubmit={handleUpdateProduct}>
                {/* Il modulo di aggiornamento rimane qui */}
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
