import React, { useState, useEffect } from 'react';
import './App.css';
import ImageGenerator from './components/ImageGenerator';

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [referenceImage, setReferenceImage] = useState(null);

  // Retrieve images from localStorage on component mount
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageData')) || [];
    setGeneratedImages(storedImages);
  }, []);

  // Handle reference image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Generates a preview URL
      setReferenceImage(imageUrl);
    }
  };

  // Store image URLs in state and localStorage
  function storeImageData(imageUrl) {
    if (imageUrl) {
      const updatedImages = [...generatedImages, imageUrl];
      setGeneratedImages(updatedImages); // Update state with new images
      localStorage.setItem('imageData', JSON.stringify(updatedImages)); // Store in localStorage
    }
  }

  // Function to reset the input field
  function resetPrompt() {
    // Clear any prompt-related logic if needed
  }

  return (
    <div className="App">
      {/* Welcome message */}
      <div className="welcome-message">
        <h1>Narrative AI</h1>
        <p>Create an image, animate it, and add voice to create your narrative.</p>
      </div>

      {/* Reference Image Upload */}
      <div className="reference-upload">
        <h3>Upload a reference image</h3>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {referenceImage && (
          <img src={referenceImage} alt="Reference" className="reference-img" />
        )}
      </div>

      {/* Image Generation Section with Reset Function */}
      <ImageGenerator
        onImageGenerated={storeImageData}
        resetPrompt={resetPrompt}
        referenceImage={referenceImage}
      />

      {/* Display generated images dynamically after each generation */}
      <div className="grid">
        {generatedImages.length > 0 && generatedImages.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt="Generated"
            onError={(e) => (e.target.src = 'placeholder-image.png')} // Fallback for broken images
            style={{ width: '200px', height: 'auto', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
