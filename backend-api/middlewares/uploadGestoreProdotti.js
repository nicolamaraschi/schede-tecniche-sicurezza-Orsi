const multer = require('multer');
const path = require('path');

// Configura la destinazione e il nome del file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Assicurati che la directory 'uploads/' esista
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

// Filtra i file per accettare solo le immagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) { // Controlla se il tipo MIME inizia con 'image/'
    cb(null, true); // Accetta solo le immagini
  } else {
    cb(new Error('Invalid file type, only image files are allowed'), false); // Rifiuta altri tipi di file
  }
};

// Configura Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita la dimensione del file a 5MB
});

module.exports = upload; // Esporta il middleware di multer
