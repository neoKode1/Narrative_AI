import React, { useState } from 'react';

function ImageGenerator({ onImageGenerated, resetPrompt }) {
  const [prompt, setPrompt] = useState(''); // Prompt input
  const [imageFile, setImageFile] = useState(null); // Image file input
  const [loading, setLoading] = useState(false); // Loading state

  // Handle image file selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!prompt || typeof prompt !== 'string') {
      alert('Please enter a valid prompt');
      setLoading(false);
      return;
    }
  
    if (!imageFile) {
      alert('Please upload an image');
      setLoading(false);
      return;
    }
  
    // Prepare FormData to send prompt and image
    const formData = new FormData();
    formData.append('prompt', prompt);  // Add prompt as a string
    formData.append('image', imageFile); // Add the image file to the form data
  
    try {
      // Send request to backend with prompt and image
      const response = await fetch('http://localhost:5000/api/image/generate', {
        method: 'POST',
        body: formData, // FormData automatically sets the correct content type for multipart data
      });
  
      const data = await response.json();
      if (response.ok) {
        onImageGenerated(data.imageUrl); // Pass the generated image URL back to the parent component
      } else {
        console.error('Backend error:', data.error);
      }
  
      setPrompt(''); // Clear the prompt input
      setImageFile(null); // Clear the image input
      resetPrompt(); // Call the resetPrompt function from App to update the state
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="mb-4">
        {/* Input for prompt */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="px-4 py-2 border rounded-md w-full mb-4"
        />

        {/* Input for image file */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md"
        >
          {loading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
}

export default ImageGenerator;
