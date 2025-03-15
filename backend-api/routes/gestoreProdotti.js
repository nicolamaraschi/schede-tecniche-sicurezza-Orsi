const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsBySubcategory,
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    addSubcategory
} = require('../controllers/gestoreProdottiController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadGestoreProdotti'); // Importa il middleware per il caricamento delle immagini

const router = express.Router();

// Rotte per i Prodotti

// Rotta per creare un prodotto
router.post('/prodotti', upload.array('images'), createProduct); // Usa upload.array() per gestire più immagini

// Rotta per ottenere tutti i prodotti
router.get('/prodotti', getAllProducts);

// Rotta per ottenere un prodotto per ID
router.get('/prodotti/:id', getProductById);

// Rotta per aggiornare un prodotto
router.put('/prodotti/:id', upload.array('images'), updateProduct); // Aggiungi upload.array() per gestire le immagini

// Rotta per eliminare un prodotto
router.delete('/prodotti/:id', deleteProduct); // Aggiungi authMiddleware per proteggere la rotta

// Rotta per ottenere prodotti per categoria
router.get('/prodotti/categoria/:categoryId', getProductsByCategory);

// routes/gestoreProdotti.js - Aggiungi questa route
router.get('/prodotti/categoria/:categoryId/sottocategoria/:subcategoryId', getProductsBySubcategory);

// Rotte per le Categorie

// Rotta per creare una categoria
router.post('/categorie',  createCategory);

// Rotta per aggiungere una sottocategoria a una categoria esistente
router.post('/categorie/:categoryId/sottocategorie', addSubcategory);

// Rotta per ottenere tutte le categorie
router.get('/categorie',  getAllCategories);

// Rotta per ottenere una categoria per ID
router.get('/categorie/:id',  getCategoryById);

// Rotta per aggiornare una categoria
router.put('/categorie/:id', updateCategory);

// Rotta per eliminare una categoria
router.delete('/categorie/:id', deleteCategory);



module.exports = router;
