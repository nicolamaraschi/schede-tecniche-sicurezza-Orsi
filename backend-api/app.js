const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/documents'); // Modifica qui il percorso
const productRoutes = require('./routes/products');

// Carica le variabili d'ambiente
dotenv.config();

const app = express();

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Collega al database MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Usa le rotte
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes); // Modifica qui il percorso
app.use('/api/products', productRoutes);

// Gestione degli errori 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Avvia il server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
