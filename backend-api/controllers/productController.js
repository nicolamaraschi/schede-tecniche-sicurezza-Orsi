const Product = require('../models/product');
const Document = require('../models/document'); // Assicurati che il percorso sia corretto
const cloudinary = require('cloudinary').v2; // Importa l'SDK di Cloudinary v2

// Crea un nuovo prodotto
exports.createProduct = async (req, res) => {
  console.log('Received request to create product:', req.body); // Log the incoming request body
  try {
    const { name, code } = req.body; // Modificato per includere code
    
    // Basic validation
    if (!name || !code) {
      console.error('Validation Error: Name or code is missing.');
      return res.status(400).json({ message: 'Product name and code are required.' });
    }

    const newProduct = new Product({ name, code }); // Usato code
    await newProduct.save();
    console.log('Product created successfully:', newProduct); // Log successful creation
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error); // Log the full error object
    res.status(500).json({ message: error.message, details: error }); // Include full error in response
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

// Elimina un prodotto e tutti i documenti associati (da DB e Cloudinary)
exports.deleteProduct = async (req, res) => {
  try {
    // Identifica il prodotto da eliminare (usando il codice come identificatore primario sembra più robusto)
    const { productCode } = req.params; // Usa solo il codice dai parametri
     if (!productCode) {
        return res.status(400).json({ message: 'Product code parameter is required for deletion.' });
    }

    // 1. Trova il prodotto per ottenere l'_id
    // Potresti voler usare il codice come chiave univoca
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: `Product with code '${productCode}' not found.` });
    }
    console.log(`Product found for deletion: ${product.name} (${product.code}), ID: ${product._id}`);


    // 2. Trova tutti i documenti associati a questo prodotto
    const associatedDocuments = await Document.find({ productId: product._id });
    console.log(`Found ${associatedDocuments.length} associated documents.`);


    // 3. Elimina i file associati da Cloudinary
    if (associatedDocuments.length > 0) {
      const cloudinaryIdsToDelete = associatedDocuments
        .map(doc => doc.cloudinaryId) // Assumi che il campo sia 'cloudinaryId'
        .filter(Boolean); // Filtra eventuali documenti senza ID Cloudinary

      if (cloudinaryIdsToDelete.length > 0) {
        console.log(`Attempting to delete ${cloudinaryIdsToDelete.length} files from Cloudinary...`);
        try {
          // Usa delete_resources per eliminazioni multiple (più efficiente)
          // IMPORTANTE: Assicurati che il resource_type sia corretto ('raw' per i PDF/documenti)
          const deletionResult = await cloudinary.api.delete_resources(
              cloudinaryIdsToDelete,
              { resource_type: 'raw' } // Usa 'raw' per i documenti/PDF
          );
          console.log('Cloudinary deletion result:', deletionResult);
          // Logga eventuali fallimenti parziali (opzionale)
          const deletedIds = Object.keys(deletionResult.deleted);
          const failedDeletions = cloudinaryIdsToDelete.filter(id => !deletedIds.includes(id));
          if(failedDeletions.length > 0) {
              console.warn(`Failed to delete from Cloudinary: ${failedDeletions.join(', ')}`);
              // Potresti decidere se bloccare l'operazione qui o continuare
          }

        } catch (cloudinaryError) {
          console.error('Error deleting files from Cloudinary:', cloudinaryError);
          // Decidi la strategia: interrompere? continuare? Loggare è il minimo.
          // return res.status(500).json({ message: 'Failed to delete associated files from Cloudinary.', error: cloudinaryError.message });
          // Per ora, logghiamo e continuiamo con l'eliminazione dal DB
        }
      } else {
          console.log('No valid Cloudinary IDs found for associated documents.');
      }
    }


    // 4. Elimina i record dei documenti dal database
    if (associatedDocuments.length > 0) {
        const dbDeleteResult = await Document.deleteMany({ productId: product._id });
        console.log(`Deleted ${dbDeleteResult.deletedCount} document records from database.`);
    }


    // 5. Elimina il prodotto stesso dal database
    await Product.findByIdAndDelete(product._id);
    console.log(`Product record deleted from database: ${product.name} (${product.code})`);


    res.status(200).json({ message: `Product '${product.name}' (${product.code}) and associated documents deleted successfully.` });

  } catch (error) {
    console.error('Error occurred during product deletion:', error);
    res.status(500).json({ message: `Error deleting product: ${error.message}` });
  }
};