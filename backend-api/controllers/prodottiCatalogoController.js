const ProdottoCatalogo = require('../models/ProdottoCatalogo');

// Crea un nuovo prodotto
exports.createProdotto = async (req, res) => {
  try {
    const prodotto = new ProdottoCatalogo(req.body);
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
