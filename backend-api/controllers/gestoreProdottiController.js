const Product = require('../models/productManager'); // Modello del prodotto
const Category = require('../models/category'); // Modello della categoria
const fs = require('fs');
const path = require('path');

// Crea un prodotto
exports.createProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            // Salva i percorsi delle immagini
            images: req.files.map(file => file.path), // Usa req.files per ottenere i file caricati
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
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
        // Crea un oggetto aggiornato per il prodotto
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
        };

        // Se ci sono nuove immagini, aggiungile all'oggetto
        if (req.files) {
            updateData.images = req.files.map(file => file.path); // Salva i nuovi percorsi delle immagini
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('category');
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
/*
// Rimuovi un prodotto (non è stato fornito, ma è una funzione comune)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }
        res.status(204).send(); // 204 No Content
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
*/


// Rimuovi un prodotto e le sue immagini
// Rimuovi un prodotto e le sue immagini
exports.deleteProduct = async (req, res) => {
    try {
        // Trova il prodotto da eliminare
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato' });
        }

        // Elimina le immagini dalla directory uploads
        if (product.images.length > 0) {
            product.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '../', imagePath); // Costruisci il percorso completo senza il doppio uploads
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


// Crea una nuova categoria
exports.createCategory = async (req, res) => {
    try {
        const { name, subcategories } = req.body;

        // Se non ci sono sottocategorie fornite, inizializza come array vuoto
        const category = new Category({
            name,
            subcategories: subcategories || [] // Se subcategories è undefined, lo inizializza come un array vuoto
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
        category.subcategories.push({ name });

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
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
