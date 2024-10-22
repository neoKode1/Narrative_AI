import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageGenerator.css';

// Fallback image as a data URL - a simple gray rectangle with text
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23999' text-anchor='middle' dy='.3em'%3EImage Not Found%3C/text%3E%3C/svg%3E";

const ImageGenerator = () => {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreview, setReferencePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Component mounted - Loading stored images');
    const storedImages = JSON.parse(localStorage.getItem('imageData')) || [];
    console.log('Retrieved stored images:', storedImages);
    setGeneratedImages(storedImages);
  }, []);

  const handleImageClick = (imageUrl) => {
    console.log('Image clicked:', imageUrl);
    navigate('/VideoGenerator', { state: { selectedImage: imageUrl } });
  };

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
      setError(null);
    }
  };

  const removeReference = () => {
    setReferenceImage(null);
    if (referencePreview) {
      URL.revokeObjectURL(referencePreview);
    }
    setReferencePreview(null);
  };

  const generateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    console.log('Starting image generation process');
    console.log('Current prompt:', prompt);
    
    setLoading(true);
    setError(null);

    try {
      console.log('Sending request to backend');
      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      if (referenceImage) {
        formData.append('referenceImage', referenceImage);
      }

      const response = await fetch('/api/image/generate', {
        method: 'POST',
        body: formData,
      });

      console.log('Response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.images && data.images.length > 0) {
        const generatedImageUrl = data.images[0];
        console.log('New image URL:', generatedImageUrl);

        // Verify the image URL
        try {
          const imgResponse = await fetch(generatedImageUrl);
          if (!imgResponse.ok) {
            throw new Error('Generated image URL is not accessible');
          }
        } catch (imgError) {
          console.error('Image verification failed:', imgError);
          throw new Error('Failed to verify generated image');
        }

        const updatedImages = [...generatedImages, generatedImageUrl];
        console.log('Updating images array:', updatedImages);
        
        setGeneratedImages(updatedImages);
        localStorage.setItem('imageData', JSON.stringify(updatedImages));
        console.log('Images saved to localStorage');

        setPrompt('');
        if (referenceImage) {
          removeReference();
        }
      } else {
        console.error('No image URL in response:', data);
        throw new Error('No image URL received from server');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setError(error.message || 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
      console.log('Image generation process completed');
    }
  };

  return (
    <div className="image-generator">
      <video autoPlay loop muted className="background-video"
        onError={(e) => console.error('Video loading error:', e)}
      >
        <source src="/madclownvid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h2>Image Generator</h2>
        <form onSubmit={generateImage} className="image-upload-form">
          <div className="input-group">
            <textarea
              id="prompt-input"
              name="prompt"
              value={prompt}
              onChange={(e) => {
                console.log('Prompt updated:', e.target.value);
                setPrompt(e.target.value);
              }}
              placeholder="Enter a detailed prompt for image generation"
              className="prompt-input"
              rows="4"
              required
            />

            <div className="reference-upload-section">
              <label htmlFor="reference-upload" className="reference-upload-label">
                Upload Reference Image
                <input
                  type="file"
                  id="reference-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleReferenceUpload}
                  className="reference-upload-input"
                />
              </label>
              
              {referencePreview && (
                <div className="reference-preview">
                  <img src={referencePreview} alt="Reference" className="reference-image" />
                  <button
                    type="button"
                    onClick={removeReference}
                    className="remove-reference"
                  >
                    Remove Reference
                  </button>
                </div>
              )}
            </div>

            <button 
              type="submit" 
              id="generate-button" 
              className="generate-btn" 
              disabled={loading}
            >
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
              onLoad={() => console.log('Image loaded successfully:', imageUrl)}
              onError={(e) => {
                console.error('Image loading error:', {
                  url: imageUrl,
                  error: e
                });
                e.target.src = FALLBACK_IMAGE;
                e.target.alt = 'Image load error';
              }}
              className="generated-img"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;