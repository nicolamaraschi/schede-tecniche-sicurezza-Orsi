import React, { useState, useEffect } from 'react';
import { getAllProdotti, updateProdotto } from '../api'; // Importa anche getAllProdotti
import './EditProduct.css';
import { FaEdit } from 'react-icons/fa'; // Icona per il pulsante Modifica
import { Modal, Button } from 'react-bootstrap'; // Importa Modal e Button da react-bootstrap

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProdotti();
        setProducts(data);
      } catch (error) {
        console.error(error);
        alert('Errore durante il recupero dei prodotti');
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProdotto(selectedProduct._id, selectedProduct);
      alert('Prodotto aggiornato con successo!');
      setIsModalOpen(false);
      // Refresh the product list
      const updatedProducts = products.map(product =>
        product._id === selectedProduct._id ? selectedProduct : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'aggiornamento del prodotto');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="edit-product">
      <h1>Modifica Prodotti</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Prezzo</th>
            <th>Unità</th>
            <th>Categoria</th>
            <th>Descrizione</th>
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
                <Button onClick={() => handleEditClick(product)} variant="warning" size="sm">
                  <FaEdit /> Modifica
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal di Bootstrap per la modifica del prodotto */}
      <Modal show={isModalOpen} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prodotto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input type="text" className="form-control" name="nome" value={selectedProduct.nome} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo</label>
                <input type="text" className="form-control" name="tipo" value={selectedProduct.tipo} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Prezzo</label>
                <input type="number" className="form-control" name="prezzo" value={selectedProduct.prezzo} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Unità</label>
                <input type="text" className="form-control" name="unita" value={selectedProduct.unita} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <input type="text" className="form-control" name="categoria" value={selectedProduct.categoria} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrizione</label>
                <textarea className="form-control" name="descrizione" value={selectedProduct.descrizione} onChange={handleChange}></textarea>
              </div>
              <Button type="submit" variant="primary">Aggiorna Prodotto</Button>
            </form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EditProduct;
