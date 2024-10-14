import express from 'express';
import { generateVideo } from '../services/runwayService.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  console.log('Received video generation request:', req.body);
  const { imageUrl, animationPrompt } = req.body;

  if (!imageUrl || !animationPrompt) {
    console.log('Missing required parameters');
    return res.status(400).json({ error: 'Missing imageUrl or animationPrompt' });
  }

  try {
    console.log('Calling generateVideo function...');
    const videoUrl = await generateVideo(imageUrl, animationPrompt);

    console.log('Video generated successfully:', videoUrl);
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Detailed error in video generation route:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;