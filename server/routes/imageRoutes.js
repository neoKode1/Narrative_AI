import express from 'express'; // Use `import` instead of `require`
import { generateImage } from '../services/fluxModelService.js'; // Import function from the service file

const router = express.Router();

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;

    try {
        const imageUrl = await generateImage(prompt);

        if (!imageUrl) {
            throw new Error('Image URL not generated');
        }

        res.json({ imageUrl });
    } catch (error) {
        console.error('Error generating image:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

export default router; // Use `export default` instead of `module.exports`
