const mongoose = require('mongoose');

// Definizione dello schema per i prodotti
const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome del prodotto
  code: { type: String, required: true, unique: true }, // Codice del prodotto
  imageUrl: { type: String }, // URL dell'immagine del prodotto caricata su Cloudinary
});

module.exports = mongoose.model('Product', productSchema);
