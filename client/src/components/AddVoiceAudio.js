import React, { useState, useRef } from 'react';
import { Card, CardContent } from './ui/card';    // Named imports
import { Button } from './ui/button';             // Named import
import { Alert, AlertDescription } from './ui/alert'; // Named imports
import { Loader2, Upload, PlayCircle, PauseCircle } from 'lucide-react';

const AddVoiceAudio = ({ videoUrl }) => {
  const [audioFile, setAudioFile] = useState(null);
  const [transcribedText, setTranscribedText] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError('');
    } else {
      setError('Please upload a valid audio file');
    }
  };

  const handleTranscribe = async () => {
    if (!audioFile) return;

    setIsProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      setTranscribedText(data.text);
    } catch (err) {
      setError('Failed to transcribe audio: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVoice = async () => {
    if (!transcribedText) return;

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: transcribedText }),
      });

      if (!response.ok) throw new Error('Voice generation failed');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setGeneratedAudio(audioUrl);
    } catch (err) {
      setError('Failed to generate voice: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        videoRef.current?.pause();
      } else {
        audioRef.current.play();
        videoRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
    videoRef.current.currentTime = 0;
  };

  return (
    <div className="add-voice-audio">
      <Card className="w-full max-w-2xl border-2 border-white/20 bg-transparent text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Add Voice to Video</h2>

          {error && (
            <Alert variant="destructive" className="mb-4 border border-red-500/50 bg-red-500/10">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <label className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
                <span className="text-white">Upload Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {audioFile && <p className="text-sm text-white">{audioFile.name}</p>}
            </div>

            <Button
              onClick={handleTranscribe}
              disabled={!audioFile || isProcessing}
              className="w-full border border-white/20 bg-black hover:bg-white/10 text-white"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Transcribe Audio
            </Button>

            {transcribedText && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Transcribed Text:</h3>
                <p className="border border-white/20 bg-black p-4 rounded-md text-white">
                  {transcribedText}
                </p>
                <Button
                  onClick={handleGenerateVoice}
                  disabled={isProcessing}
                  className="w-full mt-4 border border-white/20 bg-black hover:bg-white/10 text-white"
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Generate Voice
                </Button>
              </div>
            )}

            {generatedAudio && (
              <div className="mt-4 flex flex-col items-center gap-4">
                <audio
                  ref={audioRef}
                  src={generatedAudio}
                  onEnded={handleAudioEnd}
                  className="hidden"
                />
                <Button
                  onClick={togglePlayPause}
                  variant="outline"
                  className="flex items-center gap-2 border border-white/20 bg-black hover:bg-white/10 text-white"
                >
                  {isPlaying ? (
                    <PauseCircle className="h-6 w-6" />
                  ) : (
                    <PlayCircle className="h-6 w-6" />
                  )}
                  {isPlaying ? 'Pause' : 'Play'} Generated Voice
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Preview Section */}
      <Card className="w-full max-w-2xl mt-8 border-2 border-white/20 bg-transparent">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">Video Preview</h3>
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-white/20">
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                src={videoUrl}
                controls={!generatedAudio}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/60">
                No video selected
              </div>
            )}
          </div>
          {videoUrl && generatedAudio && (
            <p className="text-sm text-center mt-2 text-white">
              Video playback is synchronized with the generated audio
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVoiceAudio;
