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

    // Traduci categoria e sottocategoria
    console.log(`[createProdotto] Original categoria: ${prodottoData.categoria}, sottocategoria: ${prodottoData.sottocategoria}`);
    const [translatedCategoria, translatedSottocategoria] = await Promise.all([
      translateText(prodottoData.categoria),
      prodottoData.sottocategoria ? translateText(prodottoData.sottocategoria) : Promise.resolve(null)
    ]);
    console.log(`[createProdotto] Translated categoria:`, translatedCategoria);
    console.log(`[createProdotto] Translated sottocategoria:`, translatedSottocategoria);

    prodottoData.categoria = translatedCategoria;
    prodottoData.sottocategoria = translatedSottocategoria;

    // Validazione categoria (sulla versione italiana)
    if (!prodottoData.categoria.it || !['Domestico', 'Industriale'].includes(prodottoData.categoria.it)) {
      return res.status(400).json({ message: 'Categoria non valida o mancante. Deve essere "Domestico" o "Industriale".' });
    }

    // Conversione tipi numerici (assicurati che i campi vuoti diventino null o gestiscili)
    prodottoData.pezziPerCartone = prodottoData.pezziPerCartone ? Number(prodottoData.pezziPerCartone) : null;
    prodottoData.cartoniPerEpal = prodottoData.cartoniPerEpal ? Number(prodottoData.cartoniPerEpal) : null;
    prodottoData.pezziPerEpal = prodottoData.pezziPerEpal ? Number(prodottoData.pezziPerEpal) : null;
    prodottoData.prezzo = prodottoData.prezzo ? Number(prodottoData.prezzo) : null;

    // Traduci nome e descrizione
    console.log(`[createProdotto] Original nome: ${prodottoData.nome}, descrizione: ${prodottoData.descrizione}`);
    const [translatedNome, translatedDescrizione] = await Promise.all([
      translateText(prodottoData.nome),
      translateText(prodottoData.descrizione)
    ]);
    console.log(`[createProdotto] Translated nome:`, translatedNome);
    console.log(`[createProdotto] Translated descrizione:`, translatedDescrizione);

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
      filter['categoria.it'] = req.query.categoria; // Filtra sulla versione italiana
    }
    // Escludi prodotti "dummy" per sottocategorie
    filter['nome.it'] = { $not: { $regex: /^_sottocategoria_/ } };

    const prodotti = await ProdottoCatalogo.find(filter);

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
        categoria: prodotto.categoria && typeof prodotto.categoria === 'object' && prodotto.categoria.it ? prodotto.categoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
        sottocategoria: prodotto.sottocategoria && typeof prodotto.sottocategoria === 'object' && prodotto.sottocategoria.it ? prodotto.sottocategoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
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
    prodottoPerAdmin.categoria = prodottoPerAdmin.categoria && typeof prodottoPerAdmin.categoria === 'object' && prodottoPerAdmin.categoria.it ? prodottoPerAdmin.categoria.it : 'N/A'; // Restituisci solo la versione italiana o N/A
    prodottoPerAdmin.sottocategoria = prodottoPerAdmin.sottocategoria && typeof prodottoPerAdmin.sottocategoria === 'object' && prodottoPerAdmin.sottocategoria.it ? prodottoPerAdmin.sottocategoria.it : 'N/A'; // Restituisci solo la versione italiana o N/A

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

    // Se la categoria viene aggiornata, traducila e validala
    if (Object.prototype.hasOwnProperty.call(updateData, 'categoria')) {
      console.log(`[updateProdotto] Original categoria for update: ${updateData.categoria}`);
      const translatedCategoria = await translateText(updateData.categoria);
      console.log(`[updateProdotto] Translated categoria for update:`, translatedCategoria);
      Object.assign(prodotto.categoria, translatedCategoria);
      delete updateData.categoria; // Rimuovi da updateData per evitare sovrascrittura diretta
      if (!translatedCategoria.it || !['Domestico', 'Industriale'].includes(translatedCategoria.it)) {
        return res.status(400).json({ message: 'Categoria non valida. Deve essere "Domestico" o "Industriale"' });
      }
    }

    // Se la sottocategoria viene aggiornata, traducila
    if (Object.prototype.hasOwnProperty.call(updateData, 'sottocategoria')) {
      console.log(`[updateProdotto] Original sottocategoria for update: ${updateData.sottocategoria}`);
      const translatedSottocategoria = await translateText(updateData.sottocategoria);
      console.log(`[updateProdotto] Translated sottocategoria for update:`, translatedSottocategoria);
      Object.assign(prodotto.sottocategoria, translatedSottocategoria);
      delete updateData.sottocategoria; // Rimuovi da updateData per evitare sovrascrittura diretta
    }

    // Conversione tipi numerici per i campi aggiornati
    if (updateData.pezziPerCartone !== undefined) updateData.pezziPerCartone = Number(updateData.pezziPerCartone) || null;
    if (updateData.cartoniPerEpal !== undefined) updateData.cartoniPerEpal = Number(updateData.cartoniPerEpal) || null;
    if (updateData.pezziPerEpal !== undefined) updateData.pezziPerEpal = Number(updateData.pezziPerEpal) || null;
    if (updateData.prezzo !== undefined) updateData.prezzo = Number(updateData.prezzo) || null;


    // Se il nome o la descrizione vengono aggiornati, traducili
    if (updateData.nome) {
      console.log(`[updateProdotto] Original nome for update: ${updateData.nome}`);
      const translatedNome = await translateText(updateData.nome);
      console.log(`[updateProdotto] Translated nome for update:`, translatedNome);
      Object.assign(prodotto.nome, translatedNome);
      delete updateData.nome;
    }
    if (updateData.descrizione) {
      console.log(`[updateProdotto] Original descrizione for update: ${updateData.descrizione}`);
      const translatedDescrizione = await translateText(updateData.descrizione);
      console.log(`[updateProdotto] Translated descrizione for update:`, translatedDescrizione);
      Object.assign(prodotto.descrizione, translatedDescrizione);
      delete updateData.descrizione;
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
        console.error(`Errore durante l\'eliminazione delle immagini da Cloudinary per il prodotto ${prodotto._id}:`, cloudinaryError);
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
      'categoria.it': categoria, // Filtra sulla versione italiana
      'nome.it': { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
        categoria: prodotto.categoria && typeof prodotto.categoria === 'object' && prodotto.categoria.it ? prodotto.categoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
        sottocategoria: prodotto.sottocategoria && typeof prodotto.sottocategoria === 'object' && prodotto.sottocategoria.it ? prodotto.sottocategoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
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
      'categoria.it': categoria, // Filtra sulla versione italiana
      'sottocategoria.it': sottocategoria, // Filtra sulla versione italiana
      'nome.it': { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const prodottiPerAdmin = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome.it,
        descrizione: prodotto.descrizione.it,
        categoria: prodotto.categoria && typeof prodotto.categoria === 'object' && prodotto.categoria.it ? prodotto.categoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
        sottocategoria: prodotto.sottocategoria && typeof prodotto.sottocategoria === 'object' && prodotto.sottocategoria.it ? prodotto.sottocategoria.it : 'N/A', // Restituisci solo la versione italiana o N/A
      };
    });

    res.json(prodottiPerAdmin);
  } catch (error) {
    console.error(`Errore nel recupero prodotti per sottocategoria ${req.params.categoria}/${req.params.sottocategoria}:`, error);
    res.status(500).json({ message: `Errore nel recupero prodotti per sottocategoria: ${error.message}` });
  }
};

