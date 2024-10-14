import React, { useState } from 'react';
import Replicate from 'replicate'; // Import Replicate API library
import './AddVoiceAudio.css'; // Ensure you have styles for your component

const AddVoiceAudio = () => {
  const [audioFile, setAudioFile] = useState(null); // For storing the selected audio file
  const [transcription, setTranscription] = useState(''); // For storing the transcription
  const [loading, setLoading] = useState(false); // For indicating loading state
  const [error, setError] = useState(''); // For storing any errors

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file); // Store the selected file in the state
    }
  };

  // Handle audio transcription
  const handleTranscription = async () => {
    if (!audioFile) {
      setError('Please upload an audio file.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      // Use Replicate API to run Whisper model
      const replicate = new Replicate({
        auth: process.env.REACT_APP_REPLICATE_API_TOKEN, // Set the token from environment variables
      });

      const output = await replicate.run(
        'openai/whisper:cdd97b257f93cb89dede1c7584e3f3dfc969571b357dbcee08e793740bedd854',
        {
          input: {
            audio: audioFile, // Use the uploaded audio file
            model: 'large-v3',
            language: 'auto',
            transcription: 'plain text',
          }
        }
      );

      // Assuming the output contains the transcription
      setTranscription(output.transcription || 'No transcription available');
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError('Error transcribing audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-voice-audio">
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="/gremilin.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h2>Add Voice Audio</h2>

        {/* Input for audio file */}
        <input type="file" accept="audio/*" onChange={handleFileChange} />

        {/* Transcription button */}
        <button onClick={handleTranscription} disabled={loading}>
          {loading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>

        {/* Error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Transcription output */}
        {transcription && (
          <div>
            <h3>Transcription:</h3>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVoiceAudio;
