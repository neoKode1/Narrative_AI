import RunwayML from '@runwayml/sdk';
import 'dotenv/config';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET, // Accessing the API key from .env
});


export async function generateVideo(imageUrl, animationPrompt) {
  try {
    // Ensure imageUrl is a valid HTTPS URL
    if (!imageUrl.startsWith('https://')) {
      throw new Error('Invalid image URL. Ensure it is a valid HTTPS URL.');
    }

    // Send a request to RunwayML API
    const imageToVideo = await client.imageToVideo.create({
      model: 'gen3a_turbo',               // Use the gen3a_turbo model
      promptImage: imageUrl,              // The image URL must be HTTPS
      promptText: animationPrompt,        // The prompt text for animation
      duration: 10,                       // Optional: You can change duration if needed (5 or 10)
      ratio: "16:9",                      // Optional: Set the aspect ratio (16:9 or 9:16)
      watermark: false,                   // Optional: Set to true if you want watermark
    });

    const taskId = imageToVideo.id;

    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
      task = await client.tasks.retrieve(taskId);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'FAILED') {
      throw new Error('Video generation failed.');
    }

    return task.output.url; // Return the generated video URL
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Failed to generate video');
  }
}
