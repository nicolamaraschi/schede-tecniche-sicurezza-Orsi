const mongoose = require('mongoose');

// Definizione dello schema per il manager dei prodotti
const productManagerSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome del prodotto
  description: { type: String }, // Descrizione del prodotto
  images: [{ type: String }], // Array di URL delle immagini
  category: { 
    type: mongoose.Schema.Types.ObjectId, // Riferimento alla categoria
    ref: 'Category', // Nome del modello della categoria
    required: true 
  },
  subcategory: { 
    id: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID della sottocategoria
    name: { type: String, required: true } // Nome della sottocategoria
  }
});

module.exports = mongoose.model('ProductManager', productManagerSchema);
