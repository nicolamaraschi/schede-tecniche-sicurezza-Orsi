const Product = require('../models/productManager'); // Modello del prodotto
const Category = require('../models/category'); // Modello della categoria

const fs = require('fs').promises; 
const path = require('path');
const mongoose = require('mongoose');

// Crea un prodotto
exports.createProduct = async (req, res) => {
    try {
        // Logga il corpo della richiesta per il debug
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);

        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category, // ID della categoria
            subcategory: {                // Oggetto per la sottocategoria
                id: req.body.subcategory?.id, // ID della sottocategoria
                name: req.body.subcategory?.name // Nome della sottocategoria
            },
            // Salva i percorsi delle immagini
            images: req.files ? req.files.map(file => file.path) : [], // Usa req.files per ottenere i file caricati, o un array vuoto se non ci sono file
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error saving product:', error); // Logga l'errore
        res.status(400).json({ message: error.message });
    }
};



// Ottieni tutti i prodotti
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category'); // Popola la categoria
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ottieni un singolo prodotto per ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggiorna un prodotto
exports.updateProduct = async (req, res) => {
    try {
        // Stampa nel terminale cosa riceve la richiesta
        console.log('Dati ricevuti per l\'aggiornamento del prodotto:', req.body);

        // Recupera il prodotto esistente dal database
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Crea un oggetto aggiornato per il prodotto
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category, // ID della categoria
            subcategory: {                // Oggetto per la sottocategoria
                id: req.body.subcategory.id, // ID della sottocategoria
                name: req.body.subcategory.name // Nome della sottocategoria
            },
            images: product.images, // Mantieni le immagini esistenti per ora
        };

        // Se ci sono nuove immagini, aggiungile all'oggetto
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path); // Salva i nuovi percorsi delle immagini
            updateData.images = [...updateData.images, ...newImages]; // Aggiungi le nuove immagini a quelle esistenti
        }

        // Se ci sono immagini da rimuovere, gestiscile
        if (req.body.removeImages) {
            const imagesToRemove = Array.isArray(req.body.removeImages) ? req.body.removeImages : [req.body.removeImages];
            
            // Rimuovi le immagini specificate dall'array delle immagini
            imagesToRemove.forEach(image => {
                updateData.images = updateData.images.filter(existingImg => existingImg !== image);
                // Rimuovi il file fisicamente dal filesystem se necessario
                try {
                    fs.unlinkSync(image); // Assicurati che il percorso sia corretto
                } catch (err) {
                    console.error(`Error removing file ${image}:`, err);
                }
            });
        }

        // Aggiorna il prodotto con i dati modificati
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category');

        // Risposta con il prodotto aggiornato
        res.setHeader('Content-Type', 'application/json'); // Imposta l'intestazione per forzare la risposta a JSON
        return res.status(200).json(updatedProduct); // Restituisci il prodotto aggiornato come JSON
    } catch (error) {
        console.error('Error updating product:', error); // Logga l'errore per il debug
        res.setHeader('Content-Type', 'application/json'); // Imposta l'intestazione per forzare la risposta a JSON
        return res.status(400).json({ message: error.message }); // Restituisci l'errore come JSON
    }
};


/*
// Rimuovi un prodotto e le sue immagini
exports.deleteProduct = async (req, res) => {
    try {
        // Trova il prodotto da eliminare
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Elimina le immagini dalla directory uploads
        if (product.images && product.images.length > 0) { // Verifica se esistono immagini
            product.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '../', imagePath); // Costruisci il percorso completo
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error(`Error deleting image: ${fullPath}`, err);
                    } else {
                        console.log(`Deleted image: ${fullPath}`); // Log dell'immagine eliminata
                    }
                });
            });
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: error.message });
    }
};
*/
// Rimuovi un prodotto e le sue immagini
exports.deleteProduct = async (req, res) => {
    try {
        // Trova e elimina il prodotto da eliminare
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Elimina le immagini dalla directory uploads
        if (product.images && product.images.length > 0) { // Verifica se esistono immagini
            product.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '../', imagePath); // Costruisci il percorso completo
                fs.unlink(fullPath, (err) => {
                    if (err) {
                        console.error(`Errore eliminando l'immagine: ${fullPath}`, err);
                    } else {
                        console.log(`Immagine eliminata: ${fullPath}`); // Log dell'immagine eliminata
                    }
                });
            });
        }

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Errore eliminando il prodotto:', error);
        res.status(500).json({ message: error.message });
    }
};


// Crea una nuova categoria
exports.createCategory = async (req, res) => {
    try {
        const { name, subcategories } = req.body;

        // Se non ci sono sottocategorie fornite, inizializza come array vuoto
        const category = new Category({
            name,
            subcategories: subcategories ? subcategories.map(sub => ({
                id: new mongoose.Types.ObjectId(), // Genera un nuovo ID per la sottocategoria
                name: sub.name // Nome della sottocategoria
            })) : [] // Inizializza come array vuoto se non fornito
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Aggiungi una sottocategoria a una categoria esistente
exports.addSubcategory = async (req, res) => {
    try {
        const { categoryId } = req.params; // Id della categoria a cui aggiungere la sottocategoria
        const { name } = req.body; // Nome della sottocategoria

        // Trova la categoria per ID
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }

        // Aggiungi la sottocategoria all'array delle sottocategorie
        category.subcategories.push({
            id: new mongoose.Types.ObjectId(), // Genera un nuovo ID per la sottocategoria
            name
        });

        // Salva le modifiche alla categoria
        await category.save();

        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Ottieni tutte le categorie
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ottieni una singola categoria per ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggiorna una categoria
exports.updateCategory = async (req, res) => {
    try {
        const { name, subcategories } = req.body; // Destruttura name e subcategories
        const category = await Category.findByIdAndUpdate(req.params.id, { name, subcategories }, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Elimina una categoria
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoria non trovata' });
        }
        res.status(200).json({ message: 'Categoria eliminata con successo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
