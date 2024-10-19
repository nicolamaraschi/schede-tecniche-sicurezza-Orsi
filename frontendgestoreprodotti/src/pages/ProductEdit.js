import React, { useEffect, useState } from 'react';
import { fetchProducts, updateProduct, deleteProduct, fetchCategories } from '../api'; // Importa la funzione fetchCategories
import './ProductEdit.css'; // Importa gli stili per il componente

const ProductEdit = () => {
  const [products, setProducts] = useState([]); // Stato per la lista dei prodotti
  const [categories, setCategories] = useState([]); // Stato per la lista delle categorie
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [showModal, setShowModal] = useState(false); // Stato per il popup
  const [selectedProduct, setSelectedProduct] = useState(null); // Prodotto selezionato
  const [imagesToRemove, setImagesToRemove] = useState([]); // Stato per le immagini da rimuovere
  const [selectedCategoryId, setSelectedCategoryId] = useState(''); // Stato per la categoria selezionata
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(''); // Stato per la sottocategoria selezionata

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productData = await fetchProducts(); // Carica la lista dei prodotti
        const categoryData = await fetchCategories(); // Carica la lista delle categorie
        setProducts(productData); // Imposta i prodotti nello stato
        setCategories(categoryData); // Imposta le categorie nello stato
      } catch (error) {
        console.error("Error fetching products or categories:", error);
      } finally {
        setLoading(false); // Imposta il caricamento a false
      }
    };

    loadInitialData(); // Chiama la funzione per caricare i dati iniziali
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product); // Imposta il prodotto selezionato
    setSelectedCategoryId(product.category._id); // Imposta la categoria selezionata
    setSelectedSubcategoryId(product.subcategory?._id); // Imposta la sottocategoria selezionata
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

    if (!name || !description || !selectedCategoryId) {
      console.error("Nome, descrizione e categoria non possono essere vuoti.");
      return;
    }

    const updatedProductData = {
      ...selectedProduct,
      name,
      description,
      category: selectedCategoryId,
      subcategory: {
        id: selectedSubcategoryId,
        name: categories.find(cat => cat._id === selectedCategoryId)?.subcategories.find(sub => sub._id === selectedSubcategoryId)?.name
      },
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
      window.location.reload(); // Forza il refresh della pagina
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value); // Aggiorna la categoria selezionata
    setSelectedSubcategoryId(''); // Resetta la sottocategoria selezionata
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategoryId(event.target.value); // Aggiorna la sottocategoria selezionata
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
              <td>{product.subcategory?.name}</td>
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
                  <select id="category" name="category" value={selectedCategoryId} onChange={handleCategoryChange} required>
                    <option value="">Seleziona una categoria</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="subcategory">Sottocategoria</label>
                  <select id="subcategory" name="subcategory" value={selectedSubcategoryId} onChange={handleSubcategoryChange} required>
                    <option value="">Seleziona una sottocategoria</option>
                    {categories
                      .find(category => category._id === selectedCategoryId)?.subcategories
                      .map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="images">Immagini</label>
                  {selectedProduct.images.length > 0 ? (
                    selectedProduct.images.map((img, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <img 
                          src={`http://localhost:5002/${img}`} 
                          alt={selectedProduct.name} 
                          style={{ width: '50px', height: '50px', marginRight: '5px', objectFit: 'cover' }} 
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => setImagesToRemove([...imagesToRemove, img])}
                        >
                          Rimuovi
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Nessuna immagine disponibile</p>
                  )}
                  <input type="file" name="images" multiple />
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
