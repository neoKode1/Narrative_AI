import React, { useState, useEffect } from 'react';
import { ElevenLabsClient, play } from 'elevenlabs';
import './AddVoiceAudio.css';

const AddVoiceAudio = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elevenlabs, setElevenlabs] = useState(null);

  useEffect(() => {
    fetch('/api/elevenlabs-key')
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        if (!data.apiKey) {
          throw new Error('API key is missing from the response');
        }
        const client = new ElevenLabsClient({
          apiKey: data.apiKey
        });
        setElevenlabs(client);
        console.log('ElevenLabs client initialized');
      })
      .catch(err => {
        console.error('Failed to fetch API key:', err);
        setError(`Failed to initialize ElevenLabs client: ${err.message}`);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Audio file selected:', file.name);
      setAudioFile(file);
    } else {
      console.log('No file selected');
    }
  };

  const handleTranscription = async () => {
    if (!audioFile) {
      setError('Please upload an audio file.');
      console.warn('Transcription attempted without an audio file.');
      return;
    }

    setError('');
    setLoading(true);
    console.log('Starting transcription process...');

    try {
      const formData = new FormData();
      formData.append('audio', audioFile);

      const response = await fetch('/api/audio/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Transcription successful:', data.transcription);
      setTranscription(data.transcription);
    } catch (err) {
      console.error('Error transcribing audio:', err);
      setError(`Error transcribing audio: ${err.message}`);
    } finally {
      setLoading(false);
      console.log('Transcription process completed.');
    }
  };

  const handleTextToSpeech = async () => {
    if (!transcription) {
      setError('Please transcribe audio first.');
      console.warn('Text-to-speech attempted without transcription.');
      return;
    }

    if (!elevenlabs) {
      setError('ElevenLabs client not initialized. Please try again later.');
      return;
    }

    setError('');
    setLoading(true);
    console.log('Starting text-to-speech generation...');

    try {
      const audio = await elevenlabs.generate({
        voice: 'Rachel',
        text: transcription,
        model_id: 'eleven_multilingual_v2'
      });

      console.log('Speech generation successful');
      setGeneratedAudio(audio);
    } catch (err) {
      console.error('Error generating speech:', err);
      setError(`Error generating speech: ${err.message}`);
    } finally {
      setLoading(false);
      console.log('Text-to-speech process completed.');
    }
  };

  const handlePlayAudio = async () => {
    if (generatedAudio) {
      console.log('Playing generated audio');
      await play(generatedAudio);
    } else {
      console.warn('No generated audio available to play.');
    }
  };

  return (
    <div className="add-voice-audio">
      <video autoPlay loop muted className="background-video">
        <source src="/gremilin.mp4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="content">
        <h2>Add Voice Audio</h2>

        <input type="file" accept="audio/*" onChange={handleFileChange} />

        <button onClick={handleTranscription} disabled={loading || !audioFile}>
          {loading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {transcription && (
          <div>
            <h3>Transcription:</h3>
            <p>{transcription}</p>
            <button onClick={handleTextToSpeech} disabled={loading}>
              Generate Speech
            </button>
          </div>
        )}

        {generatedAudio && (
          <div>
            <h3>Generated Speech:</h3>
            <button onClick={handlePlayAudio}>Play Generated Audio</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVoiceAudio;