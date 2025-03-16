// backend-api/controllers/prodottiCatalogoController.js
const ProdottoCatalogo = require('../models/ProdottoCatalogo');
const fs = require('fs');
const path = require('path');

// Funzione helper per ottenere i valori predefiniti in base al tipo di imballaggio
const getPackagingDefaults = (tipoImballaggio) => {
  const defaults = {
    'Barattolo 1kg': { pezziPerCartone: 6, cartoniPerEpal: 40, pezziPerEpal: 240 },
    'BigBag 600kg': { pezziPerCartone: 1, cartoniPerEpal: 1, pezziPerEpal: 1 },
    'Flacone 750g': { pezziPerCartone: 15, cartoniPerEpal: 55, pezziPerEpal: 825 },
    'Sacco 10kg': { pezziPerCartone: 1, cartoniPerEpal: 60, pezziPerEpal: 60 },
    'Sacco 20kg': { pezziPerCartone: 1, cartoniPerEpal: 30, pezziPerEpal: 30 },
    'Secchio 200tabs': { pezziPerCartone: 3, cartoniPerEpal: 20, pezziPerEpal: 60 },
    'Secchio 3.6kg': { pezziPerCartone: 1, cartoniPerEpal: 200, pezziPerEpal: 200 },
    'Secchio 4kg': { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 },
    'Secchio 5kg': { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 },
    'Secchio 6kg': { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 },
    'Secchio 8kg': { pezziPerCartone: 1, cartoniPerEpal: 36, pezziPerEpal: 36 },
    'Secchio 9kg': { pezziPerCartone: 1, cartoniPerEpal: 36, pezziPerEpal: 36 },
    'Secchio 10kg': { pezziPerCartone: 1, cartoniPerEpal: 72, pezziPerEpal: 72 },
    'Astuccio 100g': { pezziPerCartone: 100, cartoniPerEpal: 1, pezziPerEpal: 100 },
    'Astuccio 700g': { pezziPerCartone: 12, cartoniPerEpal: 72, pezziPerEpal: 864 },
    'Astuccio 2400g': { pezziPerCartone: 4, cartoniPerEpal: 50, pezziPerEpal: 200 },
    'Astuccio 900g': { pezziPerCartone: 12, cartoniPerEpal: 60, pezziPerEpal: 720 },
    'Astuccio 200g': { pezziPerCartone: 8, cartoniPerEpal: 135, pezziPerEpal: 1080 },
    'Flacone 500ml': { pezziPerCartone: 12, cartoniPerEpal: 48, pezziPerEpal: 576 },
    'Flacone Trigger 750ml': { pezziPerCartone: 12, cartoniPerEpal: 40, pezziPerEpal: 480 },
    'Tanica 1000l': { pezziPerCartone: 1, cartoniPerEpal: 1, pezziPerEpal: 1 },
    'Flacone 5l': { pezziPerCartone: 4, cartoniPerEpal: 34, pezziPerEpal: 136 },
    'Fustone 5.6kg': { pezziPerCartone: 1, cartoniPerEpal: 84, pezziPerEpal: 84 },
    'Cartone 400tabs': { pezziPerCartone: 1, cartoniPerEpal: 60, pezziPerEpal: 60 }
  };
  
  return defaults[tipoImballaggio] || { pezziPerCartone: null, cartoniPerEpal: null, pezziPerEpal: null };
};

