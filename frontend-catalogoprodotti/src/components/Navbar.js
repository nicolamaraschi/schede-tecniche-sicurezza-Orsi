import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { Navbar, Nav } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          Catalogo Prodotti
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-center w-100">
            <Nav.Link as={Link} to="/" className="mx-2">Home</Nav.Link>
            <Nav.Link as={Link} to="/add-product" className="mx-2">Aggiungi Prodotto</Nav.Link>
            <Nav.Link as={Link} to="/view-products" className="mx-2">Visualizza Prodotti</Nav.Link>
            <Nav.Link as={Link} to="/edit-product" className="mx-2">Modifica Prodotto</Nav.Link>
            <Nav.Link as={Link} to="/login" className="mx-2">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;
