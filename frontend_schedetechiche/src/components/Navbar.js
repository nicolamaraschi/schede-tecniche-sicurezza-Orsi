import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Logo
        </Link>
        <div className="navbar-menu">
          <Link to="/login" className="navbar-item">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
