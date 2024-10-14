import express from 'express';
import multer from 'multer'; // Middleware for handling multipart/form-data
import { generateImage } from '../services/fluxModelService.js'; // Function to generate image
import { uploadToS3 } from '../services/s3Service.js'; // Function to upload image to S3

const router = express.Router();

// Set up multer for file handling (image upload)
const upload = multer({ storage: multer.memoryStorage() }); // Store images in memory as buffer

router.post('/generate', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;

  try {
    // Ensure prompt is valid
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt must be a valid string.' });
    }

    // Ensure image file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }

    // Generate image based on the prompt
    const generatedImageBuffer = await generateImage(prompt);

    // Upload the generated image buffer to S3
    const s3ImageUrl = await uploadImage(generatedImageBuffer, req.file.mimetype, `${Date.now()}-generated-image.png`);

    // Return the URL of the uploaded image
    res.status(200).json({ imageUrl: s3ImageUrl });
  } catch (error) {
    console.error('Error generating and uploading image:', error);
    res.status(500).json({ error: 'Failed to generate and upload image.' });
  }
});

export default router;
