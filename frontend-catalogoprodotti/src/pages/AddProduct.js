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

  const [immagini, setImmagini] = useState([]); // Stato per le immagini

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImmagini([...e.target.files]); // Salva le immagini selezionate
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Invia sia il prodotto che le immagini
      await createProdotto(product, immagini);
      alert('Prodotto aggiunto con successo!');
      setProduct({ nome: '', tipo: '', prezzo: '', unita: '', categoria: '', descrizione: '' }); // Reset del modulo
      setImmagini([]); // Reset delle immagini
    } catch (error) {
      console.error(error);
      alert("Errore durante l'aggiunta del prodotto");
    }
  };

  return (
    <div className="add-product">
      <h1>Aggiungi Prodotto</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} required />
        
        <select name="tipo" onChange={handleChange} required>
          <option value="">Seleziona Tipo</option>
          <option value="BULK">BULK</option>
          <option value="BARATTOLO">BARATTOLO</option>
          <option value="SECCHIO">SECCHIO</option>
          <option value="ASTUCCIO VUOTO">ASTUCCIO VUOTO</option>
          <option value="ASTUCCIO PERSONALIZZATO">ASTUCCIO PERSONALIZZATO</option>
          <option value="MONODOSE CARTA">MONODOSE CARTA</option>
        </select>

        <input type="number" name="prezzo" placeholder="Prezzo" onChange={handleChange} required />
        
        <select name="unita" onChange={handleChange} required>
          <option value="">Seleziona Unità</option>
          <option value="KG">KG</option>
          <option value="PZ">PZ</option>
        </select>

        <input type="text" name="categoria" placeholder="Categoria" onChange={handleChange} required />
        <textarea name="descrizione" placeholder="Descrizione" onChange={handleChange}></textarea>

        {/* Aggiungi un input per caricare le immagini */}
        <input type="file" onChange={handleImageChange} multiple accept="image/*" required />

        <button type="submit">Aggiungi Prodotto</button>
      </form>
    </div>
  );
};

export default AddProduct;
