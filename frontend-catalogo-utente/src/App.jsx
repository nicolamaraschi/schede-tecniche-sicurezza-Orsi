import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CatalogProvider } from './context/CatalogContext';
import { ProductProvider } from './context/ProductContext';
import { LanguageProvider } from './context/LanguageContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import NotFoundPage from './pages/NotFoundPage';
import ContattiPage from './pages/ContattiPage';
import ErrorBoundary from './components/common/ErrorBoundary';
import APIDiagnosticTool from './components/APIDiagnosticTool'; // Importa il componente
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <CatalogProvider>
          <ProductProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="catalogo" element={
                    <ErrorBoundary>
                      <CatalogPage />
                    </ErrorBoundary>
                  } />
                  <Route path="catalogo/categoria/:categoryId" element={
                    <ErrorBoundary>
                      <CategoryPage />
                    </ErrorBoundary>
                  } />
                  <Route path="catalogo/categoria/:categoryId/sottocategoria/:subcategoryId" element={
                    <ErrorBoundary>
                      <CategoryPage />
                    </ErrorBoundary>
                  } />
                  <Route path="prodotto/:productId" element={
                    <ErrorBoundary>
                      <ProductDetailPage />
                    </ErrorBoundary>
                  } />
                  <Route path="contatti" element={<ContattiPage />} />
                  
                  {/* Nuova route per diagnostica */}
                  <Route 
                    path="/debug" 
                    element={
                      process.env.NODE_ENV === 'development' ? (
                        <APIDiagnosticTool />
                      ) : (
                        <NotFoundPage />
                      )
                    } 
                  />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ProductProvider>
        </CatalogProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;