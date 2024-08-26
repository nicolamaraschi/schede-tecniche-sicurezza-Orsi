const express = require('express');
const { createProduct, getProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Rotta per creare un nuovo prodotto
router.post('/', createProduct);

// Rotta per ottenere tutti i prodotti
router.get('/', getProducts);

// Rotta per ottenere un prodotto per ID
router.get('/:productId', getProductById);

module.exports = router;
