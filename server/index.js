import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import imageRoutes from './routes/imageRoutes.js';
import { setupWebSocket } from './services/websocketService.js';

const result = dotenv.config();
if (result.error) {
  console.error('Critical Error: Failed to load .env file:', result.error);
}

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Enhanced static file serving with logging
app.use('/public', (req, res, next) => {
  console.log('Static file request:', {
    path: req.path,
    fullUrl: req.url,
    method: req.method
  });
  
  const filePath = path.join(__dirname, 'public', req.path);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', {
        requestedPath: req.path,
        fullPath: filePath,
        error: err.message
      });
    } else {
      console.log('File found:', filePath);
    }
    next();
  });
}, express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path, stat) => {
    console.log('Setting headers for:', path);
    if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.mp4')) {
      res.set('Content-Type', 'video/mp4');
    }
    console.log('Response headers:', res.getHeaders());
  }
}));

app.use('/api/image', imageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupWebSocket(server);