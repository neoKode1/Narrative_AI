// routes/audioRoutes.js
import express from 'express';
import multer from 'multer';
import { transcribeAudio, generateSpeech, getAvailableVoices } from '../services/elevenLabsService.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit
  }
});

// Transcribe audio to text
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const transcribedText = await transcribeAudio(req.file.buffer);
    res.json({ text: transcribedText });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ 
      error: 'Failed to transcribe audio',
      details: error.message 
    });
  }
});

// Generate speech from text
router.post('/generate-voice', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'No text provided' });
    }

    const audioBuffer = await generateSpeech(text);
    
    // Set appropriate headers for audio streaming
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error('Speech generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate speech',
      details: error.message 
    });
  }
});

// Get available voices
router.get('/voices', async (req, res) => {
  try {
    const voices = await getAvailableVoices();
    res.json({ voices });
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch voices',
      details: error.message 
    });
  }
});

export default router;