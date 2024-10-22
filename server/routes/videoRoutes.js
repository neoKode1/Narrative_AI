import express from 'express';
import { generateVideo } from '../services/runwayService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  console.log('=== Video Generation Route Started ===');
  console.log('Received request:', {
    timestamp: new Date().toISOString(),
    body: {
      ...req.body,
      animationPrompt: req.body.animationPrompt?.length + ' chars'
    }
  });

  const { imageUrl, animationPrompt } = req.body;

  if (!imageUrl || !animationPrompt) {
    console.error('Missing required parameters:', {
      hasImageUrl: !!imageUrl,
      hasPrompt: !!animationPrompt,
      promptLength: animationPrompt?.length
    });
    return res.status(400).json({ error: 'Missing imageUrl or animationPrompt' });
  }

  try {
    console.log('Calling video generation service...');
    const videoUrl = await generateVideo(imageUrl, animationPrompt);

    if (!videoUrl) {
      console.error('No video URL returned from service');
      throw new Error('Video generation failed - no URL returned');
    }

    console.log('Video generation successful:', {
      timestamp: new Date().toISOString(),
      videoUrl: videoUrl
    });

    // Ensure we're sending back the correct format
    res.status(200).json({ 
      videoUrl: videoUrl,
      status: 'success',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in video generation route:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Send appropriate error response
    res.status(500).json({ 
      error: error.message || 'Error generating video',
      status: 'error',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        type: error.constructor.name
      } : undefined
    });
  }

  console.log('=== Video Generation Route Completed ===');
});

export default router;