const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { uploadToCloudinary } = require('./utils/cloudinaryUpload');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const productRoutes = require('./routes/products');
const gestoreProdottiRoutes = require('./routes/gestoreProdotti');
const prodottoCatalogoRoutes = require('./routes/prodottiCatalogo');

// Carica le variabili d'ambiente
dotenv.config();

const app = express();

app.use(cors({
  origin: '*', // Per ora accetta richieste da tutte le origini
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve i file statici dalla cartella 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Nuova route per l'upload su Cloudinary
app.post('/api/upload/cloudinary', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nessun file caricato' });
  }

  try {
    // Determina il tipo di risorsa in base al mimetype
    const resourceType = req.file.mimetype === 'application/pdf' ? 'raw' : 'image';
    
    // Carica il file su Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.body.folder || 'uploads',
      resourceType
    );

    // Rispondi con l'URL Cloudinary
    res.status(200).json({
      message: 'File caricato con successo',
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Errore durante il caricamento su Cloudinary:', error);
    res.status(500).json({ message: 'Errore durante il caricamento del file' });
  }
});


// Collega al database MongoDB senza opzioni deprecate
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Importa il middleware di Multer
const upload = require('./middlewares/uploadGestoreProdotti');

// Nuova route per l'upload dei file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Nessun file caricato' });
  }

  // Rispondi con successo e dettagli del file caricato
  res.status(200).json({
    message: 'File caricato con successo',
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`  // URL per scaricare il file
  });
});

// Usa le rotte
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gestoreProdotti', gestoreProdottiRoutes);
app.use('/api/prodottiCatalogo', prodottoCatalogoRoutes);

// Gestione degli errori 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Avvia il server sulla porta 8080 (su Railway)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(fileUpload({
  useTempFiles: false, // Non salvare in file temporanei
  limits: { fileSize: 10 * 1024 * 1024 } // Limite di 10 MB
}));

// Esporta l'app per i test
module.exports = app;
