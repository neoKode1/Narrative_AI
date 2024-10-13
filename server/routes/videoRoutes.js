import express from 'express';
import { generateVideo } from '../services/runwayService.js'; // Ensure this path is correct

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { imageUrl, animationPrompt } = req.body;

  try {
    const videoUrl = await generateVideo(imageUrl, animationPrompt);
    res.status(200).json({ videoUrl });
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: 'Error generating video' });
  }
});

// Use ES module export
export default router;