// Crea un nuovo prodotto
exports.createProdotto = async (req, res) => {
  try {
    const immagini = req.files.map(file => file.path);
    
    // Ottieni i dati del form
    let prodottoData = { ...req.body, immagini };
    
    // Gestisci i valori predefiniti per il tipo di imballaggio
    if (prodottoData.tipoImballaggio) {
      const defaults = getPackagingDefaults(prodottoData.tipoImballaggio);
      
      // Usa i valori predefiniti solo se non sono stati forniti nell'input
      if (!prodottoData.pezziPerCartone) prodottoData.pezziPerCartone = defaults.pezziPerCartone;
      if (!prodottoData.cartoniPerEpal) prodottoData.cartoniPerEpal = defaults.cartoniPerEpal;
      if (!prodottoData.pezziPerEpal) prodottoData.pezziPerEpal = defaults.pezziPerEpal;
    }
    
    // Verifica che la categoria sia valida
    if (!['Domestico', 'Industriale'].includes(prodottoData.categoria)) {
      return res.status(400).json({ message: 'Categoria non valida. Deve essere "Domestico" o "Industriale"' });
    }
    
    // Converti i valori numerici
    if (prodottoData.pezziPerCartone) prodottoData.pezziPerCartone = Number(prodottoData.pezziPerCartone);
    if (prodottoData.cartoniPerEpal) prodottoData.cartoniPerEpal = Number(prodottoData.cartoniPerEpal);
    if (prodottoData.pezziPerEpal) prodottoData.pezziPerEpal = Number(prodottoData.pezziPerEpal);
    if (prodottoData.prezzo) prodottoData.prezzo = Number(prodottoData.prezzo);
    
    // Crea e salva il prodotto
    const prodotto = new ProdottoCatalogo(prodottoData);
    await prodotto.save();
    
    res.status(201).json(prodotto);
  } catch (error) {
    console.error('Errore nella creazione del prodotto:', error);
    res.status(400).json({ message: error.message });
  }
};

// Ottieni tutti i prodotti
exports.getAllProdotti = async (req, res) => {
  try {
    // Opzionalmente filtra per categoria se specificata nella query
    const filter = {};
    if (req.query.categoria && ['Domestico', 'Industriale'].includes(req.query.categoria)) {
      filter.categoria = req.query.categoria;
    }
    
    // Escludi i prodotti "dummy" che iniziano con "_sottocategoria_"
    filter.nome = { $not: { $regex: /^_sottocategoria_/ } };
    
    const prodotti = await ProdottoCatalogo.find(filter);
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img))
      };
    });
    
    res.json(prodottiConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti:', error);
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
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottoObj = prodotto.toObject();
    const prodottoConUrlImmagini = {
      ...prodottoObj,
      immagini: prodotto.immagini.map(img => baseUrl + path.basename(img))
    };

    res.json(prodottoConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero del prodotto:', error);
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
    const { immaginiToRemove } = req.body;
    if (immaginiToRemove && Array.isArray(immaginiToRemove)) {
      immaginiToRemove.forEach(img => {
        const index = prodotto.immagini.indexOf(img);
        if (index > -1) {
          prodotto.immagini.splice(index, 1);
          // Elimina fisicamente l'immagine dal server
          const fullPath = path.resolve(img);
          fs.unlink(fullPath, err => {
            if (err) console.error('Errore durante l\'eliminazione dell\'immagine:', err);
          });
        }
      });
    }

    // Aggiungi nuove immagini se ce ne sono
    if (req.files && req.files.length > 0) {
      prodotto.immagini.push(...req.files.map(file => file.path));
    }

    // Gestisci i valori di imballaggio aggiornati
    if (req.body.tipoImballaggio && req.body.tipoImballaggio !== prodotto.tipoImballaggio) {
      const defaults = getPackagingDefaults(req.body.tipoImballaggio);
      
      // Aggiorna con i valori predefiniti solo se non sono stati esplicitamente forniti
      if (!req.body.pezziPerCartone) req.body.pezziPerCartone = defaults.pezziPerCartone;
      if (!req.body.cartoniPerEpal) req.body.cartoniPerEpal = defaults.cartoniPerEpal;
      if (!req.body.pezziPerEpal) req.body.pezziPerEpal = defaults.pezziPerEpal;
    }

    // Verifica che la categoria sia valida
    if (req.body.categoria && !['Domestico', 'Industriale'].includes(req.body.categoria)) {
      return res.status(400).json({ message: 'Categoria non valida. Deve essere "Domestico" o "Industriale"' });
    }
    
    // Rimuovi il campo immaginiToRemove che non è nel modello
    delete req.body.immaginiToRemove;
    
    // Converti i valori numerici
    if (req.body.pezziPerCartone) req.body.pezziPerCartone = Number(req.body.pezziPerCartone);
    if (req.body.cartoniPerEpal) req.body.cartoniPerEpal = Number(req.body.cartoniPerEpal);
    if (req.body.pezziPerEpal) req.body.pezziPerEpal = Number(req.body.pezziPerEpal);
    if (req.body.prezzo) req.body.prezzo = Number(req.body.prezzo);

    // Aggiorna gli altri campi del prodotto
    Object.keys(req.body).forEach(key => {
      prodotto[key] = req.body[key];
    });
    
    await prodotto.save();

    // Restituisci il prodotto aggiornato
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottoObj = prodotto.toObject();
    const prodottoRisposta = {
      ...prodottoObj,
      immagini: prodotto.immagini.map(img => baseUrl + path.basename(img))
    };

    res.json(prodottoRisposta);
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del prodotto:', error);
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
      // Usa path.resolve per ottenere un percorso assoluto
      const fullPath = path.resolve(img);
      fs.unlink(fullPath, err => {
        if (err) console.error('Errore durante l\'eliminazione dell\'immagine:', err);
      });
    });

    await ProdottoCatalogo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Prodotto cancellato' });
  } catch (error) {
    console.error('Errore durante l\'eliminazione del prodotto:', error);
    res.status(500).json({ message: error.message });
  }
};

