import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import ViewProducts from './pages/ViewProducts';
import EditProduct from './pages/EditProduct';
import CategoryManagement from './pages/SubcategoryManagement';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Route pubblica per il login */}
          <Route path="/login" element={<Login />} />
          
          {/* Route principale che reindirizza alla home o al login */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Routes protette che richiedono autenticazione */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/add-product" 
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/view-products" 
            element={
              <ProtectedRoute>
                <ViewProducts />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/edit-product" 
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <CategoryManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Route di fallback che reindirizza alla home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;