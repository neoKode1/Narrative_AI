import React, { useState, useEffect } from 'react';
import './App.css';
//import ImageGenerator from './components/ImageGenerator';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar

function App() {
  const [generatedImages, setGeneratedImages] = useState([]);
  const [referenceImage, setReferenceImage] = useState(null);
  const [prompt, setPrompt] = useState(''); // Prompt input field
  const navigate = useNavigate();

  // Retrieve images from localStorage on component mount
  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem('imageData')) || [];
    setGeneratedImages(storedImages);
  }, []);

  // Handle reference image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setReferenceImage(imageUrl);
    }
  };

 // Remove this function if you're not using it
// function storeImageData(imageUrl) {
//   // Do something with imageUrl
// }

  // Navigate to VideoGenerator with the selected image
  function handleImageClick(imageUrl) {
    navigate('/VideoGenerator', { state: { selectedImage: imageUrl } });
  }

  // Handle form submit
  // Handle form submit
const handleGenerateImage = async (e) => {
  e.preventDefault();

  if (!referenceImage || !prompt) {
    alert("Please upload an image and enter a prompt.");
    return;
  }

  // Assuming the referenceImage is a Blob/File object, not just a URL
  const fileInput = document.querySelector('.file-input').files[0];

  // Prepare FormData
  const formData = new FormData();
  formData.append('image', fileInput);  // File to upload
  formData.append('prompt', prompt);    // Prompt text

  try {
    const response = await fetch('http://localhost:5000/api/image/generate', {
      method: 'POST',
      body: formData, // Automatically sets Content-Type to multipart/form-data
    });

    if (response.ok) {
      const data = await response.json();
      const generatedImageUrl = data.imageUrl; // Assuming the backend returns the generated image URL

      // Store and display the generated image
      const updatedImages = [...generatedImages, generatedImageUrl];
      setGeneratedImages(updatedImages);
      localStorage.setItem('imageData', JSON.stringify(updatedImages));

      // Clear the prompt and referenceImage
      setPrompt('');
      setReferenceImage(null);
    } else {
      console.error('Failed to generate image');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};


  return (
    <div className="App">
      <Navbar /> {/* Navbar at the top left */}
      
      <div className="welcome-message">
        <h1>Narrative AI</h1>
        <p>Create an image, animate it, and add voice to create your narrative.</p>
      </div>

      {/* Form for image upload and prompt */}
      <form onSubmit={handleGenerateImage} className="image-upload-form">
        <div className="input-group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            className="prompt-input"
          />
          <button type="submit" className="generate-btn">Generate Image</button>
        </div>
      </form>

      {referenceImage && (
        <img src={referenceImage} alt="Reference" className="reference-img" />
      )}

      {/* Display generated images */}
      <div className="grid">
        {generatedImages.length > 0 && generatedImages.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt="Generated"
            onClick={() => handleImageClick(imageUrl)} // Handle click on generated image
            onError={(e) => (e.target.src = 'placeholder-image.png')} // Fallback for broken images
            style={{ width: '200px', height: 'auto', margin: '10px', cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
