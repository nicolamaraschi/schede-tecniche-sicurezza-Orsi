const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome dell'azienda
  prodotti: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Riferimento al prodotto
      schede: [
        {
          documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true } // Riferimento alla scheda/documento
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Company', companySchema);
