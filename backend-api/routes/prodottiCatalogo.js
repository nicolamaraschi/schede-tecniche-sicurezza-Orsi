const express = require('express');
const {
  createProdotto,
  getAllProdotti,
  getProdottoById,
  updateProdotto,
  deleteProdotto
} = require('../controllers/prodottiCatalogoController');

const router = express.Router();

// Rotta per creare un nuovo prodotto
router.post('/prodotti', createProdotto);

// Rotta per ottenere tutti i prodotti
router.get('/prodotti', getAllProdotti);

// Rotta per ottenere un prodotto per ID
router.get('/prodotti/:id', getProdottoById);

// Rotta per aggiornare un prodotto
router.put('/prodotti/:id', updateProdotto);

// Rotta per cancellare un prodotto
router.delete('/prodotti/:id', deleteProdotto);

module.exports = router;
