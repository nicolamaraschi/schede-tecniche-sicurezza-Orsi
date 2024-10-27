const mongoose = require('mongoose');

const prodottoCatalogoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  prezzo: { type: Number, required: true },
  unita: { type: String, required: true },  // €/PZ o €/KG
  categoria: { type: String, required: true },
  descrizione: { type: String },
  immagini: [{ type: String }] // Aggiunto per le immagini
});

module.exports = mongoose.model('ProdottoCatalogo', prodottoCatalogoSchema);
