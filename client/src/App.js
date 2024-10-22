import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import ImageGenerator from './components/ImageGenerator';
import VideoGenerator from './components/VideoGenerator';
import AddVoiceAudio from './components/AddVoiceAudio';

const videoData = [
  {
    src: "/gen-A.mp4",
    title: "Narrative AI",
    description: "Create an image, animate it, and add voice to create your narrative.",
    features: [
      "• AI-Powered Image Generation",
      "• Dynamic Video Animation",
      "• Natural Voice Synthesis"
    ]
  },
  {
    src: "/madclownvid.mp4",
    title: "Unleash Creativity",
    description: "Use advanced tools to bring your ideas to life. Narrative AI helps you create vivid and dynamic animations from simple images.",
    features: []
  },
  {
    src: "/sheff.mp4.mp4",
    title: "Bring Stories to Life",
    description: "Add voice, personalize the narrative, and share your creations with the world. Elevate your stories with Narrative AI's intuitive tools.",
    features: []
  }
];

function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
        setIsTransitioning(false);
      }, 1000); // Wait for fade out before changing video
    }, 8000); // Change video every 8 seconds

    return () => clearInterval(timer);
  }, []);

  const currentVideo = videoData[currentIndex];

  return (
    <div className="App">
      <div className={`video-section ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <video 
          autoPlay 
          loop 
          muted 
          key={currentVideo.src}
          className="background-video"
        >
          <source src={currentVideo.src} type="video/mp4" />
        </video>
        <div className="overlay-text main-hero">
          <h1>{currentVideo.title}</h1>
          <p className="hero-description">{currentVideo.description}</p>
          {currentVideo.features.length > 0 && (
            <div className="feature-points">
              {currentVideo.features.map((feature, index) => (
                <p key={index}>{feature}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="video-nav">
        {videoData.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, 1000);
            }}
          />
        ))}
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