import { ElevenLabsClient } from "elevenlabs";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.REACT_APP_ELEVENLABS_API_KEY
});

export const transcribeAudio = async (audioBuffer) => {
  try {
    const transcription = await elevenlabs.speechToText({
      audio: audioBuffer,
      model: 'whisper-1'
    });

    return transcription;
  } catch (error) {
    console.error('Error during transcription:', error);
    throw error;
  }
};