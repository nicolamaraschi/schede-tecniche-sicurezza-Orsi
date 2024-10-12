const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Configurazione MongoDB
const MONGO_URI = 'mongodb+srv://nicolamaraschi01:marase@cluster0.8odxl.mongodb.net/?retryWrites=true&w=majority';

// Schema dell'utente
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'cliente'], default: 'cliente' }
});

const User = mongoose.model('User', userSchema);

// Funzione per creare un admin
const createAdmin = async () => {
  try {
    // Collegamento al database MongoDB senza opzioni deprecate
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log('Connesso a MongoDB'))
      .catch(err => console.error('Errore durante la connessione a MongoDB:', err));

    // Hash della password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin', saltRounds); // Password 'admin'

    // Crea un nuovo utente admin
    const adminUser = new User({
      username: 'admin', // Username dell'admin
      password: hashedPassword,
      role: 'admin' // Imposta il ruolo come 'admin'
    });

    // Salva l'admin nel database
    await adminUser.save();
    console.log('Admin creato con successo');
    
    // Chiudi la connessione al database
    mongoose.connection.close();
  } catch (error) {
    console.error('Errore durante la creazione dell\'admin:', error);
    mongoose.connection.close();
  }
};

// Esegui la funzione di creazione admin
createAdmin();
