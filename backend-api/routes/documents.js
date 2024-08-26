const express = require('express');
const { uploadDocument, getDocumentsByProduct } = require('../controllers/documentController');
const upload = require('../middlewares/uploadMiddleware'); // Import corretto
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotta per l'upload di un documento
router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

// Rotta per ottenere i documenti di un prodotto
router.get('/:productId', authMiddleware, getDocumentsByProduct);

module.exports = router;
