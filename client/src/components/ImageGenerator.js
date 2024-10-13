import React, { useState } from 'react';

function ImageGenerator({ onImageGenerated, resetPrompt }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      onImageGenerated(data.imageUrl); // Pass the generated image URL back to the parent component
      setPrompt(''); // Clear the input field after generating an image
      resetPrompt();  // Call the resetPrompt function from App to update the state
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="px-4 py-2 border rounded-md w-full mb-4"
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
