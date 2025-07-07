const multer = require('multer');

// Memorizziamo i file in memoria anziché salvarli su disco
const storage = multer.memoryStorage();

// Filtra i file per accettare solo PDF
const fileFilter = (req, file, cb) => {
  console.log('File received by multer:', file.originalname);
  console.log('File mimetype:', file.mimetype);
  console.log('File size:', file.size);

  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only PDF is allowed'), false);
  }
};

// Configura Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limita la dimensione del file a 10MB
});

module.exports = upload;