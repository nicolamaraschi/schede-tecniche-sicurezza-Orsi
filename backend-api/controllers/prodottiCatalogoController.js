// backend-api/controllers/prodottiCatalogoController.js
const ProdottoCatalogo = require('../models/ProdottoCatalogo');
const Category = require('../models/category'); // Importa il modello Category
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
    
    // Verifica che la categoria esista se è stata fornita
    if (prodottoData.categoria) {
      const categoria = await Category.findById(prodottoData.categoria);
      if (!categoria) {
        return res.status(400).json({ message: 'Categoria non valida' });
      }
      
      // Imposta la sottocategoria se fornita
      if (prodottoData.sottocategoriaId) {
        const sottocategoria = categoria.subcategories.find(
          sub => sub.id.toString() === prodottoData.sottocategoriaId
        );
        
        if (sottocategoria) {
          prodottoData.sottocategoria = {
            id: sottocategoria.id,
            name: sottocategoria.name
          };
        } else {
          return res.status(400).json({ message: 'Sottocategoria non valida per la categoria selezionata' });
        }
      }
    }
    
    // Rimuovi il campo sottocategoriaId che non è nel modello
    delete prodottoData.sottocategoriaId;
    
    // Verifica che la macroCategoria sia valida
    if (prodottoData.macroCategoria && !['Linea Casa', 'Linea Industriale'].includes(prodottoData.macroCategoria)) {
      return res.status(400).json({ message: 'Macro-categoria non valida' });
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
    // Opzionalmente filtra per macro-categoria se specificata nella query
    const filter = {};
    if (req.query.macroCategoria && ['Linea Casa', 'Linea Industriale'].includes(req.query.macroCategoria)) {
      filter.macroCategoria = req.query.macroCategoria;
    }
    
    const prodotti = await ProdottoCatalogo.find(filter).populate('categoria');
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img)),
        categoriaName: prodottoObj.categoria ? prodottoObj.categoria.name : null
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
    const prodotto = await ProdottoCatalogo.findById(req.params.id).populate('categoria');
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottoObj = prodotto.toObject();
    const prodottoConUrlImmagini = {
      ...prodottoObj,
      immagini: prodotto.immagini.map(img => baseUrl + path.basename(img)),
      categoriaName: prodottoObj.categoria ? prodottoObj.categoria.name : null
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
          // Nota: usa path.resolve per assicurare un percorso assoluto
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

    // Gestisci categoria e sottocategoria
    if (req.body.categoria) {
      const categoria = await Category.findById(req.body.categoria);
      if (!categoria) {
        return res.status(400).json({ message: 'Categoria non valida' });
      }
      
      // Se è stata specificata una sottocategoria
      if (req.body.sottocategoriaId) {
        const sottocategoria = categoria.subcategories.find(
          sub => sub.id.toString() === req.body.sottocategoriaId
        );
        
        if (sottocategoria) {
          req.body.sottocategoria = {
            id: sottocategoria.id,
            name: sottocategoria.name
          };
        } else {
          return res.status(400).json({ message: 'Sottocategoria non valida per la categoria selezionata' });
        }
      } else {
        // Se non è specificata, rimuovi la sottocategoria esistente
        req.body.sottocategoria = undefined;
      }
    }
    
    // Rimuovi il campo sottocategoriaId che non è nel modello
    delete req.body.sottocategoriaId;
    // Rimuovi il campo immaginiToRemove che non è nel modello
    delete req.body.immaginiToRemove;
    
    // Verifica che la macroCategoria sia valida
    if (req.body.macroCategoria && !['Linea Casa', 'Linea Industriale'].includes(req.body.macroCategoria)) {
      return res.status(400).json({ message: 'Macro-categoria non valida' });
    }
    
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

// Ottieni prodotti per macro-categoria
exports.getProdottiByMacroCategoria = async (req, res) => {
  try {
    const { macroCategoria } = req.params;
    
    if (!['Linea Casa', 'Linea Industriale'].includes(macroCategoria)) {
      return res.status(400).json({ message: 'Macro-categoria non valida' });
    }
    
    const prodotti = await ProdottoCatalogo.find({ macroCategoria }).populate('categoria');
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img)),
        categoriaName: prodottoObj.categoria ? prodottoObj.categoria.name : null
      };
    });
    
    res.json(prodottiConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti per macro-categoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Ottieni prodotti per categoria
exports.getProdottiByCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    
    const prodotti = await ProdottoCatalogo.find({ categoria: categoriaId }).populate('categoria');
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img)),
        categoriaName: prodottoObj.categoria ? prodottoObj.categoria.name : null
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
    const { categoriaId, sottocategoriaId } = req.params;
    
    const prodotti = await ProdottoCatalogo.find({
      categoria: categoriaId,
      'sottocategoria.id': sottocategoriaId
    }).populate('categoria');
    
    // Aggiungi l'URL base per le immagini
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
    const prodottiConUrlImmagini = prodotti.map(prodotto => {
      const prodottoObj = prodotto.toObject();
      return {
        ...prodottoObj,
        immagini: prodotto.immagini.map(img => baseUrl + path.basename(img)),
        categoriaName: prodottoObj.categoria ? prodottoObj.categoria.name : null
      };
    });
    
    res.json(prodottiConUrlImmagini);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti per sottocategoria:', error);
    res.status(500).json({ message: error.message });
  }
};