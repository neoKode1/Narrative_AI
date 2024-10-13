import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import VideoGenerator from './components/VideoGenerator';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/VideoGenerator" element={<VideoGenerator />} />
      {/* Placeholder for future TextToVoice component */}
      <Route path="/text-to-voice" element={<div>Text to Voice Page</div>} />
    </Routes>
  </Router>
);
