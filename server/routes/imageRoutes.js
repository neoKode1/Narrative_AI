import express from 'express';
import { generateImage } from '../services/fluxModelService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/generate', async (req, res) => {
  console.log('=== Image Generation Route Started ===');
  console.log('Request body:', req.body);
  
  try {
    const { prompt } = req.body;

    if (!prompt) {
      console.log('Error: Missing prompt in request');
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    console.log('Processing prompt:', prompt);

    const result = await generateImage({ prompt });
    console.log('Image generation completed. Result:', result);

    if (typeof result === 'string') {
      const filename = path.basename(result);
      const imageUrl = `/public/${filename}`;
      console.log('Generated image URL:', imageUrl);
      console.log('Full server path:', path.join(process.cwd(), 'public', filename));
      res.json({ images: [imageUrl] });
    } else {
      console.error('Invalid result format:', result);
      throw new Error('Invalid response from image generation service');
    }
  } catch (error) {
    console.error('Error in image generation route:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'An error occurred during image generation' });
  }
  console.log('=== Image Generation Route Completed ===');
});

export default router;