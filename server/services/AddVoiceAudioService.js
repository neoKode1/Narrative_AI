import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Function to transcribe audio using Whisper
export const transcribeAudio = async (audioUrl) => {
  try {
    // Ensure the audio URL is provided
    if (!audioUrl) {
      throw new Error('No audio URL provided.');
    }

    // Call Replicate's Whisper model API
    const model = "openai/whisper:cdd97b257f93cb89dede1c7584e3f3dfc969571b357dbcee08e793740bedd854";
    const input = {
      audio: audioUrl,
      model: "large-v3",
      language: "auto",
      transcription: "plain text"
    };

    const output = await replicate.run(model, { input });

    // Return the transcription from the output
    return output.transcription;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
};