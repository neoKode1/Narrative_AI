import express from 'express';
import multer from 'multer'; // Middleware to handle file uploads
import { transcribeAudio } from '../services/AddVoiceAudioService.js'; // Service function for transcribing audio
import { uploadToS3 } from '../services/s3Service.js'; // Optional: Function to handle S3 uploads

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory for quick access

// POST route to handle audio transcription
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    // Option 1: If you're uploading the file to S3 or another service, you would handle the upload here
    // and pass the public URL to the transcribeAudio function.
    // Upload file to S3 and get the public URL
    const audioUrl = await uploadToS3(file); // uploadToS3 should return the public URL

    // Option 2: If you're not using S3, you can generate a URL from your server's public directory
    // Example: If the audio file is stored in a local "uploads" folder
    // const audioUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

    // Call the transcribeAudio function with the audio URL
    const transcription = await transcribeAudio(audioUrl);

    // Send the transcription back to the client
    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error processing transcription:', error);
    res.status(500).json({ error: 'Failed to process transcription' });
  }
});

export default router;
