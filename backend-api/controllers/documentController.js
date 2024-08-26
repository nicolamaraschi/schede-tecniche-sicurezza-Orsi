const Document = require('../models/document');
const Product = require('../models/product');

// Carica un nuovo documento
exports.uploadDocument = async (req, res) => {
  try {
    const { productId, type } = req.body;
    const fileUrl = req.file.path;
    
    // Verifica se il prodotto esiste
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Crea un nuovo documento
    const newDocument = new Document({ productId, type, fileUrl });
    await newDocument.save();
    res.status(201).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ottieni tutti i documenti per un prodotto
exports.getDocumentsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Trova i documenti associati al prodotto
    const documents = await Document.find({ productId });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
