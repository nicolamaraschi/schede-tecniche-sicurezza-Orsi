const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Importa il pacchetto cors

const path = require('path');


const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents');
const productRoutes = require('./routes/products');
const gestoreProdottiRoutes = require('./routes/gestoreProdotti');
const prodottoCatalogoRoutes = require('./routes/prodottiCatalogo');

// Carica le variabili d'ambiente
dotenv.config();

const app = express();

// Abilita il middleware CORS prima delle rotte
app.use(cors({
  origin: 'http://localhost:3000', // Permetti richieste solo da localhost:3000

}));

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Collega al database MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

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

// Avvia il server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
