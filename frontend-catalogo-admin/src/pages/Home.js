// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaPlus, FaList, FaEdit, FaTags } from 'react-icons/fa';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center mb-5">
        <Col md={10} className="text-center">
          <h1 className="display-4 fw-bold">Gestione Catalogo Prodotti</h1>
          <p className="lead text-muted">
            Sistema di gestione completo per i prodotti delle categorie Domestico e Industriale
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm hover-card">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <FaPlus className="text-primary" style={{ fontSize: '3rem' }} />
              </div>
              <Card.Title className="text-center">Aggiungi Prodotto</Card.Title>
              <Card.Text className="text-muted">
                Inserisci un nuovo prodotto nel catalogo con tutti i dettagli e le immagini.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/add-product" variant="outline-primary">
                  Aggiungi Prodotto
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm hover-card">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <FaList className="text-success" style={{ fontSize: '3rem' }} />
              </div>
              <Card.Title className="text-center">Visualizza Prodotti</Card.Title>
              <Card.Text className="text-muted">
                Consulta l'intero catalogo prodotti con possibilità di filtrare per categoria e sottocategoria.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/view-products" variant="outline-success">
                  Visualizza Catalogo
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm hover-card">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <FaEdit className="text-warning" style={{ fontSize: '3rem' }} />
              </div>
              <Card.Title className="text-center">Modifica Prodotti</Card.Title>
              <Card.Text className="text-muted">
                Aggiorna le informazioni dei prodotti esistenti, cambia immagini e dettagli.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/edit-product" variant="outline-warning">
                  Modifica Prodotti
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} className="mb-4">
          <Card className="h-100 shadow-sm hover-card">
            <Card.Body className="d-flex flex-column">
              <div className="text-center mb-4">
                <FaTags className="text-info" style={{ fontSize: '3rem' }} />
              </div>
              <Card.Title className="text-center">Gestione Sottocategorie</Card.Title>
              <Card.Text className="text-muted">
                Aggiungi, modifica o elimina le sottocategorie per le categorie Domestico e Industriale.
              </Card.Text>
              <div className="mt-auto text-center">
                <Button as={Link} to="/categories" variant="outline-info">
                  Gestisci Sottocategorie
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Card className="bg-light">
            <Card.Body>
              <h2 className="h4 mb-3">Struttura del Catalogo</h2>
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <div className="border rounded p-3">
                    <h3 className="h5 text-primary">Domestico</h3>
                    <p className="text-muted small">Prodotti per uso domestico e civile</p>
                    <div className="d-flex justify-content-center">
                      <Link to="/categories" className="btn btn-sm btn-outline-primary">
                        Gestisci Sottocategorie
                      </Link>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border rounded p-3">
                    <h3 className="h5 text-success">Industriale</h3>
                    <p className="text-muted small">Prodotti per uso professionale e industriale</p>
                    <div className="d-flex justify-content-center">
                      <Link to="/categories" className="btn btn-sm btn-outline-success">
                        Gestisci Sottocategorie
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;