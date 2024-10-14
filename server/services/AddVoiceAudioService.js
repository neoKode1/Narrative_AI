import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,  // Make sure this token is set correctly
});

// Function to transcribe audio using Whisper
export const transcribeAudio = async (audioUrl) => {
  try {
    // Ensure the audio URL is provided
    if (!audioUrl) {
      throw new Error('No audio URL provided.');
    }

    // Call Replicate’s Whisper model API
    const output = await replicate.run(
      'openai/whisper:cdd97b257f93cb89dede1c7584e3f3dfc969571b357dbcee08e793740bedd854',
      {
        input: {
          audio: audioUrl,     // The URL or path to the audio file
          model: 'large-v3',   // Specify Whisper model
          language: 'auto',    // Automatically detect language
          transcription: 'plain text', // Specify transcription format
        },
      }
    );

    // Return the transcription from the output
    return output.transcription;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
};
