import React, { useState, useEffect } from 'react';
import './App.css';
import ImageGenerator from './components/ImageGenerator';

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);

  // Retrieve images from localStorage on component mount
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageData')) || [];
    setGeneratedImages(storedImages);
  }, []);

  // Store image URLs in state and localStorage
  function storeImageData(imageUrl) {
    console.log(imageUrl); // Check if the correct image URL is logged
    const updatedImages = [...generatedImages, imageUrl];
    setGeneratedImages(updatedImages);
    localStorage.setItem('imageData', JSON.stringify(updatedImages));
  }

  return (
    <div className="App">
      <h1>Narrative AI</h1>
      <h2>Create an image, animate it, and add voice to create your narrative.</h2>

      {/* Image Generation Section */}
      <ImageGenerator onImageGenerated={storeImageData} />

      {/* Display generated images */}
      <div className="grid">
        {generatedImages.map((imageUrl, index) => (
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
