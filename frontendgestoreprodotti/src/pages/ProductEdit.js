import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct, deleteProduct } from '../api'; // Importa le funzioni necessarie
import './ProductEdit.css'; // Importa gli stili per il componente

const ProductEdit = () => {
  const [products, setProducts] = useState([]); // Stato per la lista dei prodotti
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showModal, setShowModal] = useState(false); // Stato per il popup
  const [selectedProduct, setSelectedProduct] = useState(null); // Prodotto selezionato
  const [imagesToRemove, setImagesToRemove] = useState([]); // Stato per le immagini da rimuovere

  useEffect(() => {
    const loadProductsList = async () => {
      try {
       
        const data = await fetchProducts(); // Carica la lista dei prodotti
        setProducts(data); // Imposta i prodotti nello stato
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
    setImagesToRemove([]); // Resetta le immagini da rimuovere
  };

  const handleUpdateProduct = async (event) => {
    event.preventDefault(); // Previene il comportamento predefinito del modulo
    
    if (!selectedProduct) return;

    const name = event.target.name.value?.trim() || selectedProduct.name;
    const description = event.target.description.value?.trim() || selectedProduct.description;
    const categoryId = selectedProduct.category._id; // Assicurati di usare l'ID della categoria

    if (!name || !description || !categoryId) {
      console.error("Nome, descrizione e categoria non possono essere vuoti.");
      return;
    }

    const updatedProductData = {
      ...selectedProduct,
      name,
      description,
      category: categoryId,
      subcategories: selectedProduct.category.subcategories.map((sub, index) => ({
        name: event.target[`subcategory-${index}`]?.value?.trim() || sub.name,
      })),
    };

    console.log('Dati modificati del prodotto:', updatedProductData);

    const images = [];
    const imagesToAdd = event.target.images?.files || [];
    for (let i = 0; i < imagesToAdd.length; i++) {
      images.push(imagesToAdd[i]);
      console.log('Immagine da aggiungere:', imagesToAdd[i].name);
    }

    console.log('Immagini da rimuovere:', imagesToRemove);

    try {
      const response = await updateProduct(selectedProduct._id, updatedProductData, images, imagesToRemove);
      const responseData = await response.json();
      console.log('Server response:', responseData);

      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts); // Aggiorna lo stato con i nuovi dati
    
      handleCloseModal(); // Chiude la modale dopo l'aggiornamento
      // Forza il refresh della pagina
      window.location.reload(); 

    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleRemoveImage = (image) => {
    setImagesToRemove((prev) => [...prev, image]); // Aggiunge l'immagine all'array delle immagini da rimuovere
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
                    const imageUrl = `http://localhost:5002/${img}`;
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
                  {selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((img, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={`http://localhost:5002/${img}`} 
                          alt={`Image ${index}`} 
                          style={{ width: '50px', height: '50px', marginRight: '5px', objectFit: 'cover' }} 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(img)} 
                          aria-label={`Rimuovi immagine ${img}`}
                        >
                          Rimuovi
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nessuna immagine disponibile</p>
                  )}
                  <input type="file" name="images" multiple onChange={handleAddImages} />
                </div>

                <button type="submit" className="btn btn-success">Aggiorna Prodotto</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductEdit;
