import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useCatalog } from '../../context/CatalogContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { categories, loading } = useCatalog();
  
  // Close sidebar on window resize (for responsive behavior)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="main-layout">
      <Header onMenuClick={toggleSidebar} />
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar} 
        categories={categories} 
      />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
