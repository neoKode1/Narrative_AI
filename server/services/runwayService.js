import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import RunwayML from '@runwayml/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.RUNWAYML_API_SECRET) {
  throw new Error('RUNWAYML_API_SECRET is not set in environment variables');
}

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

async function getImageAsBase64(imageUrl) {
  try {
    console.log('Getting image from:', imageUrl);
    const relativePath = imageUrl.replace('http://localhost:5000/', '');
    const imagePath = path.join(process.cwd(), relativePath);
    
    console.log('Resolved image path:', imagePath);
    
    await fs.access(imagePath);
    
    const imageBuffer = await fs.readFile(imagePath);
    
    const fileSizeInMB = imageBuffer.length / (1024 * 1024);
    if (fileSizeInMB > 16) {
      throw new Error('Image file size exceeds 16MB limit');
    }
    
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/png';
    if (ext === '.jpg' || ext === '.jpeg') {
      mimeType = 'image/jpeg';
    } else if (ext === '.webp') {
      mimeType = 'image/webp';
    }
    
    const base64 = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Error in getImageAsBase64:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

export async function generateVideo(imageUrl, animationPrompt) {
  console.log('=== Starting Video Generation ===');
  try {
    const imageBase64 = await getImageAsBase64(imageUrl);

    console.log('Creating video generation task...');
    const imageToVideo = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: imageBase64,
      promptText: animationPrompt
    });

    console.log('Task created with ID:', imageToVideo.id);

    let task;
    let attempts = 0;
    const maxAttempts = 30;

    do {
      if (attempts >= maxAttempts) {
        throw new Error('Video generation timed out after 5 minutes');
      }

      await new Promise(resolve => setTimeout(resolve, 10000));
      task = await client.tasks.retrieve(imageToVideo.id);
      
      console.log('Task status check:', {
        attempt: attempts + 1,
        status: task.status
      });

      attempts++;
    } while (task.status === 'RUNNING');

    console.log('Final task object:', JSON.stringify(task, null, 2));

    if (task.status === 'SUCCEEDED') {
      if (Array.isArray(task.output) && task.output.length > 0) {
        const videoUrl = task.output[0];
        console.log('Found video URL:', videoUrl);
        return videoUrl;
      }

      console.error('Unexpected output format:', task.output);
      throw new Error('Unexpected output format from video generation');
    } else {
      throw new Error(`Task failed: ${task.error || task.failure || 'Unknown error'} (Status: ${task.status})`);
    }
  } catch (error) {
    console.error('=== Error in generateVideo ===');
    if (error instanceof RunwayML.APIError) {
      console.error('API Error:', {
        status: error.status,
        message: error.message,
        error: error.error
      });
    } else {
      console.error('General Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}