// frontend-catalogoprodotti/src/pages/ViewProducts.js
import React, { useEffect, useState } from 'react';
import { getAllProdotti, deleteProdotto, getSubcategoriesByCategory } from '../api';
import './ViewProducts.css';
import { Button, Form, Card, Row, Col, Badge, Accordion, Container, Alert } from 'react-bootstrap';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');
  const [filterSottocategoria, setFilterSottocategoria] = useState('');
  const [sottocategorieFiltrate, setSottocategorieFiltrate] = useState([]);
  
  // Categorie principali (solo Domestico e Industriale)
  const categoriePrincipali = ['Domestico', 'Industriale'];
  
  // Mappa delle sottocategorie per categoria
  const [sottocategorieMap, setSottocategorieMap] = useState({
    'Domestico': [],
    'Industriale': []
  });

  // Carica i prodotti dal backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProdotti();
        setProducts(data);
        
        // Estrai tutte le sottocategorie dai prodotti
        const sottocategoriePerCategoria = {
          'Domestico': [],
          'Industriale': []
        };
        
        // Raccogliamo le sottocategorie uniche per ogni categoria
        for (const categoria of categoriePrincipali) {
          try {
            const sottocategorie = await getSubcategoriesByCategory(categoria);
            if (Array.isArray(sottocategorie)) {
              sottocategoriePerCategoria[categoria] = sottocategorie;
            }
          } catch (error) {
            console.error(`Errore nel recupero delle sottocategorie per ${categoria}:`, error);
          }
        }
        
        setSottocategorieMap(sottocategoriePerCategoria);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error);
        setError('Errore durante il recupero dei prodotti');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Aggiorna le sottocategorie filtrate quando cambia la categoria
  useEffect(() => {
    if (filterCategoria) {
      setSottocategorieFiltrate(sottocategorieMap[filterCategoria] || []);
    } else {
      setSottocategorieFiltrate([]);
    }
    // Resetta il filtro della sottocategoria quando cambia la categoria
    setFilterSottocategoria('');
  }, [filterCategoria, sottocategorieMap]);

  // Gestisce la cancellazione di un prodotto
  const handleDelete = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProdotto(id);
        setProducts(products.filter((product) => product._id !== id));
        alert('Prodotto eliminato con successo!');
      } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
        alert('Errore durante l\'eliminazione del prodotto');
      }
    }
  };

  // Filtra i prodotti in base a ricerca, categoria e sottocategoria
  const filteredProducts = products.filter((product) => {
    // Filtra per termine di ricerca
    const matchesSearch = 
      !searchTerm || 
      (product.nome && product.nome.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product.codice && product.codice.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtra per categoria
    const matchesCategoria = !filterCategoria || product.categoria === filterCategoria;
    
    // Filtra per sottocategoria
    const matchesSottocategoria = !filterSottocategoria || product.sottocategoria === filterSottocategoria;
    
    return matchesSearch && matchesCategoria && matchesSottocategoria;
  });

  // Raggruppa i prodotti per categoria
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const categoria = product.categoria || 'Non categorizzato';
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(product);
    return acc;
  }, {});

  // Formatta il tipo di unità di imballaggio per la visualizzazione
  const formatPackagingInfo = (product) => {
    if (!product.tipoImballaggio) return 'N/A';
    
    return `${product.tipoImballaggio} (${product.pezziPerCartone || 0} pz/cartone, ${product.cartoniPerEpal || 0} cart/epal, ${product.pezziPerEpal || 0} pz/epal)`;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
        <p className="mt-3">Caricamento prodotti in corso...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Catalogo Prodotti</h1>
      
      {/* Filtri */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Filtra per categoria</Form.Label>
                <Form.Select
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                >
                  <option value="">Tutte le categorie</option>
                  {categoriePrincipali.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Filtra per sottocategoria</Form.Label>
                <Form.Select
                  value={filterSottocategoria}
                  onChange={(e) => setFilterSottocategoria(e.target.value)}
                  disabled={!filterCategoria || sottocategorieFiltrate.length === 0}
                >
                  <option value="">Tutte le sottocategorie</option>
                  {sottocategorieFiltrate.map((subcat) => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Visualizzazione prodotti raggruppati */}
      {Object.keys(groupedProducts).length === 0 ? (
        <Alert variant="info">
          Nessun prodotto trovato {searchTerm ? `per la ricerca "${searchTerm}"` : ''} 
          {filterCategoria ? ` nella categoria "${filterCategoria}"` : ''} 
          {filterSottocategoria ? ` con sottocategoria "${filterSottocategoria}"` : ''}
        </Alert>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen className="mb-4">
          {Object.entries(groupedProducts).map(([categoria, products], index) => (
            <Accordion.Item eventKey={String(index)} key={categoria}>
              <Accordion.Header>
                <span className="fw-bold">{categoria}</span>
                <Badge bg="secondary" className="ms-2">{products.length} prodotti</Badge>
              </Accordion.Header>
              <Accordion.Body>
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Codice</th>
                        <th>Nome</th>
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
                          <td>{product.sottocategoria || 'N/A'}</td>
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
      <Card className="mt-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">Riepilogo Catalogo</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="text-center border-end">
              <h6>Totale Prodotti</h6>
              <div className="fs-3">{products.length}</div>
            </Col>
            <Col md={4} className="text-center border-end">
              <h6>Domestico</h6>
              <div className="fs-3">
                {products.filter(p => p.categoria === 'Domestico').length}
              </div>
            </Col>
            <Col md={4} className="text-center">
              <h6>Industriale</h6>
              <div className="fs-3">
                {products.filter(p => p.categoria === 'Industriale').length}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewProducts;