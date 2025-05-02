const multer = require('multer');

// Memorizziamo i file in memoria anziché salvarli su disco
const storage = multer.memoryStorage();

// Filtra i file per accettare solo le immagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only image files are allowed'), false);
  }
};

// Configura Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita la dimensione del file a 5MB
});

module.exports = upload;