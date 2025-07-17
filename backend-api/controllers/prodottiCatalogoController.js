// backend-api/controllers/prodottiCatalogoController.js
const ProdottoCatalogo = require('../models/prodottoCatalogo');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload'); // La tua utility
const cloudinary = require('cloudinary').v2;
const { translateText } = require('../utils/translationService');

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
    const immaginiCloudinary = [];
    // Carica le immagini su Cloudinary se presenti
    if (req.files && req.files.length > 0) {
      console.log(`Uploading ${req.files.length} files...`);
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(
            file.buffer,       // Buffer del file
            'product_images',  // Cartella su Cloudinary
            'image'            // Tipo di risorsa
          );
          immaginiCloudinary.push(result.secure_url);
          console.log(`Uploaded ${file.originalname} to ${result.public_id}`);
        } catch (uploadError) {
          console.error(`Failed to upload ${file.originalname}:`, uploadError);
          // Decidi se interrompere o continuare in caso di errore di upload parziale
          // Qui continuiamo, ma potresti voler restituire un errore 400
        }
      }
    }

    // Prepara i dati del prodotto
    let prodottoData = {
      ...req.body,
      immagini: immaginiCloudinary // Array di oggetti { url, publicId }
    };

    // Applica valori di default per imballaggio
    if (prodottoData.tipoImballaggio) {
      const defaults = getPackagingDefaults(prodottoData.tipoImballaggio);
      if (prodottoData.pezziPerCartone === undefined || prodottoData.pezziPerCartone === null || prodottoData.pezziPerCartone === '') prodottoData.pezziPerCartone = defaults.pezziPerCartone;
      if (prodottoData.cartoniPerEpal === undefined || prodottoData.cartoniPerEpal === null || prodottoData.cartoniPerEpal === '') prodottoData.cartoniPerEpal = defaults.cartoniPerEpal;
      if (prodottoData.pezziPerEpal === undefined || prodottoData.pezziPerEpal === null || prodottoData.pezziPerEpal === '') prodottoData.pezziPerEpal = defaults.pezziPerEpal;
    }

    // Validazione categoria
    if (!prodottoData.categoria || !['Domestico', 'Industriale'].includes(prodottoData.categoria)) {
      // Se fallisce qui, le immagini già caricate rimarranno su Cloudinary.
      // Considera una logica di cleanup se necessario.
      return res.status(400).json({ message: 'Categoria non valida o mancante. Deve essere "Domestico" o "Industriale".' });
    }

    // Conversione tipi numerici (assicurati che i campi vuoti diventino null o gestiscili)
    prodottoData.pezziPerCartone = prodottoData.pezziPerCartone ? Number(prodottoData.pezziPerCartone) : null;
    prodottoData.cartoniPerEpal = prodottoData.cartoniPerEpal ? Number(prodottoData.cartoniPerEpal) : null;
    prodottoData.pezziPerEpal = prodottoData.pezziPerEpal ? Number(prodottoData.pezziPerEpal) : null;
    prodottoData.prezzo = prodottoData.prezzo ? Number(prodottoData.prezzo) : null;

    // Traduci nome e descrizione
    const [translatedNome, translatedDescrizione] = await Promise.all([
      translateText(prodottoData.nome),
      translateText(prodottoData.descrizione)
    ]);

    prodottoData.nome = translatedNome;
    prodottoData.descrizione = translatedDescrizione;

    // Crea e salva il prodotto nel database
    const prodotto = new ProdottoCatalogo(prodottoData);
    await prodotto.save();

    console.log(`Product created successfully with ID: ${prodotto._id}`);
    res.status(201).json(prodotto);

  } catch (error) {
    console.error('Errore nella creazione del prodotto:', error);
    // Potrebbe essere utile loggare req.body per debug (escludendo dati sensibili)
    // console.error('Request Body:', req.body);

    // Se l'errore avviene dopo l'upload, potresti voler eliminare le immagini caricate.
    // Implementa logica di rollback/cleanup se necessario. Esempio:
    // if (immaginiCloudinary && immaginiCloudinary.length > 0) {
    //   console.log('Rolling back Cloudinary uploads due to error...');
    //   const idsToDelete = immaginiCloudinary.map(img => img.publicId);
    //   cloudinary.api.delete_resources(idsToDelete, { resource_type: 'image' })
    //     .catch(cleanupErr => console.error('Error during Cloudinary cleanup:', cleanupErr));
    // }

    res.status(400).json({ message: `Errore nella creazione del prodotto: ${error.message}` });
  }
};


