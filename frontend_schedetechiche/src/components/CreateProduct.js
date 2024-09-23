// src/components/CreateProduct.js
import React, { useState } from 'react';
import { createProduct } from '../api';
import './CreateProduct.css';

const CreateProduct = () => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');

  const handleCreateProduct = async () => {
    if (!newProductName || !newProductCode) return;

    const token = localStorage.getItem('token');
    try {
      await createProduct(token, newProductName, newProductCode);
      setNewProductName('');
      setNewProductCode('');
      alert('Prodotto creato con successo!');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Errore nella creazione del prodotto.');
    }
  };

  return (
    <div className="card">
      <h2>Crea Nuovo Prodotto</h2>
      <input 
        type="text" 
        placeholder="Nome Prodotto" 
        value={newProductName} 
        onChange={(e) => setNewProductName(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Codice Prodotto" 
        value={newProductCode} 
        onChange={(e) => setNewProductCode(e.target.value)} 
      />
      <button onClick={handleCreateProduct}>Crea Prodotto</button>
    </div>
  );
};

export default CreateProduct;
