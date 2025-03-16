// backend-api/routes/prodottiCatalogo.js
const express = require('express');
const upload = require('../middlewares/uploadCatalogo'); // Importa il middleware di upload
const {
  createProdotto,
  getAllProdotti,
  getProdottoById,
  updateProdotto,
  deleteProdotto,
  getProdottiByMacroCategoria,
  getProdottiByCategoria,
  getProdottiBySottocategoria
} = require('../controllers/prodottiCatalogoController');

const router = express.Router();

// Rotte base per il CRUD dei prodotti
router.post('/prodotti', upload.array('immagini', 5), createProdotto); // Massimo 5 immagini
router.get('/prodotti', getAllProdotti);
router.get('/prodotti/:id', getProdottoById);
router.put('/prodotti/:id', upload.array('immagini', 5), updateProdotto); // Massimo 5 immagini
router.delete('/prodotti/:id', deleteProdotto);

// Rotte per filtrare i prodotti
router.get('/macrocategoria/:macroCategoria', getProdottiByMacroCategoria);
router.get('/categoria/:categoriaId', getProdottiByCategoria);
router.get('/categoria/:categoriaId/sottocategoria/:sottocategoriaId', getProdottiBySottocategoria);

module.exports = router;