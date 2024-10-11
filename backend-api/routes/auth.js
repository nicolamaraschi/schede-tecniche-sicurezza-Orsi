const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Rotta per la registrazione di un nuovo utente
router.post('/register', register);

// Rotta per il login dell'utente
router.post('/login', login);

module.exports = router;
