import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Required for ES Modules to get __dirname

// Import routes (Ensure .js extensions)
import imageRoutes from './routes/imageRoutes.js';
import videoRoutes from './routes/videoRoutes.js';

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Use routes for image and video generation
app.use('/api/image', imageRoutes); // Use imported imageRoutes
app.use('/api/video', videoRoutes); // Use imported videoRoutes

// Start the server on the specified port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
