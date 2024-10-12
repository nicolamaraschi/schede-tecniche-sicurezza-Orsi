import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductCreate from './pages/ProductCreate';
import ProductEdit from './pages/ProductEdit';
import CategoryList from './pages/CategoryList';
import CategoryCreate from './pages/CategoryCreate';
import CategoryEdit from './pages/CategoryEdit';
import Login from './pages/Login';
import './App.css'; // Make sure you have a CSS file for general layout
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Include sia Bootstrap JS che Popper.js

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/create" element={<ProductCreate />} />
          <Route path="/products/edit/" element={<ProductEdit />} /> {/* Modifica qui */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/create" element={<CategoryCreate />} />
          <Route path="/categories/edit" element={<CategoryEdit />} /> {/* Se necessario */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
