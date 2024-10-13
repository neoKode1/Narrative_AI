import express from 'express';
import multer from 'multer'; // For handling file uploads
import { uploadImage } from '../services/s3Service.js'; // Import the S3 upload service
import { generateVideo } from '../services/runwayService.js'; // Import the video generation service

const router = express.Router();
const upload = multer(); // Multer for handling multipart/form-data

// Route to handle image upload and video generation
router.post('/generate', upload.single('image'), async (req, res) => {
  const { animationPrompt } = req.body; // Get the animation prompt
  const file = req.file; // Get the uploaded image file

  if (!file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  try {
    // Upload image to S3 and get the public URL
    const imageUrl = await uploadImage(file);

    console.log('Image uploaded to S3:', imageUrl); // Debugging log

    // Generate video using the S3 image URL
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
