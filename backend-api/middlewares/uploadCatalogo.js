const multer = require('multer');
const path = require('path');

// Configurazione di Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory di destinazione
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nome del file
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
