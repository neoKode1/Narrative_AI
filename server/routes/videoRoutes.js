import express from 'express';
import { generateVideo } from '../services/runwayService.js';
import RunwayML from '@runwayml/sdk';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { imageUrl, animationPrompt } = req.body;
    console.log('Received video generation request:', { imageUrl, animationPrompt });

    if (!imageUrl || !animationPrompt) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Calling generateVideo function...');
    const videoUrl = await generateVideo(imageUrl, animationPrompt);
    
    res.json({ videoUrl });
  } catch (error) {
    console.error('Detailed error in video generation route:', error);
    let errorResponse = {
      error: 'Failed to generate video',
      message: error.message,
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
    }

    if (error instanceof RunwayML.APIError) {
      errorResponse.details = {
        status: error.status,
        name: error.name,
        headers: error.headers,
      };
    }

    res.status(500).json(errorResponse);
  }
});

export default router;