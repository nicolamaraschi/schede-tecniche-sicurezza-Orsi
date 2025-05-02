const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  type: { type: String, required: true },
  documentCode: { type: String, required: true },
  fileUrl: { type: String, required: true },
  cloudinaryId: { type: String, required: true } // Aggiungiamo l'ID Cloudinary
});

module.exports = mongoose.model('Document', documentSchema);