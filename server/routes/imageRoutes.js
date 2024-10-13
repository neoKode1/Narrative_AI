import express from 'express';
import { generateImage } from '../services/fluxModelService.js'; // Your image generation function
import { uploadImage } from '../services/s3Service.js'; // Your S3 upload service

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { prompt } = req.body; // Get the prompt from the request body

    try {
        // Generate image based on prompt (returns image buffer or file)
        const imageBuffer = await generateImage(prompt);

        if (!imageBuffer) {
            throw new Error('Image not generated');
        }

        // Upload the generated image buffer to S3
        const s3ImageUrl = await uploadImage(imageBuffer);

        // Return the S3 image URL to the frontend
        res.json({ imageUrl: s3ImageUrl });
    } catch (error) {
        console.error('Error generating and uploading image:', error);
        res.status(500).json({ error: 'Failed to generate image and upload to S3' });
    }
});

export default router;
