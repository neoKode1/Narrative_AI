import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Hugging Face API URL for Flux 1 model
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

// Authorization token (replace with your actual token)
const headers = {
  "Authorization": "Bearer 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" // Your Hugging Face token here
};

// Simulate __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateImage = async (prompt) => {
  try {
    // Send POST request to Hugging Face API with the prompt
    const response = await axios.post(
      API_URL,
      { "inputs": prompt },  // Ensure the prompt is sent as a plain string
      {
        headers: headers,
        responseType: 'arraybuffer',  // Expect the response as binary data (an image)
      }
    );

    // Log the response status for debugging purposes
    console.log("Response status from Hugging Face API:", response.status);

    // Save the image to the server
    const imageBuffer = response.data;
    const imageName = `${Date.now()}-generated-image.png`;
    const imagePath = path.join(__dirname, '..', 'public', imageName); // Ensure 'public' directory exists

    // Save the image to the server's public directory
    fs.writeFileSync(imagePath, imageBuffer);

    // Return the image URL (assuming the frontend can access it via '/public/')
    return `http://localhost:5000/public/${imageName}`;

  } catch (error) {
    console.error('Error generating image from Hugging Face API:', error.message);
    console.error('Error response:', error.response ? error.response.data : 'undefined');
    throw new Error('Failed to generate image');
  }
};
