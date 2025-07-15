// frontend-catalogo-admin/src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import { createProdotto, getSubcategoriesByCategory } from '../api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    nome: '',
    codice: '',
    tipo: '',
    prezzo: '',
    unita: '',
    categoria: '',
    sottocategoria: '',
    tipoImballaggio: '',
    pezziPerCartone: '',
    cartoniPerEpal: '',
    pezziPerEpal: '',
    descrizione: ''
  });
  
  const [subcategories, setSubcategories] = useState([]);
  const [immagini, setImmagini] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const tipiProdotto = [
    'BULK',
    'BARATTOLO',
    'SECCHIO',
    'ASTUCCIO VUOTO',
    'ASTUCCIO PERSONALIZZATO',
    'MONODOSE CARTA'
  ];
  
  const unitaMisura = ['€/KG', '€/PZ'];
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
  
  useEffect(() => {
    if (formData.pezziPerCartone && formData.cartoniPerEpal) {
      const pezziPerEpal = parseInt(formData.pezziPerCartone) * parseInt(formData.cartoniPerEpal);
      setFormData(prev => ({
        ...prev,
        pezziPerEpal
      }));
    }
  }, [formData.pezziPerCartone, formData.cartoniPerEpal]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
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
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImmagini(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.categoria && subcategories.length > 0 && !formData.sottocategoria) {
      setErrorMessage('Per favore, seleziona una sottocategoria.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const prodottoData = { ...formData };
      
      await createProdotto(prodottoData, immagini);
      
      setFormData({
        nome: '',
        codice: '',
        tipo: '',
        prezzo: '',
        unita: '',
        categoria: '',
        sottocategoria: '',
        tipoImballaggio: '',
        pezziPerCartone: '',
        cartoniPerEpal: '',
        pezziPerEpal: '',
        descrizione: ''
      });
      setImmagini([]);
      setPreviewImages([]);
      
      setSuccessMessage('Prodotto aggiunto con successo!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Errore:', error);
      setErrorMessage('Si è verificato un errore durante il salvataggio del prodotto.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, [previewImages]);
  
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Aggiungi Nuovo Prodotto</h2>
      
      {successMessage && (
        <Alert variant="success">{successMessage}</Alert>
      )}
      
      {errorMessage && (
        <Alert variant="danger">{errorMessage}</Alert>
      )}
      
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome Prodotto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Codice Prodotto *</Form.Label>
                  <Form.Control
                    type="text"
                    name="codice"
                    value={formData.codice}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  <Form.Label>Sottocategoria *</Form.Label>
                  <Form.Select
                    name="sottocategoria"
                    value={formData.sottocategoria}
                    onChange={handleChange}
                    disabled={!formData.categoria || subcategories.length === 0}
                    required={formData.categoria && subcategories.length > 0}
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
                    onChange={handleChange}
                    step="0.01"
                    min="0.01"
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Descrizione</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descrizione"
                    value={formData.descrizione}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Immagini Prodotto *</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
                multiple
                accept="image/*"
                required
              />
              <Form.Text className="text-muted">
                Puoi selezionare più immagini. Formati supportati: JPG, PNG, GIF.
              </Form.Text>
            </Form.Group>
            
            {previewImages.length > 0 && (
              <div className="mb-3">
                <p>Anteprime:</p>
                <div className="d-flex flex-wrap gap-2">
                  {previewImages.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Anteprima ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="img-thumbnail"
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? 'Salvataggio in corso...' : 'Salva Prodotto'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
