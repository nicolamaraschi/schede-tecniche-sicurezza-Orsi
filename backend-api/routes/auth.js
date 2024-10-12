const express = require('express');
const { register, login, createAdmin } = require('../controllers/authController'); // Importa le funzioni
const router = express.Router();

// Rotte per autenticazione
router.post('/register', register);      // Rotta per registrazione
router.post('/login', login);            // Rotta per login
router.post('/createAdmin', createAdmin); // Rotta per creazione admin

module.exports = router;
