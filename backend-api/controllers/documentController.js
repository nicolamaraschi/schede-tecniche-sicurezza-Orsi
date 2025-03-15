const Document = require('../models/document');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// Carica un nuovo documento
exports.uploadDocument = async (req, res) => {
  try {
    const { productName, type, documentCode } = req.body; // Aggiungi documentCode all'input
    const fileUrl = req.file.path;

    // Verifica se il prodotto esiste in base al nome
    const product = await Product.findOne({ name: productName });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Crea un nuovo documento, includendo documentCode
    const newDocument = new Document({ 
      productId: product._id, 
      type, 
      fileUrl, 
      documentCode  // Aggiungi il campo documentCode
    });
    
    await newDocument.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Funzione per ottenere documenti per CODICE PRODOTTO
exports.getDocumentsByProductCode = async (req, res) => {
  try {
    const { productCode } = req.params;

    if (!productCode) {
      return res.status(400).json({ message: 'Product code is required' });
    }

    // Trova il prodotto in base al codice
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Trova i documenti associati al prodotto
    const documents = await Document.find({ productId: product._id });

    // Se non ci sono documenti, restituisci un array vuoto
    const response = documents.map(doc => ({
      idDocument: doc._id,  
      productName: product.name, 
      productCode: product.code,
      documentCode: doc.documentCode || 'N/A', // Aggiungi documentCode
      documentType: doc.type,
      fileUrl: doc.fileUrl
    }));

    return res.json(response.length > 0 ? response : []);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
};



exports.getDocumentByCode = async (req, res) => {
  try {
    const { documentCode } = req.params;

    if (!documentCode) {
      return res.status(400).json({ message: 'Document code is required' });
    }

    const document = await Document.findOne({ documentCode });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Recupera i dati del prodotto associato
    const product = await Product.findById(document.productId);

    // Controlla se il prodotto esiste
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Restituisci il documento con i dati del prodotto
    return res.json({
      idDocument: document._id,
      documentCode: document.documentCode,
      fileUrl: document.fileUrl,
      type: document.type,
      productName: product.name, // Assicurati che questo campo esista nel modello del prodotto
      productCode: product.code,  // Assicurati che questo campo esista nel modello del prodotto
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ message: error.message });
  }
};








// Ottieni tutti i documenti
exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.find().populate('productId');

    const response = documents.map(doc => {
      return {
        idDocument: doc._id,
        productName: doc.productId ? doc.productId.name : 'N/A', // Verifica se productId esiste
        productCode: doc.productId ? doc.productId.code : 'N/A', // Verifica se productId esiste
        documentCode: doc.documentCode || 'N/A', // Aggiungi documentCode
        documentType: doc.type,
        fileUrl: doc.fileUrl
      };
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: error.message });
  }
};




// Funzione per eliminare un documento e il suo file
exports.deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) return res.status(400).json({ message: 'Document ID is required' });

    // Trova il documento nel database
    const document = await Document.findById(documentId);

    if (!document) return res.status(404).json({ message: 'Document not found' });

    // Percorso del file da eliminare
    const filePath = path.join(__dirname, '..', document.fileUrl);
    console.log('File path to delete:', filePath);

    // Elimina il file fisico
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ message: 'Error deleting file' });
      }

      // Elimina il documento dal database
      await Document.findByIdAndDelete(documentId);
      console.log('File deleted successfully:', filePath);

      // Restituisce un messaggio di successo
      res.status(200).json({ message: 'Document and file deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Funzione per ottenere un documento specifico per codice prodotto e tipo documento
exports.getDocumentByProductCodeAndType = async (req, res) => {
  try {
    const { productCode, documentType } = req.params;

    if (!productCode || !documentType) {
      return res.status(400).json({ message: 'Product code and document type are required' });
    }

    // Trova il prodotto in base al codice
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Trova il documento associato al prodotto e al tipo di documento
    const document = await Document.findOne({ productId: product._id, type: documentType });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Restituisci il documento, inclusi i nuovi campi
    return res.json({
      idDocument: document._id,
      productName: product.name,
      productCode: product.code,
      documentCode: document.documentCode || 'N/A', // Aggiungi il campo documentCode
      documentType: document.type,
      fileUrl: document.fileUrl
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ message: error.message });
  }
};

// Funzione pubblica per ottenere un documento per codice senza autenticazione
exports.getDocumentByCodePublic = async (req, res) => {
  try {
    const { documentCode } = req.params;

    if (!documentCode) {
      return res.status(400).json({ message: 'Document code is required' });
    }

    const document = await Document.findOne({ documentCode });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Recupera i dati del prodotto associato
    const product = await Product.findById(document.productId);

    // Controlla se il prodotto esiste
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Restituisci il documento con i dati del prodotto
    return res.json({
      idDocument: document._id,
      documentCode: document.documentCode,
      fileUrl: document.fileUrl,
      type: document.type,
      productName: product.name,
      productCode: product.code,
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ message: error.message });
  }
};

