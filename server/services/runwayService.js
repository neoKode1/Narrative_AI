import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import RunwayML from '@runwayml/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

async function getImageAsBase64(imageUrl) {
  const imagePath = path.join(__dirname, '..', imageUrl.replace('http://localhost:5000', ''));
  const imageBuffer = await fs.readFile(imagePath);
  return `data:image/png;base64,${imageBuffer.toString('base64')}`;
}

export async function generateVideo(imageUrl, animationPrompt) {
  try {
    console.log('Generating video with:', { imageUrl, animationPrompt });
    const imageBase64 = await getImageAsBase64(imageUrl);

    const imageToVideo = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: imageBase64,
      promptText: animationPrompt,
    });

    console.log('Task created:', imageToVideo);

    // Poll the task until it's complete
    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds before polling
      task = await client.tasks.retrieve(imageToVideo.id);
      console.log('Task status:', task.status);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    console.log('Final task state:', JSON.stringify(task, null, 2));

    if (task.status === 'SUCCEEDED') {
      console.log('Task output:', JSON.stringify(task.output, null, 2));
      if (task.output && task.output.video_url) {
        return task.output.video_url;
      } else {
        throw new Error('Video URL not found in task output');
      }
    } else {
      throw new Error(`Task failed: ${task.failure || 'Unknown error'} (Code: ${task.failureCode || 'Unknown'})`);
    }
  } catch (error) {
    console.error('Error in generateVideo:', error);
    if (error instanceof RunwayML.APIError) {
      console.log('API Error Status:', error.status);
      console.log('API Error Name:', error.name);
      console.log('API Error Headers:', error.headers);
    }
    throw error;
  }
}