import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Login from './pages/login'; // Importa il componente di login
import CreateProduct from './components/CreateProduct';
import UploadDocument from './components/UploadDocument';
import ViewDocuments from './components/ViewDocuments';
import ProductInfo from './components/ProductInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Aggiunta della rotta per il login */}
          <Route path="/create-product" element={<CreateProduct />} /> {/* Aggiunta della rotta per creare un prodotto */}
          <Route path="/upload-document" element={<UploadDocument />} /> {/* Aggiunta della rotta per caricare documenti */}
          <Route path="/view-documents" element={<ViewDocuments />} /> {/* Aggiunta della rotta per visualizzare documenti */}
          <Route path="/product-info" element={<ProductInfo />} /> {/* Aggiunta della rotta per informazioni sui prodotti */}
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