// Ottieni tutti i prodotti
exports.getAllProdotti = async (req, res) => {
  try {
    const filter = {};
    // Filtro per categoria
    if (req.query.categoria && ['Domestico', 'Industriale'].includes(req.query.categoria)) {
      filter.categoria = req.query.categoria;
    }
    // Escludi prodotti "dummy" per sottocategorie
    filter.nome = { $not: { $regex: /^_sottocategoria_/ } };

    const prodotti = await ProdottoCatalogo.find(filter);

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
      };
    });

    res.json(prodottiPerAdmin);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti:', error);
    res.status(500).json({ message: `Errore nel recupero dei prodotti: ${error.message}` });
  }
};


// Ottieni un prodotto per ID
exports.getProdottoById = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    const prodottoPerAdmin = prodotto.toObject();
    prodottoPerAdmin.nome = prodottoPerAdmin.nome.it;
    prodottoPerAdmin.descrizione = prodottoPerAdmin.descrizione.it;

    res.json(prodottoPerAdmin);
  } catch (error) {
    console.error(`Errore nel recupero del prodotto ${req.params.id}:`, error);
    res.status(500).json({ message: `Errore nel recupero del prodotto: ${error.message}` });
  }
};

// Aggiorna un prodotto
// Aggiorna un prodotto
exports.updateProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    // 1. Rimuovi Immagini Esistenti (da Cloudinary e DB)
    // Assumi che `immaginiToRemove` sia un array di publicId
    const { immaginiToRemove } = req.body;
    let currentImages = [...prodotto.immagini]; // Copia l'array corrente

    if (immaginiToRemove && Array.isArray(immaginiToRemove) && immaginiToRemove.length > 0) {
      const publicIdsToRemove = immaginiToRemove;
      console.log(`Removing images with publicIds: ${publicIdsToRemove.join(', ')}`);

      // Elimina da Cloudinary
      try {
         // Nota: delete_resources è più efficiente per eliminazioni multiple
        const deleteResult = await cloudinary.api.delete_resources(publicIdsToRemove, { resource_type: 'image' });
        console.log('Cloudinary deletion result:', deleteResult);
        // Verifica quali sono state effettivamente eliminate o se ci sono errori parziali
        // const deletedIds = Object.keys(deleteResult.deleted);
        // const failedDeletions = publicIdsToRemove.filter(id => !deletedIds.includes(id));
        // if(failedDeletions.length > 0) console.warn(`Failed to delete from Cloudinary: ${failedDeletions.join(', ')}`);

      } catch (cloudinaryError) {
        console.error('Errore durante l\'eliminazione bulk da Cloudinary:', cloudinaryError);
        // Potresti voler interrompere l'aggiornamento o solo loggare l'errore
      }

      // Filtra l'array nel DB
      currentImages = currentImages.filter(img => !publicIdsToRemove.includes(img.publicId));
    }

    // 2. Aggiungi Nuove Immagini (a Cloudinary e DB)
    if (req.files && req.files.length > 0) {
       console.log(`Uploading ${req.files.length} new files for update...`);
       for (const file of req.files) {
         try {
           const result = await uploadToCloudinary(file.buffer, 'product_images', 'image');
           currentImages.push({
             url: result.secure_url,
             publicId: result.public_id
           });
           console.log(`Uploaded new image ${file.originalname} to ${result.public_id}`);
         } catch (uploadError) {
           console.error(`Failed to upload new image ${file.originalname}:`, uploadError);
           // Gestisci errore di upload parziale
         }
       }
    }

    // Assegna l'array aggiornato al prodotto
    prodotto.immagini = currentImages;


    // 3. Aggiorna Altri Campi del Prodotto
    const updateData = { ...req.body };
    delete updateData.immaginiToRemove; // Rimuovi campo non pertinente allo schema
    delete updateData.immagini; // Rimuovi campo immagini (gestito separatamente sopra)


    // Gestisci valori di imballaggio aggiornati
    if (updateData.tipoImballaggio && updateData.tipoImballaggio !== prodotto.tipoImballaggio) {
      const defaults = getPackagingDefaults(updateData.tipoImballaggio);
      if (updateData.pezziPerCartone === undefined || updateData.pezziPerCartone === null || updateData.pezziPerCartone === '') updateData.pezziPerCartone = defaults.pezziPerCartone;
      if (updateData.cartoniPerEpal === undefined || updateData.cartoniPerEpal === null || updateData.cartoniPerEpal === '') updateData.cartoniPerEpal = defaults.cartoniPerEpal;
      if (updateData.pezziPerEpal === undefined || updateData.pezziPerEpal === null || updateData.pezziPerEpal === '') updateData.pezziPerEpal = defaults.pezziPerEpal;
    }

    // Validazione categoria
    if (updateData.categoria && !['Domestico', 'Industriale'].includes(updateData.categoria)) {
      return res.status(400).json({ message: 'Categoria non valida. Deve essere "Domestico" o "Industriale"' });
    }

    // Conversione tipi numerici per i campi aggiornati
    if (updateData.pezziPerCartone !== undefined) updateData.pezziPerCartone = updateData.pezziPerCartone ? Number(updateData.pezziPerCartone) : null;
    if (updateData.cartoniPerEpal !== undefined) updateData.cartoniPerEpal = updateData.cartoniPerEpal ? Number(updateData.cartoniPerEpal) : null;
    if (updateData.pezziPerEpal !== undefined) updateData.pezziPerEpal = updateData.pezziPerEpal ? Number(updateData.pezziPerEpal) : null;
    if (updateData.prezzo !== undefined) updateData.prezzo = updateData.prezzo ? Number(updateData.prezzo) : null;


    // Se il nome o la descrizione vengono aggiornati, traducili
    if (updateData.nome) {
      updateData.nome = await translateText(updateData.nome);
    }
    if (updateData.descrizione) {
      updateData.descrizione = await translateText(updateData.descrizione);
    }

    // Applica gli aggiornamenti al documento Mongoose
    Object.keys(updateData).forEach(key => {
       // Evita di sovrascrivere _id o altri campi protetti se necessario
       if (prodotto[key] !== undefined && key !== '_id') {
         prodotto[key] = updateData[key];
       }
    });

    // 4. Salva il prodotto aggiornato
    await prodotto.save();

    console.log(`Product updated successfully: ${prodotto._id}`);
    res.json(prodotto); // Restituisci il prodotto aggiornato

  } catch (error) {
    console.error(`Errore durante l'aggiornamento del prodotto ${req.params.id}:`, error);
    // console.error('Request Body:', req.body); // Log per debug
    res.status(400).json({ message: `Errore durante l'aggiornamento del prodotto: ${error.message}` });
  }
};