// Funzione per ottenere tutte le categorie per l'admin (solo nomi italiani)
exports.getAdminCategories = async (req, res) => {
  try {
    const categorie = await ProdottoCatalogo.distinct('categoria.it', { 'nome.it': { $not: { $regex: /^_sottocategoria_/ } } });
    res.json(categorie);
  } catch (error) {
    console.error('Errore nel recupero delle categorie per admin:', error);
    res.status(500).json({ message: `Errore nel recupero delle categorie: ${error.message}` });
  }
};

// FUNZIONI PER GESTIRE LE SOTTOCATEGORIE

// Ottieni tutte le sottocategorie per entrambe le categorie
exports.getAllSottocategorie = async (req, res) => {
  try {
    // Ottieni i prodotti per trovare tutte le sottocategorie uniche
    const prodotti = await ProdottoCatalogo.find(
      // Includi solo i documenti con nome che inizia con "_sottocategoria_" per ottenere solo le sottocategorie
      { 'nome.it': { $regex: /^_sottocategoria_/ } }, 
      'categoria sottocategoria'
    );
    
    // Crea un oggetto per tenere traccia delle sottocategorie per categoria
    const sottocategorie = {
      'Domestico': [],
      'Industriale': []
    };
    
    // Aggiungi le sottocategorie alle rispettive categorie
    prodotti.forEach(prodotto => {
      // Ensure we're working with the Italian version for admin display
      const categoriaIt = prodotto.categoria.it;
      const sottocategoriaIt = prodotto.sottocategoria ? prodotto.sottocategoria.it : null;

      if (sottocategoriaIt && !sottocategorie[categoriaIt].includes(sottocategoriaIt)) {
        sottocategorie[categoriaIt].push(sottocategoriaIt);
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
        'categoria.it': categoria, // Match on the Italian version
        'nome.it': { $regex: /^_sottocategoria_/ }
      },
      'sottocategoria'
    );

    // Extract the Italian version of subcategories
    const sottocategorie = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria ? prodotto.sottocategoria.it : null))].filter(Boolean);
    
    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie per categoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Aggiungi una nuova sottocategoria
