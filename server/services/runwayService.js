// runwayService.js
import RunwayML from '@runwayml/sdk';
import 'dotenv/config';

const client = new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET,
});

export async function generateVideo(imageUrl, animationPrompt) {
  try {
    const imageToVideo = await client.imageToVideo.create({
      model: 'gen3a_turbo',
      promptImage: imageUrl,
      promptText: animationPrompt,
    });

    const taskId = imageToVideo.id;

    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000));
      task = await client.tasks.retrieve(taskId);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'FAILED') {
      throw new Error('Video generation failed.');
    }

    return task.output.url;
  } catch (error) {
    console.error('Error generating video:', error);
    throw new Error('Failed to generate video');
  }
}
