const mongoose = require('mongoose');

// Definizione dello schema per i prodotti
const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome del prodotto
  code: { type: String, required: true, unique: true }, // Codice del prodotto
});

module.exports = mongoose.model('Product', productSchema);
