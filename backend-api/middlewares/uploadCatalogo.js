const multer = require('multer');

// Memorizziamo i file in memoria anziché salvarli su disco
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita la dimensione del file a 5MB
});

module.exports = upload;