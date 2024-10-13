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
      // Create FormData to send the image file and the prompt text
      const formData = new FormData();
      formData.append('image', selectedImage); // Image file
      formData.append('promptText', promptText); // Prompt

      // Send image to backend for upload to S3 and video generation
      const response = await fetch('http://localhost:5000/api/video/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
    } finally {
      setLoading(false);
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

        {selectedImage && (
          <img src={URL.createObjectURL(selectedImage)} alt="Selected" style={{ width: '300px', height: 'auto' }} />
        )}

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
