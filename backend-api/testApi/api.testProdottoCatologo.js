const request = require('supertest');
const app = require('../app');

describe('API Tests', () => {
  // Test per creare un prodotto
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

  // Test per ottenere tutti i prodotti
  it('should get all products', async () => {
    const response = await request(app)
      .get('/api/prodottiCatalogo/prodotti');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test per ottenere un prodotto per ID
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

  // Test per aggiornare un prodotto
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

  // Test per cancellare un prodotto
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
});