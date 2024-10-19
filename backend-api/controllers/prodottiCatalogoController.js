const ProdottoCatalogo = require('../models/ProdottoCatalogo');

// Crea un nuovo prodotto
// Crea un prodotto
// Crea un prodotto
exports.createProdotto = async (req, res) => {
  try {
    // Logga il corpo della richiesta per il debug
    console.log('Corpo della richiesta:', req.body);

    // Controlla che tutti i campi richiesti siano presenti
    const { name, description, category, subcategory, images } = req.body;

    if (!name || !description || !category || !subcategory || !images) {
      return res.status(400).json({ message: 'Tutti i campi sono richiesti' });
    }

    // Crea un nuovo prodotto utilizzando il modello
    const prodotto = new ProdottoCatalogo(req.body);

    // Salva il prodotto nel database
    await prodotto.save();

    // Rispondi con il prodotto creato
    res.status(201).json(prodotto);
  } catch (error) {
    // Logga l'errore dettagliato
    console.error('Errore durante la creazione del prodotto:', error);

    // Rispondi con un messaggio di errore
    res.status(400).json({ message: error.message, error: error });
  }
};




// Ottieni tutti i prodotti
exports.getAllProdotti = async (req, res) => {
  try {
    const prodotti = await ProdottoCatalogo.find();
    res.json(prodotti);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ottieni un prodotto per ID
exports.getProdottoById = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json(prodotto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aggiorna un prodotto
exports.updateProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json(prodotto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancella un prodotto
exports.deleteProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findByIdAndDelete(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }
    res.json({ message: 'Prodotto cancellato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