exports.addSottocategoria = async (req, res) => {
  try {
    const { categoria: categoriaParam } = req.params; // Rename to avoid conflict
    const { sottocategoria: sottocategoriaBody } = req.body;

    // Translate category and subcategory
    const [translatedCategoria, translatedSottocategoria] = await Promise.all([
      translateText(categoriaParam),
      translateText(sottocategoriaBody)
    ]);

    // Validazione categoria (sulla versione italiana)
    if (!translatedCategoria.it || !['Domestico', 'Industriale'].includes(translatedCategoria.it)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    if (!sottocategoriaBody) {
      return res.status(400).json({ message: 'Il nome della sottocategoria è richiesto' });
    }

    // Check for existing subcategory using the Italian version
    const esistente = await ProdottoCatalogo.findOne({
      'categoria.it': translatedCategoria.it,
      'sottocategoria.it': translatedSottocategoria.it,
      'nome.it': { $regex: /^_sottocategoria_/ }
    });

    if (esistente) {
      return res.status(400).json({ message: 'Questa sottocategoria esiste già per questa categoria' });
    }

    // Crea un prodotto "dummy" con questa sottocategoria per mantenere una traccia
    // ma lo contrassegnamo in modo che possa essere facilmente filtrato nelle query
    const dummyProdotto = new ProdottoCatalogo({
      nome: { it: `_sottocategoria_${translatedSottocategoria.it}` }, // Use Italian for dummy name
      codice: `_sottocategoria_${Date.now()}`,
      tipo: 'DUMMY',
      prezzo: 0,
      unita: '€/PZ',
      categoria: translatedCategoria, // Save translated object
      sottocategoria: translatedSottocategoria, // Save translated object
      tipoImballaggio: 'Barattolo 1kg',
      pezziPerCartone: 1,
      cartoniPerEpal: 1,
      pezziPerEpal: 1,
      descrizione: { it: `Prodotto dummy per la sottocategoria ${translatedSottocategoria.it}` }, // Use Italian for description
      immagini: []
    });

    await dummyProdotto.save();

    // Ottieni tutte le sottocategorie aggiornate per questa categoria
    // Ottieni tutti i prodotti della categoria
    const prodotti = await ProdottoCatalogo.find(
      {
        'categoria.it': translatedCategoria.it,
        'nome.it': { $regex: /^_sottocategoria_/ }
      },
      'sottocategoria'
    );

    const sottocategorieAggiornate = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria ? prodotto.sottocategoria.it : null))].filter(Boolean);
    
    res.status(201).json(sottocategorieAggiornate);
  } catch (error) {
    console.error('Errore nell\'aggiunta della sottocategoria:', error);
    res.status(500).json({ message: error.message, details: error });
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
      'categoria.it': categoria,
      'sottocategoria.it': sottocategoria,
      'nome.it': { $regex: /^_sottocategoria_/ }
    });
    
    if (prodottiDummy.length === 0) {
      return res.status(404).json({ message: 'Sottocategoria non trovata' });
    }
    
    // Elimina tutti i prodotti "dummy" per questa sottocategoria
    await ProdottoCatalogo.deleteMany({
      'categoria.it': categoria,
      'sottocategoria.it': sottocategoria,
      'nome.it': { $regex: /^_sottocategoria_/ }
    });
    
    // Aggiorna tutti i prodotti reali per rimuovere la sottocategoria
    const risultatoAggiornamento = await ProdottoCatalogo.updateMany(
      {
        'categoria.it': categoria,
        'sottocategoria.it': sottocategoria,
        'nome.it': { $not: { $regex: /^_sottocategoria_/ } }
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
    
    const translatedNuovoNome = await translateText(nuovoNome);

    // Verifica se la sottocategoria esiste
    const prodottiDummy = await ProdottoCatalogo.find({
      'categoria.it': categoria,
      'sottocategoria.it': sottocategoria,
      'nome.it': { $regex: /^_sottocategoria_/ }
    });
    
    if (prodottiDummy.length === 0) {
      return res.status(404).json({ message: 'Sottocategoria non trovata' });
    }
    
    // Verifica se il nuovo nome della sottocategoria è già in uso
    const esistente = await ProdottoCatalogo.findOne({
      'categoria.it': categoria,
      'sottocategoria.it': translatedNuovoNome.it,
      'nome.it': { $regex: /^_sottocategoria_/ }
    });
    
    if (esistente) {
      return res.status(400).json({ message: 'Il nuovo nome della sottocategoria è già in uso' });
    }
    
    // Aggiorna i prodotti "dummy" con il nuovo nome della sottocategoria
    await ProdottoCatalogo.updateMany(
      {
        'categoria.it': categoria,
        'sottocategoria.it': sottocategoria,
        'nome.it': { $regex: /^_sottocategoria_/ }
      },
      {
        $set: {
          sottocategoria: translatedNuovoNome, // Save translated object
          nome: { it: `_sottocategoria_${translatedNuovoNome.it}` },
          descrizione: { it: `Prodotto dummy per la sottocategoria ${translatedNuovoNome.it}` }
        }
      }
    );
    
    // Aggiorna tutti i prodotti reali con il nuovo nome della sottocategoria
    const risultatoAggiornamento = await ProdottoCatalogo.updateMany(
      {
        'categoria.it': categoria,
        'sottocategoria.it': sottocategoria,
        'nome.it': { $not: { $regex: /^_sottocategoria_/ } }
      },
      { $set: { sottocategoria: translatedNuovoNome } } // Save translated object
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

// Funzione per tradurre una sottocategoria esistente
exports.translateSottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;

    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    // Traduci il nome della sottocategoria fornito
    const translatedSottocategoria = await translateText(sottocategoria);

    // Aggiorna tutti i prodotti (reali e dummy) che hanno questa sottocategoria in italiano
    const risultatoAggiornamento = await ProdottoCatalogo.updateMany(
      {
        'categoria.it': categoria,
        'sottocategoria.it': sottocategoria
      },
      { $set: { sottocategoria: translatedSottocategoria } }
    );

    if (risultatoAggiornamento.matchedCount === 0) {
      return res.status(404).json({ message: 'Nessun prodotto trovato per questa sottocategoria.' });
    }

    res.status(200).json({
      message: 'Traduzione della sottocategoria applicata con successo.',
      prodottiAggiornati: risultatoAggiornamento.modifiedCount
    });

  } catch (error) {
    console.error('Errore nella traduzione della sottocategoria:', error);
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

    const prodotti = await ProdottoCatalogo.find({ 'nome.it': { $not: { $regex: /^_sottocategoria_/ } } });

    const translatedProdotti = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome[lang] || prodotto.nome.it,
        descrizione: prodotto.descrizione[lang] || prodotto.descrizione.it,
        categoria: prodotto.categoria[lang] || prodotto.categoria.it, // Traduci categoria
        sottocategoria: prodotto.sottocategoria ? (prodotto.sottocategoria[lang] || prodotto.sottocategoria.it) : null, // Traduci sottocategoria
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
    translatedProdotto.categoria = translatedProdotto.categoria[lang] || translatedProdotto.categoria.it; // Traduci categoria
    translatedProdotto.sottocategoria = translatedProdotto.sottocategoria ? (translatedProdotto.sottocategoria[lang] || translatedProdotto.sottocategoria.it) : null; // Traduci sottocategoria

    res.json(translatedProdotto);
  } catch (error) {
    console.error(`Errore nel recupero del prodotto pubblico ${req.params.id}:`, error);
    res.status(500).json({ message: `Errore nel recupero del prodotto: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere tutte le categorie
exports.getPublicCategories = async (req, res) => {
  try {
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    const categorieRaw = await ProdottoCatalogo.distinct('categoria', { 'nome.it': { $not: { $regex: /^_sottocategoria_/ } } });
    
    // Mappa le categorie per restituire la traduzione corretta
    const categorieTradotte = categorieRaw.map(cat => {
      // Assumiamo che `cat` sia l'oggetto multilingua salvato nel DB
      // Se `distinct` restituisce solo la stringa italiana, dobbiamo recuperare l'oggetto completo
      // Per ora, assumiamo che `distinct` possa restituire l'oggetto completo o che `categoria` sia già un oggetto
      // Se `distinct` restituisce solo la stringa, questa logica dovrà essere rivista.
      // Per semplicità, assumiamo che `distinct` restituisca la stringa italiana e che il modello sia stato aggiornato per salvare l'oggetto completo.
      // Quindi, dobbiamo recuperare l'oggetto completo per tradurlo.
      // Questo è un punto critico che potrebbe richiedere una query aggiuntiva o una modifica al modo in cui le categorie sono gestite.
      // Per ora, restituisco la categoria così com'è, ma se `distinct` restituisce solo la stringa, non sarà tradotta.
      // Una soluzione migliore sarebbe avere una collezione separata per le categorie.
      return cat[lang] || cat.it || cat; // Tenta di tradurre, altrimenti restituisci l'italiano o l'originale
    });

    res.json(categorieTradotte);
  } catch (error) {
    console.error('Errore nel recupero delle categorie pubbliche:', error);
    res.status(500).json({ message: `Errore nel recupero delle categorie: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere una singola categoria per ID (non applicabile direttamente, ma per coerenza)
exports.getPublicCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    // Per le categorie, non abbiamo un ID univoco come per i prodotti, ma un nome.
    // Questa funzione potrebbe essere usata per validare l'esistenza di una categoria.
    // Dobbiamo trovare una categoria che abbia il categoryId nella lingua richiesta.
    const categoriaDoc = await ProdottoCatalogo.findOne({
      [`categoria.${lang}`]: categoryId,
      'nome.it': { $not: { $regex: /^_sottocategoria_/ } }
    });

    if (!categoriaDoc) {
      return res.status(404).json({ message: 'Categoria non trovata' });
    }

    res.json({ category: categoriaDoc.categoria[lang] || categoriaDoc.categoria.it });
  } catch (error) {
    console.error(`Errore nel recupero della categoria pubblica ${req.params.categoryId}:`, error);
    res.status(500).json({ message: `Errore nel recupero della categoria: ${error.message}` });
  }
};

// Funzione per il pubblico per ottenere tutte le sottocategorie
exports.getPublicAllSubcategories = async (req, res) => {
  try {
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    const sottocategorie = {
      'Domestico': [],
      'Industriale': []
    };

    const prodotti = await ProdottoCatalogo.find(
      { 'nome.it': { $regex: /^_sottocategoria_/ } },
      'categoria sottocategoria'
    );

    prodotti.forEach(prodotto => {
      const categoriaIt = prodotto.categoria.it; // Usiamo la versione italiana per raggruppare
      const sottocategoriaTradotta = prodotto.sottocategoria ? (prodotto.sottocategoria[lang] || prodotto.sottocategoria.it) : null;

      if (sottocategoriaTradotta && !sottocategorie[categoriaIt].includes(sottocategoriaTradotta)) {
        sottocategorie[categoriaIt].push(sottocategoriaTradotta);
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
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    const prodotti = await ProdottoCatalogo.find(
      {
        'categoria.it': categoria, // Filtra sulla versione italiana della categoria
        'nome.it': { $regex: /^_sottocategoria_/ }
      },
      'sottocategoria'
    );

    const sottocategorie = [...new Set(prodotti.map(prodotto => prodotto.sottocategoria ? (prodotto.sottocategoria[lang] || prodotto.sottocategoria.it) : null))].filter(Boolean);

    res.status(200).json(sottocategorie);
  } catch (error) {
    console.error('Errore nel recupero delle sottocategorie pubbliche per categoria:', error);
    res.status(500).json({ message: error.message });
  }
};

// Nuova funzione per il pubblico per ottenere prodotti per categoria
exports.getPublicProdottiByCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    const prodotti = await ProdottoCatalogo.find({
      'categoria.it': categoria, // Filtra sulla versione italiana
      'nome.it': { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const translatedProdotti = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome[lang] || prodotto.nome.it,
        descrizione: prodotto.descrizione[lang] || prodotto.descrizione.it,
        categoria: prodotto.categoria[lang] || prodotto.categoria.it, // Traduci categoria
        sottocategoria: prodotto.sottocategoria ? (prodotto.sottocategoria[lang] || prodotto.sottocategoria.it) : null, // Traduci sottocategoria
      };
    });

    res.json(translatedProdotti);
  } catch (error) {
    console.error(`Errore nel recupero prodotti pubblici per categoria ${req.params.categoria}:`, error);
    res.status(500).json({ message: `Errore nel recupero prodotti pubblici per categoria: ${error.message}` });
  }
};

// Nuova funzione per il pubblico per ottenere prodotti per sottocategoria
exports.getPublicProdottiBySottocategoria = async (req, res) => {
  try {
    const { categoria, sottocategoria } = req.params;
    const lang = req.query.lang || 'it'; // Default a italiano
    const validLangs = ['it', 'en', 'fr', 'es', 'de'];

    if (!validLangs.includes(lang)) {
      return res.status(400).json({ message: 'Lingua non supportata.' });
    }

    if (!['Domestico', 'Industriale'].includes(categoria)) {
      return res.status(400).json({ message: 'Categoria non valida' });
    }

    if (!sottocategoria) {
      return res.status(400).json({ message: 'Sottocategoria mancante' });
    }

    const prodotti = await ProdottoCatalogo.find({
      'categoria.it': categoria, // Filtra sulla versione italiana della categoria
      'sottocategoria.it': sottocategoria, // Filtra sulla versione italiana della sottocategoria
      'nome.it': { $not: { $regex: /^_sottocategoria_/ } } // Escludi dummy
    });

    const translatedProdotti = prodotti.map(p => {
      const prodotto = p.toObject();
      return {
        ...prodotto,
        nome: prodotto.nome[lang] || prodotto.nome.it,
        descrizione: prodotto.descrizione[lang] || prodotto.descrizione.it,
        categoria: prodotto.categoria[lang] || prodotto.categoria.it, // Traduci categoria
        sottocategoria: prodotto.sottocategoria ? (prodotto.sottocategoria[lang] || prodotto.sottocategoria.it) : null, // Traduci sottocategoria
      };
    });

    res.json(translatedProdotti);
  } catch (error) {
    console.error(`Errore nel recupero prodotti pubblici per sottocategoria ${req.params.categoria}/${req.params.sottocategoria}:`, error);
    res.status(500).json({ message: `Errore nel recupero prodotti pubblici per sottocategoria: ${error.message}` });
  }
};

// Traduce tutte le sottocategorie esistenti
exports.translateAllSottocategorie = async (req, res) => {
  try {
    console.log('Avvio del processo di traduzione massiva per le sottocategorie.');

    // 1. Ottieni tutti i nomi unici delle sottocategorie in italiano
    const uniqueSottocategorie = await ProdottoCatalogo.distinct('sottocategoria.it');
    const sottocategorieDaTradurre = uniqueSottocategorie.filter(s => s); // Rimuovi valori null o vuoti

    if (sottocategorieDaTradurre.length === 0) {
      console.log('Nessuna sottocategoria da tradurre trovata.');
      return res.status(200).json({ message: 'Nessuna sottocategoria da tradurre.' });
    }

    console.log(`Trovate ${sottocategorieDaTradurre.length} sottocategorie uniche da tradurre:`, sottocategorieDaTradurre);

    const report = {
      success: [],
      failures: []
    };

    // 2. Itera su ogni sottocategoria e traducila
    for (const nomeSottocategoria of sottocategorieDaTradurre) {
      try {
        console.log(`Traduzione di: "${nomeSottocategoria}"...`);
        const translatedSottocategoria = await translateText(nomeSottocategoria);
        
        // 3. Aggiorna tutti i documenti che contengono questa sottocategoria
        const updateResult = await ProdottoCatalogo.updateMany(
          { 'sottocategoria.it': nomeSottocategoria },
          { $set: { sottocategoria: translatedSottocategoria } }
        );

        console.log(`"${nomeSottocategoria}" tradotta con successo. Prodotti aggiornati: ${updateResult.modifiedCount}`);
        report.success.push({
          sottocategoria: nomeSottocategoria,
          prodotti_aggiornati: updateResult.modifiedCount
        });

      } catch (error) {
        console.error(`Errore durante la traduzione di "${nomeSottocategoria}":`, error);
        report.failures.push({
          sottocategoria: nomeSottocategoria,
          errore: error.message
        });
      }
    }

    console.log('Processo di traduzione massiva completato.');
    res.status(200).json({
      message: 'Processo di traduzione massiva completato.',
      report
    });

  } catch (error) {
    console.error('Errore grave durante il processo di traduzione massiva:', error);
    res.status(500).json({ message: 'Errore grave durante il processo di traduzione massiva.', error: error.message });
  }
};