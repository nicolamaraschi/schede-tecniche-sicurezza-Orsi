const express = require('express');
const upload = require('../middlewares/uploadCatalogo'); // Importa il middleware di upload
const {
  createProdotto,
  getAllProdotti,
  getProdottoById,
  updateProdotto,
  deleteProdotto
} = require('../controllers/prodottiCatalogoController');

const router = express.Router();

// Rotta per creare un nuovo prodotto con immagini
router.post('/prodotti', upload.array('immagini', 5), createProdotto); // Massimo 5 immagini

// Rotta per aggiornare un prodotto con immagini
router.put('/prodotti/:id', upload.array('immagini', 5), updateProdotto); // Massimo 5 immagini

// Altre rotte rimangono invariate
router.get('/prodotti', getAllProdotti);
router.get('/prodotti/:id', getProdottoById);
router.delete('/prodotti/:id', deleteProdotto);

module.exports = router;
