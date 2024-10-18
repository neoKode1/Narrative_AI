import express from 'express';
import { generateImage } from '../services/fluxModelService.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const {
      prompt,
      seed,
      image,
      go_fast = true,
      guidance = 3,
      megapixels = "1",
      num_outputs = 1,
      aspect_ratio = "1:1",
      output_format = "webp",
      output_quality = 80,
      prompt_strength = 0.8,
      num_inference_steps = 28,
      disable_safety_checker = false
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    const imageData = await generateImage({
      prompt,
      seed,
      image,
      go_fast,
      guidance,
      megapixels,
      num_outputs,
      aspect_ratio,
      output_format,
      output_quality,
      prompt_strength,
      num_inference_steps,
      disable_safety_checker
    });

    const images = [];
    for (let i = 0; i < imageData.images.length; i++) {
      const base64Data = imageData.images[i].replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `${uuidv4()}-generated-image.${output_format}`;
      const filepath = path.join(__dirname, '..', 'public', filename);
      
      await fs.writeFile(filepath, buffer);
      
      images.push(`http://localhost:5000/public/${filename}`);
    }

    res.json({ images });
  } catch (error) {
    console.error('Error in image generation route:', error);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
});

export default router;