// Cancella un prodotto
// Cancella un prodotto
exports.deleteProdotto = async (req, res) => {
  try {
    const prodotto = await ProdottoCatalogo.findById(req.params.id);
    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    // 1. Elimina Immagini da Cloudinary
    if (prodotto.immagini && prodotto.immagini.length > 0) {
      const publicIdsToDelete = prodotto.immagini.map(img => img.publicId);
      console.log(`Deleting ${publicIdsToDelete.length} images from Cloudinary for product ${prodotto._id}...`);
      try {
        // Usa delete_resources per efficienza
        await cloudinary.api.delete_resources(publicIdsToDelete, { resource_type: 'image' });
        console.log(`Cloudinary images deleted for product ${prodotto._id}`);
      } catch (cloudinaryError) {
        console.error(`Errore durante l'eliminazione delle immagini da Cloudinary per il prodotto ${prodotto._id}:`, cloudinaryError);
        // Decidi se procedere comunque con l'eliminazione dal DB o restituire errore
        // Qui procediamo, ma logghiamo l'errore
      }
    }

    // 2. Elimina Prodotto dal Database
    await ProdottoCatalogo.findByIdAndDelete(req.params.id);

    console.log(`Product deleted successfully: ${req.params.id}`);
    res.json({ message: 'Prodotto cancellato con successo' });

  } catch (error) {
    console.error(`Errore durante l'eliminazione del prodotto ${req.params.id}:`, error);
    res.status(500).json({ message: `Errore durante l'eliminazione del prodotto: ${error.message}` });
  }
};

// Ottieni prodotti per categoria
exports.getProdottiByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    const prodotti = await ProdottoCatalogo.find({
      categoria,
      nome: { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
      };
    });

    res.json(prodottiPerAdmin);
  } catch (error) {
    console.error(`Errore nel recupero prodotti per categoria ${req.params.categoria}:`, error);
    res.status(500).json({ message: `Errore nel recupero prodotti per categoria: ${error.message}` });
  }
};

