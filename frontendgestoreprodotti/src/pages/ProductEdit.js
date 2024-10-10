import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct } from '../api'; // Importa la funzione per ottenere e aggiornare i prodotti
import './ProductEdit.css'; // Stili per il componente

const ProductEdit = () => {
  const [products, setProducts] = useState([]); // Stato per la lista dei prodotti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showModal, setShowModal] = useState(false); // Stato per il popup
  const [selectedProduct, setSelectedProduct] = useState(null); // Prodotto selezionato per la modifica

  useEffect(() => {
    const loadProductsList = async () => {
      try {
        const data = await fetchProducts(); // Funzione per ottenere la lista dei prodotti
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Imposta il caricamento a false quando i dati sono stati recuperati
      }
    };

    loadProductsList(); // Carica la lista dei prodotti al caricamento del componente
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Imposta il prodotto selezionato
    setShowModal(true); // Mostra il popup
  };

  const handleCloseModal = () => {
    setShowModal(false); // Chiude il popup
    setSelectedProduct(null); // Resetta il prodotto selezionato
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault(); // Previene il comportamento predefinito del modulo

    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      name: event.target.name.value,
      description: event.target.description.value,
      category: {
        ...selectedProduct.category,
        name: event.target.category.value, // Aggiorna il nome della categoria
        subcategories: selectedProduct.category.subcategories.map((sub, index) => ({
          name: event.target[`subcategory-${index}`].value, // Aggiorna il nome della sottocategoria
        })),
      },
      images: event.target.images.value.split(','), // Aggiorna le immagini come array
    };

    try {
      await updateProduct(selectedProduct._id, updatedProduct); // Aggiorna il prodotto
      handleCloseModal(); // Chiudi il popup
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === updatedProduct._id ? updatedProduct : prod
        )
      ); // Aggiorna la lista dei prodotti
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Mostra un messaggio di caricamento
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
                <button
                  onClick={() => handleEditClick(product)}
                  className="btn btn-warning"
                >
                  Modifica
                </button>
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
                <div className="form-group">
                  <label htmlFor="name">Nome</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={selectedProduct.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descrizione</label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={selectedProduct.description}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="category">Categoria</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={selectedProduct.category?.name}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sottocategorie</label>
                  {selectedProduct.category?.subcategories.map((sub, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        name={`subcategory-${index}`}
                        defaultValue={sub.name}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label htmlFor="images">Immagini (separate da virgola)</label>
                  <input
                    type="text"
                    id="images"
                    name="images"
                    defaultValue={selectedProduct.images.join(', ')} // Mostra le immagini come stringa separata da virgola
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Aggiorna</button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Annulla</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
