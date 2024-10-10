// src/pages/AddProduct.js
import React, { useState } from 'react';
import { createProdotto } from '../api';
import './AddProduct.css';

const AddProduct = () => {
  const [product, setProduct] = useState({
    nome: '',
    tipo: '',
    prezzo: '',
    unita: '',
    categoria: '',
    descrizione: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProdotto(product);
      alert('Prodotto aggiunto con successo!');
      setProduct({ nome: '', tipo: '', prezzo: '', unita: '', categoria: '', descrizione: '' }); // Reset del modulo
    } catch (error) {
      console.error(error);
      alert('Errore durante l\'aggiunta del prodotto');
    }
  };

  return (
    <div className="add-product">
      <h1>Aggiungi Prodotto</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
        <input type="text" name="tipo" placeholder="Tipo" onChange={handleChange} required />
        <input type="number" name="prezzo" placeholder="Prezzo" onChange={handleChange} required />
        <input type="text" name="unita" placeholder="Unità (€/PZ o €/KG)" onChange={handleChange} required />
        <input type="text" name="categoria" placeholder="Categoria" onChange={handleChange} required />
        <textarea name="descrizione" placeholder="Descrizione" onChange={handleChange}></textarea>
        <button type="submit">Aggiungi Prodotto</button>
      </form>
    </div>
  );
};

export default AddProduct;