// Ottieni prodotti per sottocategoria
exports.getProdottiBySottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;
    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }
    if (!sottocategoria) {
       return res.status(400).json({ message: 'Sottocategoria mancante' });
    }

    const prodotti = await ProdottoCatalogo.find({
      categoria,
      sottocategoria,
      nome: { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
      };
    });

    res.json(prodottiPerAdmin);
  } catch (error) {
    console.error(`Errore nel recupero prodotti per sottocategoria ${req.params.categoria}/${req.params.sottocategoria}:`, error);
    res.status(500).json({ message: `Errore nel recupero prodotti per sottocategoria: ${error.message}` });
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

// Funzione per il pubblico con selezione della lingua
exports.getPublicProdotti = async (req, res) => {
  try {
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    const prodotti = await ProdottoCatalogo.find({ nome: { $not: { $regex: /^_sottocategoria_/ } } });

    const translatedProdotti = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome[lang] || prodotto.nome.it,
        descrizione: prodotto.descrizione[lang] || prodotto.descrizione.it,
      };
    });

    res.json(translatedProdotti);
  } catch (error) {
    console.error('Errore nel recupero dei prodotti pubblici:', error);
    res.status(500).json({ message: `Errore nel recupero dei prodotti: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere un singolo prodotto con selezione della lingua
exports.getPublicProdottoById = async (req, res) => {
  try {
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    const prodotto = await ProdottoCatalogo.findById(req.params.id);

    if (!prodotto) {
      return res.status(404).json({ message: 'Prodotto non trovato' });
    }

    const translatedProdotto = prodotto.toObject();
    translatedProdotto.nome = translatedProdotto.nome[lang] || translatedProdotto.nome.it;
    translatedProdotto.descrizione = translatedProdotto.descrizione[lang] || translatedProdotto.descrizione.it;

    res.json(translatedProdotto);
  } catch (error) {
    console.error(`Errore nel recupero del prodotto pubblico ${req.params.id}:`, error);
    res.status(500).json({ message: `Errore nel recupero del prodotto: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere tutte le categorie
exports.getPublicCategories = async (req, res) => {
  try {
    const categorie = await ProdottoCatalogo.distinct('categoria', { nome: { $not: { $regex: /^_sottocategoria_/ } } });
    res.json(categorie);
  } catch (error) {
    console.error('Errore nel recupero delle categorie pubbliche:', error);
    res.status(500).json({ message: `Errore nel recupero delle categorie: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere una singola categoria per ID (non applicabile direttamente, ma per coerenza)
exports.getPublicCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // Per le categorie, non abbiamo un ID univoco come per i prodotti, ma un nome.
    // Questa funzione potrebbe essere usata per validare l'esistenza di una categoria.
    const exists = await ProdottoCatalogo.exists({ categoria: categoryId });
    if (!exists) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }
    res.json({ category: categoryId });
  } catch (error) {
    console.error(`Errore nel recupero della categoria pubblica ${req.params.categoryId}:`, error);
    res.status(500).json({ message: `Errore nel recupero della categoria: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere tutte le sottocategorie
exports.getPublicAllSubcategories = async (req, res) => {
  try {
    const sottocategorie = {
      'Domestico': [],
      'Industriale': []
    };

    const prodotti = await ProdottoCatalogo.find(
      { nome: { $regex: /^_sottocategoria_/ } },
      'categoria sottocategoria'
    );

    prodotti.forEach(prodotto => {
      if (prodotto.sottocategoria && !sottocategorie[prodotto.categoria].includes(prodotto.sottocategoria)) {
        sottocategorie[prodotto.categoria].push(prodotto.sottocategoria);
      }
    });

    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie pubbliche:', error);
    res.status(500).json({ message: error.message });
  }
};

// Funzione per il pubblico per ottenere le sottocategorie per una categoria specifica
exports.getPublicSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoria } = req.params;

    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    const prodotti = await ProdottoCatalogo.find(
      {
        categoria,
        nome: { $regex: /^_sottocategoria_/ }
      },
      'sottocategoria'
    );

    const sottocategorie = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria))].filter(Boolean);

    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie pubbliche per categoria:', error);
    res.status(500).json({ message: error.message });
  }
};