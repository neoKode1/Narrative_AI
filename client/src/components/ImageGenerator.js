import React, { useState } from 'react';

function ImageGenerator({ onImageGenerated }) {
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
      onImageGenerated(data.imageUrl); // Pass the generated image URL back to the parent
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Generate Image</h2>
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

function App() {
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageGenerated = (url) => {
    setImageUrl(url);
  };

  return (
    <div className="App">
      <ImageGenerator onImageGenerated={handleImageGenerated} />

      {imageUrl && (
        <div>
          <h2>Generated Image:</h2>
          {/* Standard img tag for the generated image */}
          <img src={imageUrl} alt="Generated artwork" className="w-full h-auto rounded-md mt-4" />
        </div>
      )}
    </div>
  );
}

// Export the main App component instead of ImageGenerator
export default App;
