// frontend-catalogoprodotti/src/pages/ViewProducts.js
import React, { useEffect, useState } from 'react';
import { getAllProdotti, deleteProdotto } from '../api';
import './ViewProducts.css';
import { Button, Form, Card, Row, Col, Badge, Accordion } from 'react-bootstrap';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMacroCategoria, setFilterMacroCategoria] = useState('');
  const [categories, setCategories] = useState([]);

  // Carica le categorie all'avvio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/gestoreProdotti/categorie');
        if (!response.ok) {
          throw new Error(`Errore HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Errore nel caricamento delle categorie:', error);
      }
    };

    fetchCategories();
  }, []);

  // Carica i prodotti dal backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProdotti();
        
        // Arricchisci i dati dei prodotti con i nomi delle categorie
        const enrichedProducts = data.map(product => {
          // Trova il nome della categoria se abbiamo l'ID
          let categoryName = 'N/A';
          const category = categories.find(c => c._id === product.categoria);
          if (category) {
            categoryName = category.name;
            
            // Verifica la sottocategoria se esiste
            if (product.sottocategoria && product.sottocategoria.id) {
              const subcategory = category.subcategories.find(sc => 
                sc.id.toString() === product.sottocategoria.id.toString()
              );
              if (subcategory) {
                product.sottocategoria.name = subcategory.name;
              }
            }
          }
          
          return { ...product, categoryName };
        });
        
        setProducts(enrichedProducts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Errore durante il recupero dei prodotti');
        setLoading(false);
      }
    };

    // Carica i prodotti solo dopo aver caricato le categorie
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categories]);

  // Gestisce la cancellazione di un prodotto
  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProdotto(id);
        setProducts(products.filter((product) => product._id !== id));
        alert('Prodotto eliminato con successo!');
      } catch (error) {
        console.error(error);
        alert('Errore durante l\'eliminazione del prodotto');
      }
    }
  };

  // Filtra i prodotti in base a ricerca e macro-categoria
  const filteredProducts = products.filter((product) => {
    // Filtra per termine di ricerca
    const matchesSearch = 
      !searchTerm || 
      (product.nome && product.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product.codice && product.codice.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtra per macro-categoria
    const matchesMacroCategoria = !filterMacroCategoria || product.macroCategoria === filterMacroCategoria;
    
    return matchesSearch && matchesMacroCategoria;
  });

  // Raggruppa i prodotti per macro-categoria
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const macroCategoria = product.macroCategoria || 'Altra categoria';
    if (!acc[macroCategoria]) {
      acc[macroCategoria] = [];
    }
    acc[macroCategoria].push(product);
    return acc;
  }, {});

  // Formatta il tipo di unità di imballaggio per la visualizzazione
  const formatPackagingInfo = (product) => {
    if (!product.tipoImballaggio) return 'N/A';
    
    return `${product.tipoImballaggio} (${product.pezziPerCartone} pz/cartone, ${product.cartoniPerEpal} cart/epal, ${product.pezziPerEpal} pz/epal)`;
  };

  if (loading) {
    return <div className="container mt-4 text-center">Caricamento prodotti...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Catalogo Prodotti</h1>
      
      {/* Filtri */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Cerca prodotto</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Cerca per nome o codice" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Filtra per macro-categoria</Form.Label>
                <Form.Select
                  value={filterMacroCategoria}
                  onChange={(e) => setFilterMacroCategoria(e.target.value)}
                >
                  <option value="">Tutte le categorie</option>
                  <option value="Linea Casa">Linea Casa</option>
                  <option value="Linea Industriale">Linea Industriale</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Visualizzazione prodotti raggruppati */}
      {Object.keys(groupedProducts).length === 0 ? (
        <div className="alert alert-info">Nessun prodotto trovato</div>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen className="mb-4">
          {Object.entries(groupedProducts).map(([macroCategoria, products], index) => (
            <Accordion.Item eventKey={String(index)} key={macroCategoria}>
              <Accordion.Header>
                <span className="fw-bold">{macroCategoria}</span>
                <Badge bg="secondary" className="ms-2">{products.length} prodotti</Badge>
              </Accordion.Header>
              <Accordion.Body>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Codice</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Sottocategoria</th>
                        <th>Prezzo</th>
                        <th>Imballaggio</th>
                        <th>Immagini</th>
                        <th>Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id}>
                          <td>{product.codice || 'N/A'}</td>
                          <td>{product.nome}</td>
                          <td>{product.categoryName || 'N/A'}</td>
                          <td>{product.sottocategoria?.name || 'N/A'}</td>
                          <td>{product.prezzo} {product.unita}</td>
                          <td>{formatPackagingInfo(product)}</td>
                          <td>
                            {product.immagini && product.immagini.length > 0 ? (
                              <div className="d-flex align-items-center">
                                {product.immagini.slice(0, 3).map((img, index) => (
                                  <img 
                                    key={index} 
                                    src={img} 
                                    alt={`${product.nome} - ${index + 1}`} 
                                    className="img-thumbnail me-1" 
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                                  />
                                ))}
                                {product.immagini.length > 3 && (
                                  <span className="badge bg-secondary">+{product.immagini.length - 3}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">Nessuna immagine</span>
                            )}
                          </td>
                          <td>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDelete(product._id)}
                            >
                              Elimina
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      {/* Statistiche */}
      <div className="card mt-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">Riepilogo Catalogo</h5>
        </div>
        <div className="card-body">
          <Row>
            <Col md={4} className="text-center border-end">
              <h6>Totale Prodotti</h6>
              <div className="fs-3">{products.length}</div>
            </Col>
            <Col md={4} className="text-center border-end">
              <h6>Linea Casa</h6>
              <div className="fs-3">
                {products.filter(p => p.macroCategoria === 'Linea Casa').length}
              </div>
            </Col>
            <Col md={4} className="text-center">
              <h6>Linea Industriale</h6>
              <div className="fs-3">
                {products.filter(p => p.macroCategoria === 'Linea Industriale').length}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;