const ProdottoCatalogo = require('../models/ProdottoCatalogo');
const fs = require('fs'); // Importa il modulo fs per la gestione del filesystem

// Crea un nuovo prodotto
exports.createProdotto = async (req, res) => {
  try {
    const immagini = req.files.map(file => file.path); // Ottieni i percorsi delle immagini
    const prodotto = new ProdottoCatalogo({ ...req.body, immagini });
    await prodotto.save();
    res.status(201).json(prodotto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Ottieni tutti i prodotti
exports.getAllProdotti = async (req, res) => {
  try {
    const prodotti = await ProdottoCatalogo.find();
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`; // Modifica qui
    const prodottiConUrlImmagini = prodotti.map(prodotto => ({
      ...prodotto._doc,
      immagini: prodotto.immagini.map(img => baseUrl + img.split('/').pop()) // Usa solo il nome del file
    }));
    
    res.json(prodottiConUrlImmagini);
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

    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`; // Modifica qui
    const prodottoConUrlImmagini = {
      ...prodotto._doc,
      immagini: prodotto.immagini.map(img => baseUrl + img.split('/').pop()) // Usa solo il nome del file
    };

    res.json(prodottoConUrlImmagini);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aggiorna un prodotto
exports.updateProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    // Rimuovi le immagini specificate
    const { immaginiToRemove } = req.body; // Array di immagini da rimuovere
    if (immaginiToRemove) {
      immaginiToRemove.forEach(img => {
        const index = prodotto.immagini.indexOf(img);
        if (index > -1) {
          prodotto.immagini.splice(index, 1);
          // Elimina fisicamente l'immagine dal server
          fs.unlink(img, err => {
            if (err) console.error('Errore durante l\'eliminazione dell\'immagine:', err);
          });
        }
      });
    }

    // Aggiungi nuove immagini se ce ne sono
    if (req.files) {
      prodotto.immagini.push(...req.files.map(file => file.path));
    }

    // Aggiorna gli altri campi del prodotto
    Object.assign(prodotto, req.body);
    await prodotto.save();

    res.json(prodotto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cancella un prodotto
exports.deleteProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    // Elimina fisicamente tutte le immagini del prodotto
    prodotto.immagini.forEach(img => {
      fs.unlink(img, err => {
        if (err) console.error('Errore durante l\'eliminazione dell\'immagine:', err);
      });
    });

    await ProdottoCatalogo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prodotto cancellato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
