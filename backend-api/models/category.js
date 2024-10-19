const mongoose = require('mongoose');

// Definizione dello schema per le categorie
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome della categoria (es: Bucato, Pulizie, etc.)
  subcategories: [{ 
    name: { type: String, required: true } // Nome della sottocategoria
  }]
});

// Esportazione del modello Category
module.exports = mongoose.model('Category', categorySchema);
