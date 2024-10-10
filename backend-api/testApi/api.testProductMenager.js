const request = require('supertest');
const app = require('../app'); // importa la tua app Express
const mongoose = require('mongoose');
const Product = require('../models/productManager'); // importa il modello prodotto
const Category = require('../models/category'); // importa il modello categoria

describe('Gestore Prodotti e Categorie API', () => {
    let category;

    // Esegui questa funzione prima di ogni test per creare una categoria fittizia
    beforeEach(async () => {
        category = new Category({ name: 'Gadget' });
        await category.save();
    });

    // Esegui questa funzione dopo ogni test per pulire il database
    afterEach(async () => {
        await Product.deleteMany({});
        await Category.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Test per creare un prodotto
    it('should create a new product', async () => {
        const response = await request(app)
            .post('/api/gestoreProdotti/prodotti')
            .send({
                name: 'Nuovo Prodotto',
                description: 'Descrizione del prodotto',
                images: ['https://example.com/image1.jpg'],
                category: category._id // assegna la categoria creata
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Nuovo Prodotto');
    });

    // Test per ottenere tutti i prodotti
    it('should get all products', async () => {
        const product = new Product({
            name: 'Prodotto Esempio',
            description: 'Esempio Descrizione',
            images: ['https://example.com/image1.jpg'],
            category: category._id
        });
        await product.save();

        const response = await request(app).get('/api/gestoreProdotti/prodotti');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('name', 'Prodotto Esempio');
    });

    // Test per aggiornare un prodotto
    it('should update a product', async () => {
        const product = new Product({
            name: 'Prodotto Da Aggiornare',
            description: 'Descrizione',
            category: category._id
        });
        await product.save();

        const response = await request(app)
            .put(`/api/gestoreProdotti/prodotti/${product._id}`)
            .send({
                name: 'Prodotto Aggiornato',
                description: 'Descrizione Aggiornata'
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Prodotto Aggiornato');
    });

    // Test per eliminare un prodotto
    it('should delete a product', async () => {
        const product = new Product({
            name: 'Prodotto Da Eliminare',
            description: 'Descrizione',
            category: category._id
        });
        await product.save();

        const response = await request(app).delete(`/api/gestoreProdotti/prodotti/${product._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Prodotto eliminato con successo');
    });
    
    // Test per creare una categoria
    it('should create a new category', async () => {
        const response = await request(app)
            .post('/api/gestoreProdotti/categorie')
            .send({
                name: 'Pulizia',
                subcategories: [{ name: 'Detergenti' }]
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe('Pulizia');
        expect(response.body.subcategories[0].name).toBe('Detergenti');
    });

    // Test per ottenere tutte le categorie
    it('should get all categories', async () => {
        const category = new Category({
            name: 'Cucina',
            subcategories: [{ name: 'Posate' }]
        });
        await category.save();

        const response = await request(app).get('/api/gestoreProdotti/categorie');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toHaveProperty('name', 'Cucina');
        expect(response.body[0].subcategories[0].name).toBe('Posate');
    });

    // Test per ottenere una categoria per ID
    it('should get a category by ID', async () => {
        const category = new Category({
            name: 'Bucato',
            subcategories: [{ name: 'Detersivi' }]
        });
        await category.save();

        const response = await request(app).get(`/api/gestoreProdotti/categorie/${category._id}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Bucato');
        expect(response.body.subcategories[0].name).toBe('Detersivi');
    });

    // Test per aggiornare una categoria
    it('should update a category', async () => {
        const category = new Category({
            name: 'Cucina',
            subcategories: [{ name: 'Utensili' }]
        });
        await category.save();

        const response = await request(app)
            .put(`/api/gestoreProdotti/categorie/${category._id}`)
            .send({
                name: 'Cucina Aggiornata',
                subcategories: [{ name: 'Pentole' }]
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Cucina Aggiornata');
        expect(response.body.subcategories[0].name).toBe('Pentole');
    });

    // Test per eliminare una categoria
    it('should delete a category', async () => {
        const category = new Category({
            name: 'Bucato',
            subcategories: [{ name: 'Detersivi' }]
        });
        await category.save();

        const response = await request(app).delete(`/api/gestoreProdotti/categorie/${category._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Categoria eliminata con successo');
    });

    // Test per aggiungere una sottocategoria a una categoria esistente
    it('should add a subcategory to an existing category', async () => {
        const category = new Category({
            name: 'Giardinaggio',
            subcategories: [{ name: 'Attrezzi' }]
        });
        await category.save();

        const response = await request(app)
            .post(`/api/gestoreProdotti/categorie/${category._id}/sottocategorie`)
            .send({ name: 'Semi' });

        expect(response.status).toBe(200);
        expect(response.body.subcategories.length).toBe(2); // Verifica che ci siano 2 sottocategorie
        expect(response.body.subcategories[1].name).toBe('Semi');
    });
});