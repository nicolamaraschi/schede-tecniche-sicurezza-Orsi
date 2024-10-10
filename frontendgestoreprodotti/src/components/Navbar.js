import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Assicurati che Bootstrap sia importato

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Gestione Prodotti</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Lista Prodotti</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products/create">Crea Prodotto</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products/edit">Modifica Prodotto</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">Lista Categorie</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories/create">Crea Categoria</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories/edit">Modifica Categoria</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
