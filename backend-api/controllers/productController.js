const Product = require('../models/product');
const Document = require('../models/document');
const fs = require('fs');
const path = require('path');

// Crea un nuovo prodotto
exports.createProduct = async (req, res) => {
  try {
    const { name, code } = req.body; // Modificato per includere code
    const newProduct = new Product({ name, code }); // Usato code
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Funzione per ottenere tutti i prodotti
exports.getProducts = async (req, res) => {
  try {
    // Ottieni tutti i prodotti senza filtri
    const products = await Product.find({}, 'name code'); // Restituisce solo i campi 'name' e 'code'
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Ottieni un prodotto per codice prodotto
exports.getProductByCode = async (req, res) => {
  try {
    const { productCode } = req.params; // Cambiato per ricevere il codice prodotto
    const product = await Product.findOne({ code: productCode }); // Usa `findOne` per cercare per codice
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// elimina prodotti e tutte le schede associate a quel prodtto da eliminare
exports.deleteProduct = async (req, res) => {
  try {
    const { productCode, productName } = req.params; // Ottieni il codice e il nome del prodotto dai parametri

    // Trova il prodotto in base al codice e al nome
    const product = await Product.findOneAndDelete({ code: productCode, name: productName });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Elimina tutti i documenti associati al prodotto
    await Document.deleteMany({ productId: product._id });

    res.status(200).json({ message: 'Product and associated documents deleted successfully' });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
};
