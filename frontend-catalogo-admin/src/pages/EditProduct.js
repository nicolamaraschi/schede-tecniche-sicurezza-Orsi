// frontend-catalogo-admin/src/pages/EditProduct.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col, Table, Alert, Container } from 'react-bootstrap';
import { getAllProdotti, updateProdotto, deleteProdotto, getSubcategoriesByCategory } from '../api';

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    codice: '',
    tipo: '',
    prezzo: 0,
    unita: '',
    categoria: '',
    sottocategoria: '',
    tipoImballaggio: '',
    pezziPerCartone: '',
    cartoniPerEpal: '',
    pezziPerEpal: '',
    descrizione: ''
  });
  
  // Stato per le sottocategorie
  const [subcategories, setSubcategories] = useState([]);
  
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Opzioni per i dropdown
  const tipiProdotto = [
    'BULK',
    'BARATTOLO',
    'SECCHIO',
    'ASTUCCIO VUOTO',
    'ASTUCCIO PERSONALIZZATO',
    'MONODOSE CARTA'
  ];
  
  const unitaMisura = ['€/KG', '€/PZ'];
  
  // Categorie principali (solo Domestico e Industriale)
  const categoriePrincipali = ['Domestico', 'Industriale'];
  
  const tipiImballaggio = [
    'Barattolo 1kg',
    'BigBag 600kg',
    'Flacone 750g',
    'Sacco 10kg',
    'Sacco 20kg',
    'Secchio 200tabs',
    'Secchio 3.6kg',
    'Secchio 4kg',
    'Secchio 5kg',
    'Secchio 6kg',
    'Secchio 8kg',
    'Secchio 9kg',
    'Secchio 10kg',
    'Astuccio 100g',
    'Astuccio 700g',
    'Astuccio 2400g',
    'Astuccio 900g',
    'Astuccio 200g',
    'Flacone 500ml',
    'Flacone Trigger 750ml',
    'Tanica 1000l',
    'Flacone 5l',
    'Fustone 5.6kg',
    'Cartone 400tabs'
  ];
  
  // Valori predefiniti per i tipi di imballaggio
  const packagingDefaults = {
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

  // Carica prodotti all'avvio
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProdotti();
        setProducts(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Errore nel recupero dei prodotti:', error);
        setErrorMessage('Errore nel caricamento dei dati. Riprova più tardi.');
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Aggiorna le sottocategorie quando cambia la categoria
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (formData.categoria) {
        try {
          setIsLoading(true);
          const data = await getSubcategoriesByCategory(formData.categoria);
          setSubcategories(data || []);
          setIsLoading(false);
        } catch (error) {
          console.error('Errore nel caricamento delle sottocategorie:', error);
          setErrorMessage('Impossibile caricare le sottocategorie');
          setIsLoading(false);
        }
      } else {
        setSubcategories([]);
      }
    };
    
    fetchSubcategories();
  }, [formData.categoria]);

  // Aggiorna pezziPerEpal quando cambiano i valori
  useEffect(() => {
    if (formData.pezziPerCartone && formData.cartoniPerEpal) {
      const totale = parseInt(formData.pezziPerCartone) * parseInt(formData.cartoniPerEpal);
      setFormData(prev => ({
        ...prev,
        pezziPerEpal: totale
      }));
    }
  }, [formData.pezziPerCartone, formData.cartoniPerEpal]);

  // Pulizia delle URL delle anteprime quando il componente si smonta
  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, [previewImages]);

  // Filtra i prodotti in base al termine di ricerca
  const filteredProducts = products.filter(product => 
    (product.nome && product.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.codice && product.codice.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    
    // Inizializza il form con i dati del prodotto selezionato
    setFormData({
      nome: product.nome || '',
      codice: product.codice || '',
      tipo: product.tipo || '',
      prezzo: product.prezzo || 0,
      unita: product.unita || '',
      categoria: product.categoria || '',
      sottocategoria: product.sottocategoria || '',
      tipoImballaggio: product.tipoImballaggio || '',
      pezziPerCartone: product.pezziPerCartone || '',
      cartoniPerEpal: product.cartoniPerEpal || '',
      pezziPerEpal: product.pezziPerEpal || '',
      descrizione: product.descrizione || ''
    });
    
    // Resetta gli stati per le immagini
    setNewImages([]);
    setPreviewImages([]);
    setImagesToRemove([]);
    
    // Mostra il popup
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Se cambia tipo imballaggio, aggiorna i valori predefiniti
    if (name === 'tipoImballaggio' && packagingDefaults[value]) {
      const defaults = packagingDefaults[value];
      setFormData({
        ...formData,
        [name]: value,
        pezziPerCartone: defaults.pezziPerCartone,
        cartoniPerEpal: defaults.cartoniPerEpal,
        pezziPerEpal: defaults.pezziPerEpal
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    
    // Crea URL per le anteprime
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleRemoveImage = (imgUrl) => {
    // Aggiungi l'immagine all'elenco delle immagini da rimuovere
    setImagesToRemove([...imagesToRemove, imgUrl]);
  };

  const handleCancelRemoveImage = (imgUrl) => {
    // Rimuovi l'immagine dall'elenco delle immagini da rimuovere
    setImagesToRemove(imagesToRemove.filter(img => img !== imgUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Prepara i dati per l'aggiornamento
      const updateData = {
        ...formData,
        // immaginiToRemove will be passed as a separate argument
      };

      await updateProdotto(selectedProduct._id, updateData, newImages, imagesToRemove);
      
      // Aggiorna la lista dei prodotti
      const updatedProducts = await getAllProdotti();
      setProducts(updatedProducts);
      
      // Chiudi il popup e resetta gli stati
      setShowModal(false);
      setSelectedProduct(null);
      setNewImages([]);
      setPreviewImages([]);
      setImagesToRemove([]);
      
      alert('Prodotto aggiornato con successo!');
    } catch (error) {
      console.error('Errore nell\'aggiornamento del prodotto:', error);
      setErrorMessage('Errore durante l\'aggiornamento del prodotto.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      try {
        await deleteProdotto(productId);
        
        // Aggiorna la lista dei prodotti
        setProducts(products.filter(p => p._id !== productId));
        
        alert('Prodotto eliminato con successo!');
      } catch (error) {
        console.error('Errore durante l\'eliminazione del prodotto:', error);
        alert('Errore durante l\'eliminazione del prodotto.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Gestione Prodotti Catalogo</h2>
      
      {errorMessage && (
        <Alert variant="danger" className="mb-4">
          {errorMessage}
        </Alert>
      )}
      
      {/* Barra di ricerca */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Cerca per nome o codice prodotto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* Tabella prodotti */}
      <div className="table-responsive">
        <Table striped bordered hover>
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
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>{product.codice || 'N/A'}</td>
                <td>{product.nome}</td>
                <td>{product.categoria || 'N/A'}</td>
                <td>{product.sottocategoria || 'N/A'}</td>
                <td>{product.prezzo} {product.unita}</td>
                <td>{product.tipoImballaggio || 'N/A'}</td>
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
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleEditClick(product)}
                    className="me-2"
                  >
                    Modifica
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Elimina
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {filteredProducts.length === 0 && (
          <div className="alert alert-info">
            Nessun prodotto trovato {searchTerm ? `per la ricerca "${searchTerm}"` : ''}
          </div>
        )}
      </div>
      
      {/* Modal per modifica prodotto */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Modifica Prodotto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Prodotto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Codice Prodotto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="codice"
                    value={formData.codice}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo *</Form.Label>
                  <Form.Select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona un tipo</option>
                    {tipiProdotto.map((tipo, index) => (
                      <option key={index} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoria *</Form.Label>
                  <Form.Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona categoria</option>
                    {categoriePrincipali.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sottocategoria</Form.Label>
                  <Form.Select
                    name="sottocategoria"
                    value={formData.sottocategoria}
                    onChange={handleInputChange}
                    disabled={!formData.categoria || subcategories.length === 0}
                  >
                    <option value="">Seleziona sottocategoria</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Prezzo *</Form.Label>
                  <Form.Control
                    type="number"
                    name="prezzo"
                    value={formData.prezzo}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Unità di Misura *</Form.Label>
                  <Form.Select
                    name="unita"
                    value={formData.unita}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona unità</option>
                    {unitaMisura.map((unita, index) => (
                      <option key={index} value={unita}>{unita}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo Imballaggio *</Form.Label>
                  <Form.Select
                    name="tipoImballaggio"
                    value={formData.tipoImballaggio}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleziona tipo imballaggio</option>
                    {tipiImballaggio.map((tipo, index) => (
                      <option key={index} value={tipo}>{tipo}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pezzi Per Cartone *</Form.Label>
                  <Form.Control
                    type="number"
                    name="pezziPerCartone"
                    value={formData.pezziPerCartone}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Cartoni Per Epal *</Form.Label>
                  <Form.Control
                    type="number"
                    name="cartoniPerEpal"
                    value={formData.cartoniPerEpal}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Pezzi Per Epal</Form.Label>
                  <Form.Control
                    type="number"
                    name="pezziPerEpal"
                    value={formData.pezziPerEpal}
                    readOnly
                  />
                  <Form.Text className="text-muted">
                    Calcolato automaticamente
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                name="descrizione"
                value={formData.descrizione}
                onChange={handleInputChange}
                rows={3}
              />
            </Form.Group>
            
            {/* Sezione immagini esistenti */}
            {selectedProduct && selectedProduct.immagini && selectedProduct.immagini.length > 0 && (
              <div className="mb-4">
                <h5>Immagini Esistenti</h5>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {selectedProduct.immagini.map((imgUrl, idx) => (
                    <div key={idx} className="position-relative" style={{ width: '120px' }}>
                      <img 
                        src={imgUrl} 
                        alt={`Prodotto ${idx + 1}`} 
                        className={`img-thumbnail ${imagesToRemove.includes(imgUrl) ? 'opacity-25' : ''}`}
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      {imagesToRemove.includes(imgUrl) ? (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="position-absolute top-50 start-50 translate-middle"
                          onClick={() => handleCancelRemoveImage(imgUrl)}
                        >
                          Ripristina
                        </Button>
                      ) : (
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => handleRemoveImage(imgUrl)}
                        >
                          &times;
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Caricamento nuove immagini */}
            <Form.Group className="mb-3">
              <Form.Label>Aggiungi Nuove Immagini</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleNewImageChange}
              />
              <Form.Text className="text-muted">
                Seleziona una o più immagini da aggiungere
              </Form.Text>
            </Form.Group>
            
            {/* Anteprima nuove immagini */}
            {previewImages.length > 0 && (
              <div className="mb-4">
                <h5>Nuove Immagini</h5>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {previewImages.map((preview, idx) => (
                    <div key={idx} className="position-relative" style={{ width: '120px' }}>
                      <img 
                        src={preview} 
                        alt={`Nuova immagine ${idx + 1}`} 
                        className="img-thumbnail"
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                Annulla
              </Button>
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditProduct;