// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="hamburger" onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className={`menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/ImageGenerator" onClick={toggleMenu}>Image Generator</Link>
        <Link to="/VideoGenerator" onClick={toggleMenu}>Video Generator</Link>
        <Link to="/AddVoiceAudio" onClick={toggleMenu}>Add Voice Audio</Link>
      </div>
    </nav>
  );
}

export default Navbar;