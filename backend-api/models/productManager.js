const mongoose = require('mongoose');

// Definizione dello schema per il manager dei prodotti
const productManagerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }], // Array di URL delle immagini Cloudinary
  cloudinaryIds: [{ type: String }], // Array di ID Cloudinary per le immagini
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true 
  },
  subcategory: { 
    id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true }
  }
});

module.exports = mongoose.model('ProductManager', productManagerSchema);