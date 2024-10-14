import React from 'react';
import './Navbar.css'; // Optional, if you want custom styling

function Navbar() {
  return (
    <div className="navbar">
      <select onChange={(e) => window.location.href = e.target.value}>
        <option value="/">Home (Image Generator)</option>
        <option value="/VideoGenerator">Video Generator</option>
        <option value="/AddVoiceAudio">Text to Voice</option>
      </select>
    </div>
  );
}

export default Navbar;
