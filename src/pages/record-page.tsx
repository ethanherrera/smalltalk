import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, RotateCcw, Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';
import { transcribeAudioWithDiarization } from '@/services/assemblyai';

// Define the Message interface for consistency with TranscriptBox
interface Message {
  speaker: string;
  text: string;
  isLive?: boolean;
}

// For testing - simulates a transcription response with a delay
const mockTranscription = async (text: string, delay: number = 500): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(text), delay);
  });
};

// Use this flag to toggle between real and mock transcription
const USE_MOCK_TRANSCRIPTION = false; // Set to true for testing UI, false for real API

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mockWordsRef = useRef<string[]>([
    "Hola,",
    "me", 
    "llamo", 
    "Nick."
  ]);
  const mockIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Set up mock transcription for testing
  useEffect(() => {
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

  // Define the mock word sequence for Person B
  const personBUtterance = [
    "Hola",
    "Nick,",
    "encantado",
    "de",
    "conocerte."
  ];

  // Update with a mock transcription for testing
  const updateMockTranscription = () => {
    if (!isRecording) return;
    
    // First utterance simulation for Person A
    if (mockIndexRef.current < mockWordsRef.current.length) {
      const words = mockWordsRef.current.slice(0, mockIndexRef.current + 1);
      const text = words.join(" ");
      mockIndexRef.current++;
      
      const currentMessage: Message = {
        speaker: 'Person A',
        text,
        isLive: true
      };
      setLiveMessages(prev => prev.length === 0 ? [currentMessage] : [prev[0], prev[1] || currentMessage]);
      
      // When first utterance is complete, add Person B's response
      if (mockIndexRef.current === mockWordsRef.current.length) {
        // Simulate a pause between speakers
        setTimeout(() => {
          let personBIndex = 0;
          
          const personBInterval = setInterval(() => {
            if (personBIndex < personBUtterance.length) {
              const personBText = personBUtterance.slice(0, personBIndex + 1).join(" ");
              
              const personBMessage: Message = {
                speaker: 'Person B',
                text: personBText,
                isLive: true
              };
              
              setLiveMessages(prev => [prev[0], personBMessage]);
              personBIndex++;
            } else {
              clearInterval(personBInterval);
            }
          }, 300);
        }, 1000);
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

  // The main recording function
  const startRealRecording = async () => {
    try {
      // First check if we have permission
      const hasPermission = await checkAudioPermission();
      setHasAudioPermission(hasPermission);
      
      // Always reset state
      chunksRef.current = [];
      
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
    setLiveMessages([]);
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
    
    if (USE_MOCK_TRANSCRIPTION) {
      console.log('Using mock transcription');
      setIsRecording(true);
      setElapsedTime(0);
    } else {
      await startRealRecording();
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setShowControls(true);
    
    if (USE_MOCK_TRANSCRIPTION) {
      console.log('Mock recording stopped');
      return;
    }
    
    // Clean up all audio
    stopAllAudio();
    
    // Process the recorded audio
    if (chunksRef.current.length > 0) {
      try {
        // Set transcribing state to show loading indicator
        setIsTranscribing(true);
        setDebug('Transcribing audio with AssemblyAI...');
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Processing audio with AssemblyAI, size:', audioBlob.size, 'bytes');
        
        // Call AssemblyAI service
        const result = await transcribeAudioWithDiarization(audioBlob);
        
        if (result.error) {
          setError(`Transcription error: ${result.error}`);
        } else if (result.utterances && result.utterances.length > 0) {
          // Convert the utterances to messages for the UI
          setLiveMessages(result.utterances);
          console.log('Transcription completed with diarization:', result.utterances);
        } else if (result.text) {
          // If no utterances but there is text, create a single message
          setLiveMessages([{
            speaker: 'Speaker',
            text: result.text
          }]);
          console.log('Transcription completed without diarization:', result.text);
        } else {
          setError('Received empty transcription. Your audio may not contain clear speech.');
        }
      } catch (error: any) {
        const errorMessage = error.message || 'Unknown error';
        console.error('Error transcribing audio:', errorMessage);
        setError(`Transcription error: ${errorMessage}`);
      } finally {
        setIsTranscribing(false);
        setDebug('');
      }
    } else {
      setError('No audio recorded. Please try again.');
    }
  };

  const handleTryAgain = () => {
    setShowControls(false);
    setElapsedTime(0);
    setTranscript('');
    setLiveMessages([]);
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
  };

  const handleSubmit = () => {
    // Navigate directly to feedback without clearing or changing the transcript
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
        <h1 className="text-2xl font-bold">Record Conversation (Spanish)</h1>
      </div>
      
      {renderPermissionMessage()}
      
      <TranscriptBox 
        isRecording={isRecording} 
        transcript={transcript}
        liveTranscript={""}
        liveMessages={liveMessages}
      />
      
      {error && (
        <div className="p-3 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}
      
      {debug && (
        <div className="p-2 bg-gray-100 text-gray-700 text-sm rounded-md">
          Status: {debug}
        </div>
      )}
      
      {isTranscribing && (
        <div className="p-3 bg-blue-100 text-blue-800 rounded-md">
          Transcribing your conversation... Please wait.
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