// Ottieni prodotti per categoria
exports.getProdottiByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    // Escludi i prodotti "dummy" che iniziano con "_sottocategoria_"
    const prodotti = await ProdottoCatalogo.find({ 
      categoria,
      nome: { $not: { $regex: /^_sottocategoria_/ } }
    });
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img))
      };
    });
    
    res.json(prodottiConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti per categoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Ottieni prodotti per sottocategoria
exports.getProdottiBySottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    // Escludi i prodotti "dummy" che iniziano con "_sottocategoria_"
    const prodotti = await ProdottoCatalogo.find({
      categoria,
      sottocategoria,
      nome: { $not: { $regex: /^_sottocategoria_/ } }
    });
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img))
      };
    });
    
    res.json(prodottiConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti per sottocategoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// FUNZIONI PER GESTIRE LE SOTTOCATEGORIE

// Ottieni tutte le sottocategorie per entrambe le categorie
exports.getAllSottocategorie = async (req, res) => {
  try {
    // Ottieni i prodotti per trovare tutte le sottocategorie uniche
    const prodotti = await ProdottoCatalogo.find(
      // Includi solo i documenti con nome che inizia con "_sottocategoria_" per ottenere solo le sottocategorie
      { nome: { $regex: /^_sottocategoria_/ } }, 
      'categoria sottocategoria'
    );
    
    // Crea un oggetto per tenere traccia delle sottocategorie per categoria
    const sottocategorie = {
      'Domestico': [],
      'Industriale': []
    };
    
    // Aggiungi le sottocategorie alle rispettive categorie
    prodotti.forEach(prodotto => {
      if (prodotto.sottocategoria && !sottocategorie[prodotto.categoria].includes(prodotto.sottocategoria)) {
        sottocategorie[prodotto.categoria].push(prodotto.sottocategoria);
      }
    });
    
    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie:', error);
    res.status(500).json({ message: error.message });
  }
};

// Ottieni tutte le sottocategorie per una categoria specifica
exports.getSottocategorieByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    // Ottieni tutti i prodotti della categoria con nome che inizia con "_sottocategoria_"
    const prodotti = await ProdottoCatalogo.find(
      { 
        categoria, 
        nome: { $regex: /^_sottocategoria_/ } 
      }, 
      'sottocategoria'
    );
    
    // Crea un array di sottocategorie uniche
    const sottocategorie = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria))].filter(Boolean);
    
    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie per categoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Aggiungi una nuova sottocategoria
