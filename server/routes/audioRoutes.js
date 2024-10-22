import express from 'express';
import multer from 'multer';
import { transcribeAudio } from '../services/AddVoiceAudioService.js'; // Service for transcribing audio
import { generateSpeech } from '../services/elevenLabsService.js'; // Service for generating speech from text

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage for file uploads

// POST route to handle audio transcription
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Transcribe the uploaded audio file
    const transcription = await transcribeAudio(file.buffer);
    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error processing transcription:', error);
    res.status(500).json({ error: 'Failed to process transcription' });
  }
});

// POST route to generate speech from transcribed text
router.post('/text-to-speech', async (req, res) => {
  const { transcription } = req.body;

  if (!transcription) {
    return res.status(400).json({ error: 'No transcription provided' });
  }

  try {
    // Generate audio from transcription using ElevenLabs or another service
    const audioUrl = await generateSpeech(transcription);
    res.status(200).json({ audioUrl });
  } catch (error) {
    console.error('Error generating speech:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

export default router;
