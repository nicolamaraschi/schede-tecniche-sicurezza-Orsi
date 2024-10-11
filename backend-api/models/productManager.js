const mongoose = require('mongoose');

const productManagerSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Nome del prodotto
    description: { type: String }, // Descrizione del prodotto
    images: [{ type: String }], // Array di URL delle immagini
    category: { 
      type: mongoose.Schema.Types.ObjectId, // Riferimento alla categoria
      ref: 'Category', // Nome del modello della categoria
      required: true 
    }
  });

module.exports = mongoose.model('productManager', productManagerSchema);
