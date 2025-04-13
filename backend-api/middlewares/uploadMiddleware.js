const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Percorso completo della cartella 'uploads'
const uploadDir = path.join(__dirname, 'uploads');

// Crea la cartella 'uploads' se non esiste
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura la destinazione e il nome del file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

// Filtra i file per accettare solo PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accetta solo PDF
  } else {
    cb(new Error('Invalid file type, only PDF is allowed'), false); // Rifiuta altri tipi di file
  }
};

// Configura Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limita la dimensione del file a 5MB
});

module.exports = upload;
