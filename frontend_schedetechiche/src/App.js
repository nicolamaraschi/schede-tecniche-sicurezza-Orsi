import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          {/* Aggiungi altre rotte qui */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
