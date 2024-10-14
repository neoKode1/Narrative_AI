import RunwayML from '@runwayml/sdk';
import 'dotenv/config';
import fetch from 'node-fetch';
import { uploadToS3 } from './s3Service.js';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function generateVideo(imageUrl, animationPrompt) {
  console.log('Initiating video generation with:', { imageUrl, animationPrompt });
  try {
    let httpsImageUrl = imageUrl;

    // Check if the URL is a localhost URL
    if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
      console.log('Local image detected. Fetching and uploading to S3...');
      const response = await fetch(imageUrl);
      const imageBuffer = await response.buffer();
      httpsImageUrl = await uploadToS3(imageBuffer, 'image/png', 'generated-image.png');
    } else {
      // Convert HTTP URL to HTTPS if necessary
      httpsImageUrl = imageUrl.replace('http:', 'https:');
    }

    console.log('Using HTTPS image URL:', httpsImageUrl);

    console.log('Creating image-to-video task...');
    const imageToVideo = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: httpsImageUrl,
      promptText: animationPrompt,
      duration: 10,
      ratio: "16:9",
      watermark: false,
    });

    const taskId = imageToVideo.id;
    console.log('Task created with ID:', taskId);

    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000));
      task = await client.tasks.retrieve(taskId);
      console.log('Task status:', task.status);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'FAILED') {
      console.error('Task failed:', task.error);
      throw new Error(`Video generation failed: ${task.error}`);
    }

    console.log('Complete task object:', JSON.stringify(task, null, 2));

    let videoUrl = null;
    if (Array.isArray(task.output) && task.output.length > 0) {
      videoUrl = task.output[0];
    }

    if (!videoUrl) {
      console.error('Video URL not found in task output');
      throw new Error('Video URL not found in task output');
    }

    console.log('Video generated successfully. URL:', videoUrl);
    return videoUrl;
  } catch (error) {
    console.error('Detailed error in generateVideo:', error);
    throw error;
  }
}