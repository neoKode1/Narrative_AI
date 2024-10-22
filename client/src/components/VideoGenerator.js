import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './VideoGenerator.css';
import Navbar from './Navbar';

function VideoGenerator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedImage } = location.state || {};
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptText, setPromptText] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const MAX_PROMPT_LENGTH = 512;

  useEffect(() => {
    console.log("Current state:", { selectedImage, promptText });
  }, [selectedImage, promptText]);

  const handleReferenceUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (JPG, PNG, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      setReferenceImage(file);
      const previewUrl = URL.createObjectURL(file);
      setReferencePreview(previewUrl);
      setError('');
    }
  };

  const removeReference = () => {
    setReferenceImage(null);
    if (referencePreview) {
      URL.revokeObjectURL(referencePreview);
    }
    setReferencePreview(null);
  };

  const generateVideo = async () => {
    if (!selectedImage || !promptText.trim()) {
      setError('Please select an image and enter a prompt.');
      return;
    }
    setLoading(true);
    setError('');
    setProgress('Starting video generation...');
    
    try {
      const formData = new FormData();
      formData.append('imageUrl', selectedImage);
      formData.append('animationPrompt', promptText);
      if (referenceImage) {
        formData.append('referenceImage', referenceImage);
      }
      
      setProgress('Sending request to server...');
      
      const response = await fetch('http://localhost:5000/api/video/generate', {
        method: 'POST',
        body: formData
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
      
      if (referenceImage) {
        removeReference();
      }
    } catch (error) {
      console.error('Error generating video:', error);
      setError(error.message || 'Failed to generate video');
      setVideoUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAudio = () => {
    if (videoUrl) {
      navigate('/AddVoiceAudio', { state: { videoUrl } });
    }
  };

  return (
    <div className="video-generator">
      <Navbar />
      <video autoPlay loop muted className="background-video">
        <source src="/gremlinvid.mp4" type="video/mp4" />
      </video>
      <div className="content">
        <h1>Video Generator</h1>
        
        <div className="selected-image">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" />
          ) : (
            <p>No image selected. Please select an image first.</p>
          )}
        </div>

        <div className="reference-upload-section">
          <label className="reference-upload-label">
            Upload Reference Video Style
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleReferenceUpload}
              className="reference-upload-input"
            />
          </label>
          
          {referencePreview && (
            <div className="reference-preview">
              <img src={referencePreview} alt="Reference" className="reference-image" />
              <button onClick={removeReference} className="remove-reference">×</button>
            </div>
          )}
        </div>

        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
          placeholder="Enter animation prompt (max 512 characters)"
          className="prompt-input"
          rows={8}
          disabled={loading}
        />
        <p className="char-count">{promptText.length}/{MAX_PROMPT_LENGTH} characters</p>

        <button 
          onClick={generateVideo} 
          disabled={loading || !selectedImage || !promptText.trim()}
          className="generate-btn"
        >
          {loading ? 'Generating Video...' : 'Generate Video'}
        </button>
        
        {progress && <p className="progress">{progress}</p>}
        {error && <p className="error">{error}</p>}
        
        {videoUrl && (
          <div className="video-result">
            <h2>Generated Video:</h2>
            <video 
              src={videoUrl} 
              controls 
              className="generated-video"
              onError={(e) => setError('Failed to load video: ' + e.message)}
            />
            <button 
              onClick={handleAddAudio}
              className="add-audio-btn"
            >
              Add Voice/Audio to Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoGenerator;