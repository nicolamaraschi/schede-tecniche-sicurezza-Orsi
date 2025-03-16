// frontend-catalogoprodotti/src/pages/AddProduct.js
import React, { useState, useEffect } from 'react';
import { createProdotto } from '../api';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const AddProduct = () => {
  // Stato per il form
  const [formData, setFormData] = useState({
    nome: '',
    codice: '',
    tipo: '',
    prezzo: '',
    unita: '',
    macroCategoria: '',
    categoria: '',
    sottocategoriaId: '',
    tipoImballaggio: '',
    pezziPerCartone: '',
    cartoniPerEpal: '',
    pezziPerEpal: '',
    descrizione: ''
  });
  
  // Stato per le categorie e sottocategorie
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Stato per le immagini
  const [immagini, setImmagini] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // Stati per il feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Opzioni per i dropdown
  const tipiProdotto = [
    'BULK',
    'BARATTOLO',
    'SECCHIO',
    'ASTUCCIO VUOTO',
    'ASTUCCIO PERSONALIZZATO',
    'MONODOSE CARTA'
  ];
  
  const unitaMisura = ['KG', 'PZ'];
  
  const macroCategorie = ['Linea Casa', 'Linea Industriale'];
  
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
  
  // Funzione per caricare le categorie
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
      setErrorMessage('Impossibile caricare le categorie');
    }
  };
  
  // Carica le categorie all'avvio
  useEffect(() => {
    fetchCategories();
  }, []);
  
  // Aggiorna le sottocategorie quando cambia la categoria
  useEffect(() => {
    if (formData.categoria) {
      const selectedCategory = categories.find(cat => cat._id === formData.categoria);
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
    }
  }, [formData.categoria, categories]);
  
  // Aggiorna automaticamente pezziPerEpal quando cambiano pezziPerCartone o cartoniPerEpal
  useEffect(() => {
    if (formData.pezziPerCartone && formData.cartoniPerEpal) {
      const pezziPerEpal = parseInt(formData.pezziPerCartone) * parseInt(formData.cartoniPerEpal);
      setFormData(prev => ({
        ...prev,
        pezziPerEpal
      }));
    }
  }, [formData.pezziPerCartone, formData.cartoniPerEpal]);
  
  // Gestione input form
  const handleChange = (e) => {
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
  
  // Gestione selezione immagini
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImmagini(files);
    
    // Crea URL per le anteprime
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };
  
  // Invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await createProdotto(formData, immagini);
      
      // Reset del form
      setFormData({
        nome: '',
        codice: '',
        tipo: '',
        prezzo: '',
        unita: '',
        macroCategoria: '',
        categoria: '',
        sottocategoriaId: '',
        tipoImballaggio: '',
        pezziPerCartone: '',
        cartoniPerEpal: '',
        pezziPerEpal: '',
        descrizione: ''
      });
      setImmagini([]);
      setPreviewImages([]);
      
      // Mostra messaggio di successo
      setSuccessMessage('Prodotto aggiunto con successo!');
      
      // Nascondi messaggio dopo 3 secondi
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
  
  // Pulizia delle URL delle anteprime quando il componente si smonta
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
                  <Form.Label>Macro-Categoria *</Form.Label>
                  <Form.Select
                    name="macroCategoria"
                    value={formData.macroCategoria}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleziona macro-categoria</option>
                    {macroCategorie.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
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
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sottocategoria</Form.Label>
                  <Form.Select
                    name="sottocategoriaId"
                    value={formData.sottocategoriaId}
                    onChange={handleChange}
                    disabled={!formData.categoria || subcategories.length === 0}
                  >
                    <option value="">Seleziona sottocategoria</option>
                    {subcategories.map((subcat) => (
                      <option key={subcat.id} value={subcat.id}>
                        {subcat.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
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
            </Row>
            
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
            
            <Form.Group className="mb-3">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                rows="3"
              />
            </Form.Group>
            
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