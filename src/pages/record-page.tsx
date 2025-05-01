import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, RotateCcw, Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';
import { transcribeAudio } from '@/services/whisper';

// For testing - simulates a transcription response with a delay
const mockTranscription = async (text: string, delay: number = 500): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(text), delay);
  });
};

// Use this flag to toggle between real and mock transcription
const USE_MOCK_TRANSCRIPTION = false; // Set to true for testing UI, false for real API

// Amount of silent time (ms) before creating a new line
const NEW_LINE_SILENCE_THRESHOLD = 800; // 0.8 seconds of silence to create a new line

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  const [forceNewLine, setForceNewLine] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isTranscribingRef = useRef(false);
  const mockWordsRef = useRef<string[]>([
    "Hello,", 
    "my", 
    "name", 
    "is", 
    "Nick.", 
    "Thank", 
    "you", 
    "for", 
    "listening", 
    "to", 
    "me", 
    "speak."
  ]);
  const mockIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptionTimeRef = useRef<number>(Date.now());
  const lastTranscriptRef = useRef<string>('');

  // Timer for elapsed time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  // Set up audio processing
  useEffect(() => {
    if (isRecording && !USE_MOCK_TRANSCRIPTION) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up a periodic poll for live transcription
      intervalRef.current = setInterval(() => {
        if (chunksRef.current.length > 0 && !isTranscribingRef.current) {
          const now = Date.now();
          // Check if we've had a long enough pause to force a new line
          if (now - lastTranscriptionTimeRef.current > NEW_LINE_SILENCE_THRESHOLD) {
            setForceNewLine(true);
            console.log(`Forcing new line due to pause in speaking: ${now - lastTranscriptionTimeRef.current}ms`);
          }
          
          transcribeCurrentAudio();
        }
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // For mock transcription
    if (isRecording && USE_MOCK_TRANSCRIPTION) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        updateMockTranscription();
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Update with a mock transcription for testing
  const updateMockTranscription = () => {
    if (!isRecording) return;
    
    // Simulate gradual buildup of transcription
    if (mockIndexRef.current < mockWordsRef.current.length) {
      const words = mockWordsRef.current.slice(0, mockIndexRef.current + 1);
      const text = words.join(" ");
      mockIndexRef.current++;
      
      console.log('[MOCK] Transcription update:', text);
      
      // Simulate forcing a new line every 3 words
      const shouldForceNewLine = mockIndexRef.current % 3 === 0;
      setLiveTranscript(text);
      
      if (shouldForceNewLine) {
        setForceNewLine(true);
      }
    }
  };

  // Check if the user has given audio permission
  const checkAudioPermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return permissionStatus.state === 'granted';
    } catch (err) {
      console.log('Permission API not supported, will check by requesting access');
      return null;
    }
  };

  // Stop all audio resources
  const stopAllAudio = () => {
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.error('Error stopping MediaRecorder:', err);
      }
    }
    
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.error('Error stopping track:', err);
        }
      });
    }
    
    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (err) {
        console.error('Error closing AudioContext:', err);
      }
    }
    
    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Detect significant pauses in speech
  const detectSilence = (audioBuffer: AudioBuffer, silenceThreshold = 0.01): boolean => {
    const data = audioBuffer.getChannelData(0);
    const samples = data.length;
    
    // Calculate RMS (root mean square) of the audio data
    let sum = 0;
    for (let i = 0; i < samples; i++) {
      sum += data[i] * data[i];
    }
    const rms = Math.sqrt(sum / samples);
    
    return rms < silenceThreshold;
  };

  // Transcribe the current audio collected
  const transcribeCurrentAudio = async () => {
    if (!isRecording || chunksRef.current.length === 0 || isTranscribingRef.current) {
      return;
    }

    isTranscribingRef.current = true;
    setDebug(`Transcribing ${chunksRef.current.length} chunks...`);
    
    try {
      // Create a copy of the current chunks to transcribe
      const currentChunks = [...chunksRef.current];
      const audioBlob = new Blob(currentChunks, { type: 'audio/webm' });
      
      if (audioBlob.size < 1000) {
        isTranscribingRef.current = false;
        return;
      }
      
      const result = await transcribeAudio(audioBlob, true);
      
      // Check if the transcription has actually changed
      if (result && result.trim()) {
        const now = Date.now();
        const timeSinceLastTranscription = now - lastTranscriptionTimeRef.current;
        
        // Compare with previous transcription
        const hasSignificantlyChanged = 
          !lastTranscriptRef.current || 
          Math.abs(result.length - lastTranscriptRef.current.length) > 10 ||
          (result.trim().endsWith(".") && !lastTranscriptRef.current.trim().endsWith("."));
        
        // Update the live transcript with timing information
        setLiveTranscript(result);
        
        // Store reference data
        lastTranscriptRef.current = result;
        lastTranscriptionTimeRef.current = now;
        
        // Log information for debugging
        console.log(`Transcription updated. Time since last: ${timeSinceLastTranscription}ms, Changed: ${hasSignificantlyChanged}, Force new line: ${forceNewLine}`);
        
        // If we had a long pause, significant change, or detected end of sentence, signal to create a new line
        if (timeSinceLastTranscription > NEW_LINE_SILENCE_THRESHOLD || hasSignificantlyChanged) {
          setForceNewLine(true);
          console.log(`Setting forceNewLine to true due to ${hasSignificantlyChanged ? 'significant change' : 'silence'}`);
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      console.error('Transcription error:', errorMessage);
      setError(`Transcription error: ${errorMessage}`);
    } finally {
      isTranscribingRef.current = false;
    }
  };

  // Handle new line created callback
  const handleNewLineCreated = () => {
    console.log("New line was created, resetting force new line flag");
    setForceNewLine(false);
  };

  // The main recording function
  const startRealRecording = async () => {
    try {
      // First check if we have permission
      const hasPermission = await checkAudioPermission();
      setHasAudioPermission(hasPermission);
      
      // Always reset state
      chunksRef.current = [];
      lastTranscriptionTimeRef.current = Date.now();
      lastTranscriptRef.current = '';
      setForceNewLine(false);
      
      // Request audio access
      console.log('Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('Got media stream:', stream);
      streamRef.current = stream;
      
      // Create and set up MediaRecorder with the stream
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/ogg') 
          ? 'audio/ogg' 
          : '';
          
      console.log('Using MIME type:', mimeType || 'default');
      
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined
      });
      
      mediaRecorderRef.current = recorder;
      
      // Set up event handlers
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log(`Got audio chunk: ${event.data.size} bytes`);
          chunksRef.current.push(event.data);
          setDebug(`Collected ${chunksRef.current.length} chunks`);
        }
      };
      
      recorder.onstart = () => {
        console.log('MediaRecorder started');
        setDebug('Recording started');
      };
      
      recorder.onstop = () => {
        console.log('MediaRecorder stopped');
        setDebug('Recording stopped');
      };
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError(`Recording error: ${event.toString()}`);
      };
      
      // Start recording - collect data every 1 second
      console.log('Starting MediaRecorder...');
      recorder.start(1000);
      
      // Also set up an AudioContext for visualization
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      // Create an audio source from the stream
      const source = audioContext.createMediaStreamSource(stream);
      
      // Set up an analyzer to get audio data for visualization
      const analyzer = audioContext.createAnalyser();
      source.connect(analyzer);
      
      console.log('Recording successfully started');
      setIsRecording(true);
      setElapsedTime(0);
      
    } catch (error: any) {
      const errorMessage = error.message || 'Unknown error';
      console.error('Error starting recording:', errorMessage);
      setError(`Could not start recording: ${errorMessage}`);
      stopAllAudio();
    }
  };

  const handleStartRecording = async () => {
    // Reset state
    setTranscript('');
    setLiveTranscript('');
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
    lastTranscriptionTimeRef.current = Date.now();
    lastTranscriptRef.current = '';
    setForceNewLine(false);
    
    if (USE_MOCK_TRANSCRIPTION) {
      console.log('Using mock transcription');
      setIsRecording(true);
      setElapsedTime(0);
    } else {
      await startRealRecording();
    }
  };

  const handleStopRecording = async () => {
    if (USE_MOCK_TRANSCRIPTION) {
      setIsRecording(false);
      setShowControls(true);
      
      // Build final transcript from all mock words
      const finalText = mockWordsRef.current.join(" ");
      setTranscript(finalText);
      setLiveTranscript('');
      
      console.log('Mock recording stopped');
      return;
    }
    
    setIsRecording(false);
    setShowControls(true);
    
    // Clean up all audio
    stopAllAudio();
    
    // Get final transcription
    if (chunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Getting final transcription, size:', audioBlob.size, 'bytes');
        
        const finalTranscript = await transcribeAudio(audioBlob);
        console.log('Received final transcription:', finalTranscript);
        
        if (finalTranscript && finalTranscript.trim()) {
          setTranscript(finalTranscript);
          setLiveTranscript('');
        } else {
          setError('Received empty transcription. Your audio may not contain clear speech.');
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        console.error('Error getting final transcription:', errorMessage);
        setError(`Final transcription error: ${errorMessage}`);
      }
    } else {
      setError('No audio was recorded. Please check your microphone and permissions.');
    }
  };

  const handleTryAgain = () => {
    setShowControls(false);
    setElapsedTime(0);
    setTranscript('');
    setLiveTranscript('');
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
  };

  const handleSubmit = () => {
    navigate('/feedback');
  };

  // Render microphone permission message if needed
  const renderPermissionMessage = () => {
    if (hasAudioPermission === false) {
      return (
        <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
          Microphone access is denied. Please enable microphone access in your browser settings.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 pb-32 p-10">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Record Conversation</h1>
      </div>
      
      {renderPermissionMessage()}
      
      <TranscriptBox 
        isRecording={isRecording} 
        transcript={transcript}
        liveTranscript={liveTranscript}
        forceNewLine={forceNewLine}
        onNewLineCreated={handleNewLineCreated}
      />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {debug && (
        <div className="p-2 bg-gray-100 text-gray-700 text-sm rounded-md">
          Status: {debug} {forceNewLine ? "(Force new line active)" : ""}
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {isRecording && (
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
            <Button
              variant="destructive"
              size="icon"
              className="h-10 w-10 rounded-full p-0"
              onClick={handleStopRecording}
            >
              <Square className="h-5 w-5 text-white" />
            </Button>
            <div className="flex-1">
              <AudioVisualizer isRecording={isRecording} />
            </div>
            <div className="text-lg font-medium text-destructive">
              {formatTime(elapsedTime)}
            </div>
          </div>
        )}
        {!isRecording && !showControls && (
          <Button 
            variant="destructive" 
            onClick={handleStartRecording}
            className="flex items-center gap-2"
          >
            <Mic className="h-10 w-10" />
            Start Recording {USE_MOCK_TRANSCRIPTION ? '(Mock)' : ''}
          </Button>
        )}
        {showControls && (
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={handleTryAgain}
              className="flex-1 flex items-center gap-2 ml-10"
            >
              <RotateCcw className="h-5 w-5" />
              Try Again
            </Button>
            <Button 
              variant="default"
              onClick={handleSubmit}
              className="flex-1 flex items-center gap-2 mr-10"
            >
              <Send className="h-5 w-5" />
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordPage;