exports.addSottocategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const { sottocategoria } = req.body;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    if (!sottocategoria) {
      return res.status(400).json({ message: 'Il nome della sottocategoria è richiesto' });
    }
    
    // Verifica se la sottocategoria esiste già per questa categoria
    const esistente = await ProdottoCatalogo.findOne({ 
      categoria, 
      sottocategoria,
      nome: { $regex: /^_sottocategoria_/ } 
    });
    
    if (esistente) {
      return res.status(400).json({ message: 'Questa sottocategoria esiste già per questa categoria' });
    }
    
    // Crea un prodotto "dummy" con questa sottocategoria per mantenere una traccia
    // ma lo contrassegnamo in modo che possa essere facilmente filtrato nelle query
    const dummyProdotto = new ProdottoCatalogo({
      nome: `_sottocategoria_${sottocategoria}`,
      codice: `_sottocategoria_${Date.now()}`,
      tipo: 'DUMMY',
      prezzo: 0,
      unita: '€/PZ',
      categoria,
      sottocategoria,
      tipoImballaggio: 'Barattolo 1kg',
      pezziPerCartone: 1,
      cartoniPerEpal: 1,
      pezziPerEpal: 1,
      descrizione: `Prodotto dummy per la sottocategoria ${sottocategoria}`,
      immagini: []
    });
    
    await dummyProdotto.save();
    
    // Ottieni tutte le sottocategorie aggiornate per questa categoria
    // Ottieni tutti i prodotti della categoria
    const prodotti = await ProdottoCatalogo.find(
      { 
        categoria, 
        nome: { $regex: /^_sottocategoria_/ } 
      }, 
      'sottocategoria'
    );
    
    // Crea un array di sottocategorie uniche
    const sottocategorieAggiornate = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria))].filter(Boolean);
    
    res.status(201).json(sottocategorieAggiornate);
  } catch (error) {
    console.error('Errore nell\'aggiunta della sottocategoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Elimina una sottocategoria
exports.deleteSottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    // Trova tutti i prodotti "dummy" per questa sottocategoria
    const prodottiDummy = await ProdottoCatalogo.find({ 
      categoria, 
      sottocategoria,
      nome: { $regex: /^_sottocategoria_/ }
    });
    
    if (prodottiDummy.length === 0) {
      return res.status(404).json({ message: 'Sottocategoria non trovata' });
    }
    
    // Elimina tutti i prodotti "dummy" per questa sottocategoria
    await ProdottoCatalogo.deleteMany({ 
      categoria, 
      sottocategoria,
      nome: { $regex: /^_sottocategoria_/ }
    });
    
    // Aggiorna tutti i prodotti reali per rimuovere la sottocategoria
    const risultatoAggiornamento = await ProdottoCatalogo.updateMany(
      { 
        categoria, 
        sottocategoria,
        nome: { $not: { $regex: /^_sottocategoria_/ } }
      },
      { $set: { sottocategoria: null } }
    );
    
    res.status(200).json({ 
      message: 'Sottocategoria eliminata con successo',
      prodottiAggiornati: risultatoAggiornamento.modifiedCount
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della sottocategoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Rinomina una sottocategoria
exports.updateSottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;
    const { nuovoNome } = req.body;
    
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    
    if (!nuovoNome) {
      return res.status(400).json({ message: 'Il nuovo nome della sottocategoria è richiesto' });
    }
    
    // Verifica se la sottocategoria esiste
    const prodottiDummy = await ProdottoCatalogo.find({ 
      categoria, 
      sottocategoria,
      nome: { $regex: /^_sottocategoria_/ }
    });
    
    if (prodottiDummy.length === 0) {
      return res.status(404).json({ message: 'Sottocategoria non trovata' });
    }
    
    // Verifica se il nuovo nome della sottocategoria è già in uso
    const esistente = await ProdottoCatalogo.findOne({ 
      categoria, 
      sottocategoria: nuovoNome,
      nome: { $regex: /^_sottocategoria_/ }
    });
    
    if (esistente) {
      return res.status(400).json({ message: 'Il nuovo nome della sottocategoria è già in uso' });
    }
    
    // Aggiorna i prodotti "dummy" con il nuovo nome della sottocategoria
    await ProdottoCatalogo.updateMany(
      { 
        categoria, 
        sottocategoria,
        nome: { $regex: /^_sottocategoria_/ }
      },
      { 
        $set: { 
          sottocategoria: nuovoNome,
          nome: `_sottocategoria_${nuovoNome}`,
          descrizione: `Prodotto dummy per la sottocategoria ${nuovoNome}`
        } 
      }
    );
    
    // Aggiorna tutti i prodotti reali con il nuovo nome della sottocategoria
    const risultatoAggiornamento = await ProdottoCatalogo.updateMany(
      { 
        categoria, 
        sottocategoria,
        nome: { $not: { $regex: /^_sottocategoria_/ } }
      },
      { $set: { sottocategoria: nuovoNome } }
    );
    
    res.status(200).json({ 
      message: 'Sottocategoria rinominata con successo',
      prodottiAggiornati: risultatoAggiornamento.modifiedCount
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della sottocategoria:', error);
    res.status(500).json({ message: error.message });
  }
};