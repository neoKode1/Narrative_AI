import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import imageRoutes from './routes/imageRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import audioRoutes from './routes/audioRoutes.js';

const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.mp4')) {
      res.set('Content-Type', 'video/mp4');
    }
  }
}));

app.get('/api/elevenlabs-key', (req, res) => {
  if (process.env.ELEVENLABS_API_KEY) {
    res.json({ apiKey: process.env.ELEVENLABS_API_KEY });
  } else {
    res.status(500).json({ error: 'ElevenLabs API key not found in server environment' });
  }
});

app.use('/api/image', imageRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/audio', audioRoutes);

app.use((req, res, next) => {
  res.status(404).send("Sorry, that route doesn't exist.");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables loaded:');
  console.log('PORT:', process.env.PORT);
  console.log('HUGGING_FACE_API_TOKEN:', process.env.HUGGING_FACE_API_TOKEN ? 'Set' : 'Not set');
  console.log('ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'Set' : 'Not set');
  console.log('RUNWAYML_API_SECRET:', process.env.RUNWAYML_API_SECRET ? 'Set' : 'Not set');
});