// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Ottieni il token JWT dall'header Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Verifica che il token sia stato fornito
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verifica e decodifica il token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Aggiungi i dati dell'utente decodificati alla richiesta
    req.user = decoded;
    
    // Passa al prossimo middleware/controllore
    next();
  } catch (error) {
    // Se il token non è valido o è scaduto
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
