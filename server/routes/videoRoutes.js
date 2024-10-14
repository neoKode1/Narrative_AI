import express from 'express';
import { generateVideo } from '../services/runwayService.js'; // Video generation service

const router = express.Router();

// Route to handle video generation from image URL and prompt
router.post('/generate', async (req, res) => {
  const { imageUrl, animationPrompt } = req.body; // Extract image URL and animation prompt from JSON request

  if (!imageUrl || !animationPrompt) {
    return res.status(400).json({ error: 'Missing imageUrl or animationPrompt' });
  }

  try {
    // Generate video using the image URL and animation prompt
    const videoUrl = await generateVideo(imageUrl, animationPrompt);

    console.log('Video generated at:', videoUrl); // Debugging log

    // Respond with the generated video URL
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Error generating video' });
  }
});

export default router;
