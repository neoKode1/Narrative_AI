import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/transcriptionService.js'; // Ensure your transcription service is properly set up
import dotenv from 'dotenv';  // Add dotenv for environment variables

dotenv.config(); // Load environment variables

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Route for transcribing audio
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const transcription = await transcribeAudio(file.buffer);
    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error processing transcription:', error);
    res.status(500).json({ error: 'Failed to process transcription' });
  }
});

// Route to serve the ElevenLabs API key to the frontend
router.get('/elevenlabs-key', (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;  // Fetch API key from environment variable
    if (!apiKey) {
      return res.status(500).json({ error: 'ElevenLabs API key not found' });
    }
    res.status(200).json({ apiKey });
  } catch (error) {
    console.error('Error fetching ElevenLabs API key:', error);
    res.status(500).json({ error: 'Failed to fetch ElevenLabs API key' });
  }
});

export default router;
