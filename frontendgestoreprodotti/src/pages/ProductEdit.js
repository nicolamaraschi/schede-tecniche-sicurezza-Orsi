import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct, deleteProduct } from '../api'; // Importa le funzioni necessarie
import './ProductEdit.css'; // Importa gli stili per il componente

const ProductEdit = () => {
  const [products, setProducts] = useState([]); // Stato per la lista dei prodotti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showModal, setShowModal] = useState(false); // Stato per il popup
  const [selectedProduct, setSelectedProduct] = useState(null); // Prodotto selezionato

  useEffect(() => {
    const loadProductsList = async () => {
      try {
        const data = await fetchProducts(); // Carica la lista dei prodotti
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Imposta il caricamento a false
      }
    };

    loadProductsList(); // Chiama la funzione per caricare i prodotti
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
        name: event.target.category.value,
        subcategories: selectedProduct.category.subcategories.map((sub, index) => ({
          name: event.target[`subcategory-${index}`].value,
        })),
      },
    };

    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('description', updatedProduct.description);
    formData.append('category', updatedProduct.category.name);
    updatedProduct.category.subcategories.forEach((sub, index) => {
      formData.append(`subcategory-${index}`, sub.name);
    });

    try {
      await updateProduct(selectedProduct._id, formData);
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

  const handleRemoveImage = (image) => {
    setSelectedProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }));
  };

  const handleAddImages = (event) => {
    const files = Array.from(event.target.files);
    setSelectedProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files.map(file => file.name)],
    }));
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts((prevProducts) => prevProducts.filter((prod) => prod._id !== productId));
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
              <td>
                {product.images.length > 0 ? (
                  product.images.map((img, index) => {
                    const imageUrl = `http://localhost:5002/${img}`; // Modifica qui se necessario
                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={imageUrl} 
                          alt={product.name} 
                          style={{ width: '50px', height: '50px', marginRight: '5px', objectFit: 'cover' }} 
                        />
                      
                      </div>
                    );
                  })
                ) : (
                  <p>Nessuna immagine disponibile</p>
                )}
              </td>
              <td>
                <button
                  onClick={() => handleEditClick(product)}
                  className="btn btn-warning"
                >
                  Modifica
                </button>
                <button onClick={() => handleDeleteProduct(product._id)} className="btn btn-danger">Elimina</button>
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

                {/* Sezione per le immagini */}
                <div className="form-group">
                  <label htmlFor="images">Immagini</label>
                  {selectedProduct.images.map((img, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                      <img 
                        src={`http://localhost:5002/${img}`} 
                        alt={img} 
                        style={{ width: '50px', height: '50px', marginRight: '5px', objectFit: 'cover' }} 
                      />
                      <button type="button" onClick={() => handleRemoveImage(img)} className="btn btn-danger btn-sm">Rimuovi</button>
                    </div>
                  ))}
                  <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={handleAddImages}
                    multiple
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
