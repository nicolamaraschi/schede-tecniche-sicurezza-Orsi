// backend-api/models/ProdottoCatalogo.js
const mongoose = require('mongoose');

const prodottoCatalogoSchema = new mongoose.Schema({
  nome: {
    it: { type: String, required: true },
    en: { type: String },
    fr: { type: String },
    es: { type: String },
    de: { type: String }
  },
  codice: { type: String, required: true, unique: true },
  tipo: { type: String, required: true },
  prezzo: { type: Number, required: true },
  unita: { type: String, required: true },  // €/PZ o €/KG
  
  // Categoria di prodotto (Domestico o Industriale)
  categoria: { 
    type: String, 
    required: true,
    enum: ['Domestico', 'Industriale'] 
  },
  
  // Sottocategoria del prodotto
  sottocategoria: {
    type: String,
    required: false
  },
  
  tipoImballaggio: {
    type: String,
    required: true,
    enum: [
      'Barattolo 1kg',
      'BigBag 600kg',
      'Flacone 750g',
      'Sacco 10kg',
      'Sacco 20kg',
      'Secchio 200tabs',
      'Secchio 3.6kg',
      'Secchio 4kg',
      'Secchio 5kg',
      'Secchio 6kg',
      'Secchio 8kg',
      'Secchio 9kg',
      'Secchio 10kg',
      'Astuccio 100g',
      'Astuccio 700g',
      'Astuccio 2400g',
      'Astuccio 900g',
      'Astuccio 200g',
      'Flacone 500ml',
      'Flacone Trigger 750ml',
      'Tanica 1000l',
      'Flacone 5l',
      'Fustone 5.6kg',
      'Cartone 400tabs'
    ]
  },
  pezziPerCartone: { type: Number, required: true },
  cartoniPerEpal: { type: Number, required: true },
  pezziPerEpal: { type: Number, required: true },
  descrizione: {
    it: { type: String },
    en: { type: String },
    fr: { type: String },
    es: { type: String },
    de: { type: String }
  },
  immagini: [{ type: String }]
});

// Middleware pre-save per calcolare automaticamente pezziPerEpal, se non fornito
prodottoCatalogoSchema.pre('save', function(next) {
  // Se pezziPerEpal non è stato fornito ma abbiamo pezziPerCartone e cartoniPerEpal
  if (!this.pezziPerEpal && this.pezziPerCartone && this.cartoniPerEpal) {
    this.pezziPerEpal = this.pezziPerCartone * this.cartoniPerEpal;
  }
  next();
});

module.exports = mongoose.model('ProdottoCatalogo', prodottoCatalogoSchema);