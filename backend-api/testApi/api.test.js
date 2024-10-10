const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app'); // importa la tua app Express
const mongoose = require('mongoose');
const Product = require('../models/productManager'); // importa il modello prodotto
const Category = require('../models/category'); // importa il modello categoria
const User = require('../models/user'); // Importa il modello User
let uniqueUsername;
describe('GestoreProdotti e CatalagoProdotti e LoginUtente TESTING API', () => {
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
    // pulisci utente e chiudi database
    afterAll(async () => {
       await User.deleteMany({}); // Pulisci il database dopo i test
        await mongoose.connection.close();
    });

    //pulisci categorie
    beforeEach(async () => {
      // Pulisci il database
      await Category.deleteMany({});
      
      // Crea categorie per il test
      const category1 = new Category({
          name: 'Cucina',
          subcategories: [{ name: 'Posate' }]
      });
     
      
      // Salva le categorie
      await category1.save();
    
    });

    //prima di tutto crea l'utente
    beforeAll(async () => {
      uniqueUsername = `testuser_${Date.now()}`; // Crea un nome utente unico
  
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = new User({
          username: uniqueUsername,
          password: hashedPassword,
          role: 'cliente',
      });
      await user.save();
  });


     // TESTING API PER CATALOGO PRODOTTI

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
    

    // TESTING API PER GESTORE PRODOTTI

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
      const response = await request(app).get('/api/gestoreProdotti/categorie');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1); // Aggiorna a 3 se sono effettivamente 3 categorie
      expect(response.body[0]).toHaveProperty('name', 'Cucina'); // Verifica se il primo è 'Cucina'
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

    // Test per aggiungere una sottocategoria a una categoria esistente del gestore prodotti
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
    // test per creare un prodotto nel gestore prodotti
    it('should create a product', async () => {
        const response = await request(app)
          .post('/api/prodottiCatalogo/prodotti')
          .send({ 
            nome: 'New Product', 
            tipo: 'Electronics', 
            prezzo: 100, 
            unita: '€/PZ', 
            categoria: 'Gadget',
            descrizione: 'A new cool gadget'
          });
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
      });
    
      // Test per ottenere tutti i prodotti del gestore prodotti 
    it('should get all products', async () => {
        const response = await request(app)
          .get('/api/prodottiCatalogo/prodotti');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    
      // Test per ottenere un prodotto per ID del gestore prodotti
    it('should get a product by ID', async () => {
        const newProduct = await request(app)
          .post('/api/prodottiCatalogo/prodotti')
          .send({ 
            nome: 'New Product', 
            tipo: 'Electronics', 
            prezzo: 100, 
            unita: '€/PZ', 
            categoria: 'Gadget',
            descrizione: 'A new cool gadget'
          });
    
        const response = await request(app)
          .get(`/api/prodottiCatalogo/prodotti/${newProduct.body._id}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', 'New Product');
    });
    
      // Test per aggiornare un prodotto del gestore prodotti 
    it('should update a product', async () => {
        const newProduct = await request(app)
          .post('/api/prodottiCatalogo/prodotti')
          .send({ 
            nome: 'New Product', 
            tipo: 'Electronics', 
            prezzo: 100, 
            unita: '€/PZ', 
            categoria: 'Gadget',
            descrizione: 'A new cool gadget'
          });
    
        const response = await request(app)
          .put(`/api/prodottiCatalogo/prodotti/${newProduct.body._id}`)
          .send({ 
            nome: 'Updated Product', 
            tipo: 'Electronics', 
            prezzo: 200, 
            unita: '€/PZ', 
            categoria: 'Gadget',
            descrizione: 'An updated cool gadget'
          });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', 'Updated Product');
    });
    
      // Test per cancellare un prodotto del gestore prodotti
    it('should delete a product', async () => {
        const newProduct = await request(app)
          .post('/api/prodottiCatalogo/prodotti')
          .send({ 
            nome: 'New Product', 
            tipo: 'Electronics', 
            prezzo: 100, 
            unita: '€/PZ', 
            categoria: 'Gadget',
            descrizione: 'A new cool gadget'
          });
    
        const response = await request(app)
          .delete(`/api/prodottiCatalogo/prodotti/${newProduct.body._id}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Prodotto cancellato');
    });

      // TESTING API PER UTENTE


        // Test per il login dell'utente
    it('should login a user and return a token', async () => {
      const response = await request(app)
          .post('/api/auth/login') // Sostituisci con il tuo endpoint di login
          .send({
              username: uniqueUsername, // Usa il nome utente unico
              password: 'password123'
          });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token'); // Verifica che venga restituito un token
    });

    // Test per credenziali non valide
    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
          .post('/api/auth/login') // Sostituisci con il tuo endpoint di login
          .send({
              username: uniqueUsername, // Usa il nome utente unico
              password: 'wrongpassword' // Password errata
          });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials'); // Verifica il messaggio di errore
    });






});