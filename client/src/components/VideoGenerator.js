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
  const [error, setError] = useState('');
  const MAX_PROMPT_LENGTH = 512;

  useEffect(() => {
    console.log("Current state:", { selectedImage, promptText });
  }, [selectedImage, promptText]);

  const generateVideo = async () => {
    if (!selectedImage || !promptText.trim()) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log("Sending request with:", { imageUrl: selectedImage, animationPrompt: promptText });
      const response = await fetch('http://localhost:5000/api/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: selectedImage,
          animationPrompt: promptText,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }
      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error('Error generating video:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-generator">
      <Navbar />
      <video autoPlay loop muted className="background-video">
        <source src="/gremlinvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">
        <h1>Video Generator</h1>
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" style={{ width: '300px', height: 'auto' }} />
        ) : (
          <p>No image selected. Please select an image first.</p>
        )}
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
          placeholder="Enter animation prompt (max 512 characters)"
          className="prompt-input"
          rows={8}
          style={{
            width: '100%',
            maxWidth: '600px',
            minHeight: '150px',
            padding: '10px',
            fontSize: '16px',
            lineHeight: '1.5',
            resize: 'vertical'
          }}
        />
        <p>{promptText.length}/{MAX_PROMPT_LENGTH} characters</p>
        <button 
          onClick={generateVideo} 
          disabled={loading || !selectedImage || !promptText.trim()}
        >
          {loading ? 'Generating Video...' : 'Generate Video'}
        </button>
        <p>Button state: {loading || !selectedImage || !promptText.trim() ? 'Disabled' : 'Enabled'}</p>
        <p>Selected Image: {selectedImage ? 'Yes' : 'No'}</p>
        <p>Prompt Text: {promptText ? 'Yes' : 'No'}</p>
        {error && <p className="error">{error}</p>}
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