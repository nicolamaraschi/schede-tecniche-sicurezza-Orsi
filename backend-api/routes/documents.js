const express = require('express');
const { 
    uploadDocument, 
    getDocumentsByProductCode, 
    getAllDocuments, 
    deleteDocument,
    getDocumentByProductCodeAndType,
    getDocumentByCode,
    getDocumentByCodePublic
  } = require('../controllers/documentController');

const upload = require('../middlewares/uploadMiddleware'); // Import corretto
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Rotta per l'upload di un documento
router.post('/upload', authMiddleware, upload.single('file'), uploadDocument);

// Rotta per ottenere i documenti di un prodotto
router.get('/:productCode', authMiddleware, getDocumentsByProductCode);

// Rotta per ottenere un documento specifico per codice documento
router.get('/code/:documentCode', authMiddleware, getDocumentByCode);

// Rotta per ottenere tutti i documenti
router.get('/', authMiddleware, getAllDocuments);

// Correzione della rotta per eliminare un documento
router.delete('/:documentId', authMiddleware, deleteDocument);

// Rotta per ottenere un documento specifico per codice prodotto e tipo documento
router.get('/:productCode/:documentType', authMiddleware, getDocumentByProductCodeAndType); // Aggiungi questa riga

// Aggiungere questa nuova route pubblica
router.get('/public/code/:documentCode', getDocumentByCodePublic);

module.exports = router;
