// backend-api/routes/prodottiCatalogo.js
const express = require('express');
const upload = require('../middlewares/uploadCatalogo'); // Importa il middleware di upload
const {
  createProdotto,
  getAllProdotti,
  getProdottoById,
  updateProdotto,
  deleteProdotto,
  getProdottiByCategoria,
  getProdottiBySottocategoria,
  getAllSottocategorie,
  getSottocategorieByCategoria,
  addSottocategoria,
  updateSottocategoria,
  deleteSottocategoria
} = require('../controllers/prodottiCatalogoController');

const router = express.Router();

// Rotte base per il CRUD dei prodotti
router.post('/prodotti', upload.array('immagini', 5), createProdotto); // Massimo 5 immagini
router.get('/prodotti', getAllProdotti);
router.get('/prodotti/:id', getProdottoById);
router.put('/prodotti/:id', upload.array('immagini', 5), updateProdotto); // Massimo 5 immagini
router.delete('/prodotti/:id', deleteProdotto);

// Rotte per filtrare i prodotti
router.get('/categoria/:categoria', getProdottiByCategoria);
router.get('/categoria/:categoria/sottocategoria/:sottocategoria', getProdottiBySottocategoria);

// Rotte per gestire le sottocategorie
router.get('/sottocategorie', getAllSottocategorie);
router.get('/categoria/:categoria/sottocategorie', getSottocategorieByCategoria);
router.post('/categoria/:categoria/sottocategorie', addSottocategoria);
router.put('/categoria/:categoria/sottocategoria/:sottocategoria', updateSottocategoria);
router.delete('/categoria/:categoria/sottocategoria/:sottocategoria', deleteSottocategoria);

module.exports = router;