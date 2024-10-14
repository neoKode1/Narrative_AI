import React, { useState, useEffect } from 'react';
import './VideoGenerator.css';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

function VideoGenerator() {
  const location = useLocation();
  const { selectedImage } = location.state || {};

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptText, setPromptText] = useState('');

  useEffect(() => {
    console.log("Received selectedImage prop:", selectedImage);
  }, [selectedImage]);

  const generateVideo = async () => {
    if (!selectedImage) {
      console.error('No image selected.');
      return;
    }
  
    setLoading(true);
    try {
      // Make sure you're sending a valid image URL and prompt in JSON format
      const response = await fetch('http://localhost:5000/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,  // This should be the URL of the image
          animationPrompt: promptText,  // This should be your animation prompt
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setVideoUrl(data.videoUrl);
      } else {
        console.error('Backend error:', data.error);
      }
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const renderImagePreview = () => {
    // Check if `selectedImage` is a File/Blob or URL string
    if (selectedImage instanceof File || selectedImage instanceof Blob) {
      // If it's a File or Blob, use URL.createObjectURL
      return <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ width: '300px', height: 'auto' }} />;
    } else if (typeof selectedImage === 'string') {
      // If it's a URL string, use it directly
      return <img src={selectedImage} alt="Selected" style={{ width: '300px', height: 'auto' }} />;
    } else {
      return <p>No valid image selected</p>;
    }
  };

  return (
    <div className="video-generator">
      <Navbar />
      <video autoPlay loop muted className="background-video">
        <source src="/sheff.mp4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h1>Video Generator</h1>

        {/* Render image preview */}
        {selectedImage && renderImagePreview()}

        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Enter animation prompt"
          className="prompt-input"
        />

        <button onClick={generateVideo} disabled={loading}>
          {loading ? 'Generating Video...' : 'Generate Video'}
        </button>

        {videoUrl && (
          <div>
            <h2>Generated Video:</h2>
            <video src={videoUrl} controls style={{ width: '100%', maxWidth: '600px' }} />
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoGenerator;
