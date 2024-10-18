// src/components/Layout.js
import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default Layout;  // Change this line from 'export default App' to 'export default Layout'