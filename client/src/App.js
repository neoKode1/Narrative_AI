import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import AddVoiceAudio from './components/AddVoiceAudio';

function HomePage() {
  return (
    <div className="App">
      {/* First video section */}
      <div className="video-section">
        <video autoPlay loop muted className="background-video">
          <source src="/gen-A.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay-text">
          <h1>Narrative AI</h1>
          <p>Create an image, animate it, and add voice to create your narrative.</p>
        </div>
      </div>

      {/* Second video section using the clown video */}
      <div className="video-section">
        <video autoPlay loop muted className="background-video">
          <source src="/madclownvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay-text">
          <h1>Unleash Creativity</h1>
          <p>
            Use advanced tools to bring your ideas to life. Narrative AI helps you create 
            vivid and dynamic animations from simple images.
          </p>
        </div>
      </div>

      {/* Third video section using the sheff video */}
      <div className="video-section">
        <video autoPlay loop muted className="background-video">
          <source src="/sheff.mp4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="overlay-text">
          <h1>Bring Stories to Life</h1>
          <p>
            Add voice, personalize the narrative, and share your creations with the world. 
            Elevate your stories with Narrative AI's intuitive tools.
          </p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ImageGenerator" element={<ImageGenerator />} />
        <Route path="/VideoGenerator" element={<VideoGenerator />} />
        <Route path="/AddVoiceAudio" element={<AddVoiceAudio />} />
      </Routes>
    </Layout>
  );
}

export default App;
