const Product = require('../models/product');
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

// Funzione per eliminare un prodotto
exports.deleteProduct = async (req, res) => {
  try {
    const { productCode, productName } = req.params; // Ottieni il codice e il nome del prodotto dai parametri

    // Trova il prodotto in base al codice e al nome
    const result = await Product.findOneAndDelete({ code: productCode, name: productName });

    if (!result) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
PER ELIMINARE DOCUMENTO DA UPLOADS
const fs = require('fs');
const path = require('path');

// Funzione per eliminare un documento
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Assicurati che documentId sia un valore valido
    if (!documentId) {
      return res.status(400).json({ message: 'Document ID is required' });
    }

    // Trova il documento per ottenere il file associato
    const document = await Document.findById(documentId);
    
    // Controlla se il documento esiste
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Elimina il documento dalla base di dati
    await Document.findByIdAndDelete(documentId);

    // Elimina il file dalla cartella uploads
    const filePath = path.join(__dirname, 'uploads', document.fileUrl); // Assicurati che fileUrl contenga solo il nome del file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ message: 'Failed to delete the associated file' });
      }
      // Restituisce un messaggio di successo
      res.status(200).json({ message: 'Document and associated file deleted successfully' });
    });
  } catch (error) {
    // Restituisce un messaggio di errore in caso di eccezione
    console.error('Error deleting document:', error); // Logga l'errore
    res.status(500).json({ message: 'Internal server error' });
  }
};
*/