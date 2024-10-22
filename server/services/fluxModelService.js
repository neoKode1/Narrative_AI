import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

if (!API_TOKEN) {
  console.error('CRITICAL: HUGGING_FACE_API_TOKEN is not set in the environment variables');
  throw new Error('Hugging Face API token is missing');
}

console.log('API Configuration:', {
  url: API_URL,
  tokenPresent: !!API_TOKEN
});

export const generateImage = async ({ prompt }) => {
  console.log('\n=== Image Generation Service Started ===');
  try {
    console.log('Generation request details:', {
      prompt: prompt,
      apiUrl: API_URL,
      headerPresent: !!API_TOKEN
    });

    const response = await axios({
      method: 'post',
      url: API_URL,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: prompt,
        options: {
          wait_for_model: true
        }
      },
      responseType: 'arraybuffer'
    });

    console.log('API Response received:', {
      status: response.status,
      contentType: response.headers['content-type'],
      dataLength: response.data.length
    });

    // Ensure public directory exists
    const publicDir = path.join(process.cwd(), 'public');
    try {
      await fs.access(publicDir);
    } catch (error) {
      console.log('Creating public directory...');
      await fs.mkdir(publicDir, { recursive: true });
    }

    // Save the image
    const imageName = `${uuidv4()}.png`;
    const imagePath = path.join(publicDir, imageName);
    
    await fs.writeFile(imagePath, response.data);
    console.log('Image saved successfully at:', imagePath);

    const imageUrl = `/public/${imageName}`;
    console.log('Generated image URL:', imageUrl);
    
    return imageUrl;

  } catch (error) {
    console.error('=== Error in Image Generation Service ===');
    if (error.response) {
      console.error('Response error:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data.toString()
      });
    } else {
      console.error('Error details:', {
        message: error.message,
        code: error.code
      });
    }
    console.error('Stack trace:', error.stack);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
};