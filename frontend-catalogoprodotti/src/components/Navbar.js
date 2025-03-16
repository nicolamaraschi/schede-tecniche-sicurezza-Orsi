import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { logoutUtente, isAuthenticated } from '../api';

const NavigationBar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logoutUtente();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <div className="container">
        <Navbar.Brand as={Link} to="/home">
          Catalogo Prodotti
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-center w-100">
            {authenticated ? (
              // Menu per utenti autenticati
              <>
                <Nav.Link as={Link} to="/home" className="mx-2">Home</Nav.Link>
                <Nav.Link as={Link} to="/add-product" className="mx-2">Aggiungi Prodotto</Nav.Link>
                <Nav.Link as={Link} to="/view-products" className="mx-2">Visualizza Prodotti</Nav.Link>
                <Nav.Link as={Link} to="/edit-product" className="mx-2">Modifica Prodotto</Nav.Link>
                <Button 
                  variant="outline-danger" 
                  className="ms-auto"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              // Menu per utenti non autenticati
              <Nav.Link as={Link} to="/login" className="mx-2">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;