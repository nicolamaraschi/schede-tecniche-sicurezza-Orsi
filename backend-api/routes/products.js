const express = require('express');
const {
    createProduct,
    getProducts,
    getProductByCode,
    deleteProduct,
    
  } = require('../controllers/productController');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rotta per creare un prodotto
router.post('/', authMiddleware, createProduct);

// Rotta per ottenere tutti i prodotti
router.get('/', authMiddleware, getProducts);

// Rotta per ottenere un prodotto per codice
router.get('/:productCode', authMiddleware, getProductByCode);

// Rotta per eliminare un prodotto
router.delete('/:productCode/:productName', authMiddleware, deleteProduct);


module.exports = router;
