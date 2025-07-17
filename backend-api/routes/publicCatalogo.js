// backend-api/routes/publicCatalogo.js
const express = require('express');
const {
  getPublicProdotti,
  getPublicProdottoById,
  getPublicCategories,
  getPublicCategoryById,
  getPublicAllSubcategories,
  getPublicSubcategoriesByCategory
} = require('../controllers/prodottiCatalogoController');

const router = express.Router();

// Rotta pubblica per visualizzare i prodotti con lingua selezionabile
router.get('/prodotti', getPublicProdotti);
router.get('/prodotti/:id', getPublicProdottoById);

// Rotte pubbliche per le categorie e sottocategorie
router.get('/categorie', getPublicCategories);
router.get('/categorie/:categoryId', getPublicCategoryById);
router.get('/sottocategorie', getPublicAllSubcategories);
router.get('/categoria/:categoria/sottocategorie', getPublicSubcategoriesByCategory);

module.exports = router;