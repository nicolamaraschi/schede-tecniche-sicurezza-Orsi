// frontend-catalogo-admin/src/pages/SubcategoryManagement.js
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, ListGroup, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'https://orsi-production.up.railway.app/api/prodottiCatalogo';

const SubcategoryManagement = () => {
  // Stati per i dati
  const [categories] = useState(['Domestico', 'Industriale']); // Categorie fisse
  const [selectedCategory, setSelectedCategory] = useState('Domestico');
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  
  // Stati UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Carica le sottocategorie all'avvio e quando cambia la categoria selezionata
  useEffect(() => {
    fetchSubcategories();
  }, [selectedCategory]);

  // Funzione per caricare le sottocategorie per la categoria selezionata
  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/categoria/${selectedCategory}/sottocategorie`);
      setSubcategories(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Errore nel caricamento delle sottocategorie:', error);
      setError('Impossibile caricare le sottocategorie. Riprova più tardi.');
      setLoading(false);
    }
  };

  // Gestisce il cambio della categoria selezionata
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Apre il modal per aggiungere una sottocategoria
  const handleAddClick = () => {
    setNewSubcategoryName('');
    setShowAddModal(true);
  };

  // Aggiunge una nuova sottocategoria
  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      setError('Il nome della sottocategoria non può essere vuoto');
      return;
    }

    try {
      setLoading(true);
      
      // Chiamata API per aggiungere una sottocategoria
      await axios.post(`${API_URL}/categoria/${selectedCategory}/sottocategorie`, {
        sottocategoria: newSubcategoryName
      });
      
      // Aggiorna la lista delle sottocategorie
      await fetchSubcategories();
      
      setNewSubcategoryName('');
      setShowAddModal(false);
      setSuccess('Sottocategoria aggiunta con successo!');
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => setSuccess(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Errore nell\'aggiunta della sottocategoria:', error);
      setError('Errore nell\'aggiunta della sottocategoria: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  // Apre il modal per modificare una sottocategoria
  const handleEditClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setEditSubcategoryName(subcategory);
    setShowEditModal(true);
  };

  // Modifica una sottocategoria esistente
  const handleEditSubcategory = async () => {
    if (!editSubcategoryName.trim()) {
      setError('Il nome della sottocategoria non può essere vuoto');
      return;
    }

    try {
      setLoading(true);
      
      // Chiamata API per aggiornare la sottocategoria
      await axios.put(
        `${API_URL}/categoria/${selectedCategory}/sottocategoria/${selectedSubcategory}`,
        { nuovoNome: editSubcategoryName }
      );
      
      // Aggiorna la lista delle sottocategorie
      await fetchSubcategories();
      
      setShowEditModal(false);
      setSuccess('Sottocategoria aggiornata con successo!');
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => setSuccess(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Errore nell\'aggiornamento della sottocategoria:', error);
      setError('Errore nell\'aggiornamento della sottocategoria: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  // Apre il modal per eliminare una sottocategoria
  const handleDeleteClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowDeleteModal(true);
  };

  // Elimina una sottocategoria
  const handleDeleteSubcategory = async () => {
    try {
      setLoading(true);
      
      // Chiamata API per eliminare la sottocategoria
      await axios.delete(
        `${API_URL}/categoria/${selectedCategory}/sottocategoria/${selectedSubcategory}`
      );
      
      // Aggiorna la lista delle sottocategorie
      await fetchSubcategories();
      
      setShowDeleteModal(false);
      setSuccess('Sottocategoria eliminata con successo!');
      
      // Nascondi il messaggio di successo dopo 3 secondi
      setTimeout(() => setSuccess(''), 3000);
      
      setLoading(false);
    } catch (error) {
      console.error('Errore nell\'eliminazione della sottocategoria:', error);
      setError('Errore nell\'eliminazione della sottocategoria: ' + (error.response?.data?.message || error.message));
      setLoading(false);
    }
  };

  // Resetta i messaggi di errore
  const resetError = () => {
    setError('');
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4 text-center">Gestione Sottocategorie</h2>
      
      {/* Messaggi di feedback */}
      {error && (
        <Alert variant="danger" onClose={resetError} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}
      
      <Row>
        {/* Selezione categoria */}
        <Col lg={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Categorie di Prodotti</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {categories.map((category) => (
                  <ListGroup.Item 
                    key={category}
                    active={selectedCategory === category}
                    onClick={() => handleCategorySelect(category)}
                    action
                    className="d-flex justify-content-between align-items-center"
                  >
                    {category}
                    {selectedCategory === category && (
                      <span className="badge bg-primary rounded-pill">
                        <i className="bi bi-check"></i>
                      </span>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Gestione sottocategorie */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                Sottocategorie di {selectedCategory}
              </h5>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleAddClick}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-1"></i>
                Aggiungi Sottocategoria
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Caricamento...</span>
                  </div>
                  <p className="mt-2">Caricamento sottocategorie...</p>
                </div>
              ) : subcategories.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">Nessuna sottocategoria trovata per {selectedCategory}</p>
                  <Button 
                    variant="outline-primary" 
                    onClick={handleAddClick}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Aggiungi la prima sottocategoria
                  </Button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>Nome Sottocategoria</th>
                        <th className="text-end">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((subcategory) => (
                        <tr key={subcategory}>
                          <td>{subcategory}</td>
                          <td className="text-end">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditClick(subcategory)}
                            >
                              <i className="bi bi-pencil"></i> Modifica
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteClick(subcategory)}
                            >
                              <i className="bi bi-trash"></i> Elimina
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Modal per aggiungere sottocategoria */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi Sottocategoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome Sottocategoria</Form.Label>
              <Form.Control 
                type="text" 
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Inserisci il nome della sottocategoria"
              />
              <Form.Text className="text-muted">
                Questa sottocategoria sarà aggiunta a {selectedCategory}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annulla
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddSubcategory}
            disabled={loading || !newSubcategoryName.trim()}
          >
            {loading ? 'Aggiunta in corso...' : 'Aggiungi'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal per modificare sottocategoria */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Sottocategoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome Sottocategoria</Form.Label>
              <Form.Control 
                type="text" 
                value={editSubcategoryName}
                onChange={(e) => setEditSubcategoryName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annulla
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubcategory}
            disabled={loading || !editSubcategoryName.trim()}
          >
            {loading ? 'Salvataggio in corso...' : 'Salva Modifiche'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal per eliminare sottocategoria */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Conferma Eliminazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSubcategory && (
            <p>
              Sei sicuro di voler eliminare la sottocategoria <strong>{selectedSubcategory}</strong>?
              <br />
              <small className="text-danger">
                Questa azione è irreversibile e rimuoverà l'associazione da tutti i prodotti collegati.
              </small>
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annulla
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteSubcategory}
            disabled={loading}
          >
            {loading ? 'Eliminazione in corso...' : 'Elimina'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubcategoryManagement;