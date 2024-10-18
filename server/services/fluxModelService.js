import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = "http://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

if (!API_TOKEN) {
  console.error('HUGGING_FACE_API_TOKEN is not set in the environment variables');
  throw new Error('Hugging Face API token is missing');
}

console.log('Hugging Face API Token:', API_TOKEN ? 'Token is set' : 'Token is not set');

const headers = {
  "Authorization": `Bearer ${API_TOKEN}`
};

export const generateImage = async (prompt) => {
  try {
    console.log('Attempting to generate image with prompt:', prompt);
    console.log('API URL:', API_URL);
    console.log('Using headers:', { ...headers, Authorization: 'Bearer [REDACTED]' });
    
    console.log('Sending request to Hugging Face API...');
    const response = await axios.post(
      API_URL,
      { "inputs": prompt },
      {
        headers: headers,
        responseType: 'arraybuffer',
      }
    );

    console.log("Response received from Hugging Face API");
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const imageBuffer = Buffer.from(response.data);
    const imageName = `${uuidv4()}-generated-image.png`;
    const imagePath = path.join(process.cwd(), 'public', imageName);

    await fs.writeFile(imagePath, imageBuffer);

    const imageUrl = `/public/${imageName}`;
    console.log('Image successfully saved to:', imageUrl);

    return imageUrl;

  } catch (error) {
    console.error('Error in generateImage:', error);
    throw new Error('Failed to generate image: ' + error.message);
  }
};