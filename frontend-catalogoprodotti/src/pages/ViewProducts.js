import React, { useEffect, useState } from 'react';
import { getAllProdotti, deleteProdotto } from '../api'; // Assicurati di importare deleteProdotto
import './ViewProducts.css';
import { Button } from 'react-bootstrap'; // Importa Button da react-bootstrap

const ViewProducts = () => {
  const [products, setProducts] = useState([]);

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

  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProdotto(id);
        setProducts(products.filter((product) => product._id !== id)); // Rimuovi il prodotto dalla lista
        alert('Prodotto eliminato con successo!');
      } catch (error) {
        console.error(error);
        alert('Errore durante l\'eliminazione del prodotto');
      }
    }
  };

  return (
    <div className="view-products">
      <h1>Visualizza Prodotti</h1>
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
                {/* Mostra le immagini, se disponibili */}
                {product.immagini && product.immagini.length > 0 ? (
                  product.immagini.map((img, index) => (
                    <img key={index} src={img} alt={`Immagine ${index + 1}`} style={{ width: '50px', height: 'auto', marginRight: '5px' }} />
                  ))
                ) : (
                  <span>Nessuna immagine</span>
                )}
              </td>
              <td>
                <Button onClick={() => handleDelete(product._id)} variant="danger" size="sm">
                  Elimina
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewProducts;
