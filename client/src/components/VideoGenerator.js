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
  const [progress, setProgress] = useState('');
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
    setProgress('Starting video generation...');
    
    try {
      console.log("Sending request with:", { imageUrl: selectedImage, animationPrompt: promptText });
      setProgress('Sending request to server...');
      
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
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      setProgress('Processing response...');
      const data = await response.json();
      
      if (!data.videoUrl) {
        throw new Error('No video URL in response');
      }

      setProgress('Loading video...');
      setVideoUrl(data.videoUrl);
      setProgress('');
    } catch (error) {
      console.error('Error generating video:', error);
      setError(error.message || 'Failed to generate video');
      setVideoUrl(null);
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
          disabled={loading}
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
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Generating Video...' : 'Generate Video'}
        </button>
        
        {progress && <p className="progress">{progress}</p>}
        {error && <p className="error">{error}</p>}
        
        {videoUrl && (
          <div>
            <h2>Generated Video:</h2>
            <video 
              src={videoUrl} 
              controls 
              style={{ width: '100%', maxWidth: '600px' }}
              onError={(e) => setError('Failed to load video: ' + e.message)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoGenerator;