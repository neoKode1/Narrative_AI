import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageGenerator.css';

function ImageGenerator() {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageData')) || [];
    setGeneratedImages(storedImages);
  }, []);

  const handleImageClick = (imageUrl) => {
    navigate('/VideoGenerator', { state: { selectedImage: imageUrl } });
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!prompt) {
      setError("Please enter a prompt.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/image/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        const generatedImageUrl = `http://localhost:5000${data.imageUrl}`;

        const updatedImages = [...generatedImages, generatedImageUrl];
        setGeneratedImages(updatedImages);
        localStorage.setItem('imageData', JSON.stringify(updatedImages));

        setPrompt('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred while generating the image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-generator">
      {/* Add Video Background */}
      <video autoPlay loop muted className="background-video">
        <source src="/madclownvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h2>Image Generator</h2>
        <form onSubmit={handleGenerateImage} className="image-upload-form">
          <div className="input-group">
            <textarea
              id="prompt-input"
              name="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a detailed prompt for image generation"
              className="prompt-input"
              rows="4"
              required
            />
            <button type="submit" id="generate-button" className="generate-btn" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Image'}
            </button>
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="grid">
          {generatedImages.length > 0 && generatedImages.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Generated ${index + 1}`}
              onClick={() => handleImageClick(imageUrl)}
              onError={(e) => {e.target.src = 'http://localhost:5000/public/placeholder-image.png'; e.target.alt = 'Image load error';}}
              className="generated-img"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
