import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoGenerator() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [referenceImage, setReferenceImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedImage = JSON.parse(localStorage.getItem('selectedImage'));
    setSelectedImage(storedImage);

    const storedGeneratedImages = JSON.parse(localStorage.getItem('generatedImages'));
    setGeneratedImages(storedGeneratedImages || []);
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setReferenceImage(imageUrl);
    }
  };

  return (
    <div className="VideoGenerator">
      <h1>Video Generator</h1>
      <h2>Use an image to animate it, and create a video with audio.</h2>

      {/* Reference image upload */}
      <div className="reference-upload">
        <input type="file" onChange={handleImageUpload} />
        {referenceImage && <img src={referenceImage} alt="Reference" className="reference-img" />}
      </div>

      {/* Selected image to animate */}
      {selectedImage && <img src={selectedImage} alt="Selected for animation" />}

      {/* Side panel with previously generated images */}
      <div className="side-panel">
        <h3>Generated Images</h3>
        {generatedImages.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt="Generated"
            onClick={() => setSelectedImage(imageUrl)}
          />
        ))}
      </div>

      <button onClick={() => navigate('/')} className="back-button">
        Back to Image Generator
      </button>
    </div>
  );
}

export default VideoGenerator;
