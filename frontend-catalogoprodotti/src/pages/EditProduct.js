import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { getAllProdotti, updateProdotto } from '../api'; // Assicurati di avere l'import corretto per le funzioni API

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    prezzo: 0,
    unita: '',
    categoria: '',
    descrizione: ''
  });
  const [immagini, setImmagini] = useState([]); // Stato per le immagini
  const [showModal, setShowModal] = useState(false); // Stato per gestire il popup
  const navigate = useNavigate();

  useEffect(() => {
    // Funzione per ottenere i prodotti dall'API
    const fetchProducts = async () => {
      try {
        const data = await getAllProdotti(); // Usa la funzione API
        setProducts(data); // Assumi che data sia un array di prodotti
      } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      nome: product.nome,
      tipo: product.tipo,
      prezzo: product.prezzo,
      unita: product.unita,
      categoria: product.categoria,
      descrizione: product.descrizione
    });
    setImmagini(product.immagini || []); // Imposta le immagini esistenti
    setShowModal(true); // Mostra il popup
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImmagini([...e.target.files]); // Aggiungi nuove immagini
  };

  const handleRemoveImage = (index) => {
    const newImages = immagini.filter((_, i) => i !== index); // Rimuovi l'immagine selezionata
    setImmagini(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProdotto(selectedProduct._id, formData, immagini); // Usa la funzione API
      alert('Prodotto modificato con successo!');
      setShowModal(false); // Chiudi il popup
      navigate('/view-products'); // Reindirizza alla pagina dei prodotti
    } catch (error) {
      console.error('Errore nella richiesta di modifica:', error);
      alert('Errore nella modifica del prodotto.');
    }
  };

  return (
    <div className="container">
      <h1>Modifica Prodotto</h1>
      <div className="product-list">
        <h2>Lista Prodotti</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Prezzo</th>
              <th>Unità</th>
              <th>Categoria</th>
              <th>Descrizione</th>
              <th>Immagini</th> {/* Nuova colonna per le immagini */}
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.nome}</td>
                <td>{product.tipo}</td>
                <td>{product.prezzo} €</td>
                <td>{product.unita}</td>
                <td>{product.categoria}</td>
                <td>{product.descrizione}</td>
                <td>
                  {product.immagini && product.immagini.length > 0 && (
                    <div className="image-preview">
                      {product.immagini.map((img, index) => (
                        <img 
                          key={index} 
                          src={img} 
                          alt={`Immagine ${index}`} 
                          style={{ width: '50px', height: 'auto', marginRight: '5px' }} 
                        />
                      ))}
                    </div>
                  )}
                </td>
                <td>
                  <button className="btn btn-primary" onClick={() => handleEditClick(product)}>
                    Modifica
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup form per la modifica del prodotto */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica {selectedProduct && selectedProduct.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Tipo</label>
              <input
                type="text"
                name="tipo"
                className="form-control"
                value={formData.tipo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Prezzo</label>
              <input
                type="number"
                name="prezzo"
                className="form-control"
                value={formData.prezzo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unità</label>
              <input
                type="text"
                name="unita"
                className="form-control"
                value={formData.unita}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Categoria</label>
              <input
                type="text"
                name="categoria"
                className="form-control"
                value={formData.categoria}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descrizione</label>
              <textarea
                name="descrizione"
                className="form-control"
                value={formData.descrizione}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Immagini</label>
              <input
                type="file"
                className="form-control"
                multiple
                onChange={handleImageChange}
              />
              <div className="mt-2">
                {immagini.length > 0 && (
                  <ul className="list-group">
                    {immagini.map((img, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {img.name}
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Rimuovi
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* Visualizza le immagini esistenti */}
              {selectedProduct && selectedProduct.immagini && selectedProduct.immagini.length > 0 && (
                <div className="mt-3">
                  <h5>Immagini Esistenti</h5>
                  <ul className="list-group">
                    {selectedProduct.immagini.map((img, index) => (
                      <li key={index} className="list-group-item">
                        <img src={img} alt={`Immagine ${index}`} style={{ width: '50px', height: 'auto' }} />
                        <button 
                          className="btn btn-danger btn-sm ms-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Rimuovi
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <Button type="submit" className="btn btn-success">Salva Modifiche</Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditProduct;
