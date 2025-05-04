import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, RotateCcw, Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';
import { transcribeAudio } from '@/services/whisper';

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
  const [liveTranscript, setLiveTranscript] = useState('');
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [currentUtterance, setCurrentUtterance] = useState('');
  const [error, setError] = useState('');
  const [debug, setDebug] = useState('');
  const [hasAudioPermission, setHasAudioPermission] = useState<boolean | null>(null);
  
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
    "Nick."
  ]);
  const mockIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef('');
  const currentMessageRef = useRef<Message | null>(null);
  const lastReceivedTextRef = useRef('');
  const pausedSpeakingRef = useRef(false);
  const utteranceSegmentsRef = useRef<Set<string>>(new Set());

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

  // Define the mock word sequence
  const secondUtterance = [
    "I",
    "would",
    "love",
    "it",
    "if",
    "you",
    "could",
    "come",
    "to",
    "my",
    "ceremony."
  ];

  // Update with a mock transcription for testing
  const updateMockTranscription = () => {
    if (!isRecording) return;
    
    // First utterance simulation
    if (mockIndexRef.current < mockWordsRef.current.length) {
      const words = mockWordsRef.current.slice(0, mockIndexRef.current + 1);
      const text = words.join(" ");
      mockIndexRef.current++;
      
      console.log('[MOCK] First utterance update:', text);
      
      // Create or update the first message
      if (!currentMessageRef.current) {
        currentMessageRef.current = {
          speaker: 'You',
          text,
          isLive: true
        };
        setLiveMessages(prev => [...prev, currentMessageRef.current!]);
        lastReceivedTextRef.current = text;
        utteranceSegmentsRef.current.add(text);
      } else {
        // Update existing message
        currentMessageRef.current.text = text;
        lastReceivedTextRef.current = text;
        utteranceSegmentsRef.current.add(text);
        setLiveMessages(prev => [...prev]); // Force re-render
      }
      
      // When first utterance is complete, start the second one
      if (mockIndexRef.current === mockWordsRef.current.length) {
        console.log('[MOCK] First utterance complete, scheduling second');
        
        // Simulate a pause between utterances
        setTimeout(() => {
          // Mark the speaker as paused (silence detected)
          pausedSpeakingRef.current = true;
          console.log('[MOCK] Silence detected, ready for second utterance');
          
          // Store the last complete utterance
          lastTranscriptRef.current = currentMessageRef.current?.text || '';
          
          // Start second utterance after a pause
          setTimeout(() => {
            let secondIndex = 0;
            
            const secondInterval = setInterval(() => {
              if (secondIndex < secondUtterance.length) {
                const secondText = secondUtterance.slice(0, secondIndex + 1).join(" ");
                console.log('[MOCK] Second utterance update:', secondText);
                
                // This will be detected as a new utterance because pausedSpeakingRef is true
                if (secondIndex === 0) {
                  // Create a new message for the second utterance
                  currentMessageRef.current = {
                    speaker: 'You',
                    text: secondText,
                    isLive: true
                  };
                  setLiveMessages(prev => [...prev, currentMessageRef.current!]);
                  
                  // Reset utterance tracking for new utterance
                  utteranceSegmentsRef.current.clear();
                  utteranceSegmentsRef.current.add(secondText);
                  
                  // Update reference text
                  lastReceivedTextRef.current = secondText;
                  pausedSpeakingRef.current = false;
                } else if (currentMessageRef.current) {
                  // Update the current message with more words
                  currentMessageRef.current.text = secondText;
                  lastReceivedTextRef.current = secondText;
                  utteranceSegmentsRef.current.add(secondText);
                  setLiveMessages(prev => [...prev]); // Force re-render
                }
                
                // Update legacy implementation
                setLiveTranscript(secondText);
                
                secondIndex++;
              } else {
                clearInterval(secondInterval);
              }
            }, 300);
          }, 500);
        }, 1000);
      } else {
        // Set legacy transcript during first utterance
        setLiveTranscript(text);
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
      
      if (result && result.trim()) {
        // Store the raw transcript text (for debugging/comparison)
        const rawText = result.trim();
        
        // Update the legacy liveTranscript for backward compatibility
        setLiveTranscript(rawText);
        
        console.log(`[TRANSCRIPT] New text: "${rawText}"`);
        console.log(`[TRANSCRIPT] Current message: ${currentMessageRef.current ? `"${currentMessageRef.current.text}"` : 'null'}`);
        console.log(`[TRANSCRIPT] Last text: "${lastReceivedTextRef.current}"`);
        console.log(`[TRANSCRIPT] Paused: ${pausedSpeakingRef.current}`);
        
        // Set a silence timer to detect pauses between utterances
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('[TRANSCRIPT] Silence detected, marking user as paused');
          pausedSpeakingRef.current = true;
        }, 1500); // Increased from 1000ms to 1500ms
        
        // Check if this is an entirely new sentence that should be on a new line
        // Here's a simple, robust check that works with the real API responses:
        
        // 1. First utterance case
        if (!currentMessageRef.current) {
          console.log('[TRANSCRIPT] First utterance, creating new message');
          currentMessageRef.current = {
            speaker: 'You',
            text: rawText,
            isLive: true
          };
          setLiveMessages(prev => [...prev, currentMessageRef.current!]);
          lastReceivedTextRef.current = rawText;
          pausedSpeakingRef.current = false;
          return;
        }
        
        // 2. Check if text has completely changed
        // Get the first 20 chars of each string to compare beginnings
        const prevStart = currentMessageRef.current.text.substring(0, 20).toLowerCase();
        const newStart = rawText.substring(0, 20).toLowerCase();
        
        // If the starts of sentences don't match at all and we're paused speaking,
        // it's very likely this is a completely new sentence/utterance
        const isCompleteDifference = prevStart !== newStart && !prevStart.includes(newStart.substring(0, 5)) && 
                                     !newStart.includes(prevStart.substring(0, 5));
        
        if (pausedSpeakingRef.current && rawText !== currentMessageRef.current.text) {
          // When we've had silence and new text appears, create a new message
          console.log('[TRANSCRIPT] New utterance after pause, creating new message');
          currentMessageRef.current = {
            speaker: 'You',
            text: rawText,
            isLive: true
          };
          setLiveMessages(prev => [...prev, currentMessageRef.current!]);
          lastReceivedTextRef.current = rawText;
          pausedSpeakingRef.current = false;
        }
        // If not paused but text is completely different (a restart in the conversation)
        else if (isCompleteDifference) {
          console.log('[TRANSCRIPT] Completely different text, creating new message');
          currentMessageRef.current = {
            speaker: 'You',
            text: rawText,
            isLive: true
          };
          setLiveMessages(prev => [...prev, currentMessageRef.current!]);
          lastReceivedTextRef.current = rawText;
          pausedSpeakingRef.current = false;
        }
        // If text is similar to what we already have, just update the current message
        else {
          console.log('[TRANSCRIPT] Updating existing message');
          // Just update the existing message
          currentMessageRef.current.text = rawText;
          lastReceivedTextRef.current = rawText;
          // Force update of the live messages array to trigger re-render
          setLiveMessages(prev => [...prev]);
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
    setLiveTranscript('');
    setLiveMessages([]);
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
    currentMessageRef.current = null;
    lastTranscriptRef.current = '';
    lastReceivedTextRef.current = '';
    pausedSpeakingRef.current = false;
    utteranceSegmentsRef.current.clear();
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    if (USE_MOCK_TRANSCRIPTION) {
      console.log('Using mock transcription');
      setIsRecording(true);
      setElapsedTime(0);
    } else {
      await startRealRecording();
    }
  };

  const handleStopRecording = async () => {
    // Always clear pending silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Reset certain transcription state but preserve messages
    lastTranscriptRef.current = '';
    lastReceivedTextRef.current = '';
    pausedSpeakingRef.current = false;
    utteranceSegmentsRef.current.clear();
    
    if (USE_MOCK_TRANSCRIPTION) {
      setIsRecording(false);
      setShowControls(true);
      
      // Don't update the transcript or clear live messages
      console.log('Mock recording stopped');
      return;
    }
    
    setIsRecording(false);
    setShowControls(true);
    
    // Clean up all audio
    stopAllAudio();
    
    // If we're not using live messages or they're empty, get the final transcription
    if (liveMessages.length === 0 && chunksRef.current.length > 0) {
      try {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Getting final transcription, size:', audioBlob.size, 'bytes');
        
        const finalTranscript = await transcribeAudio(audioBlob);
        console.log('Received final transcription:', finalTranscript);
        
        if (finalTranscript && finalTranscript.trim()) {
          // Process the final transcript to add line breaks at sentence boundaries
          const processedTranscript = finalTranscript
            .replace(/\.\s+([A-Z])/g, '.\n$1')  // Add newline after period followed by capital letter
            .replace(/\?\s+([A-Z])/g, '?\n$1')  // Add newline after question mark followed by capital letter
            .replace(/!\s+([A-Z])/g, '!\n$1');  // Add newline after exclamation mark followed by capital letter
          
          setTranscript(processedTranscript);
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
      // We have live messages, so no need to get a final transcription
      console.log('Using existing live messages, skipping final transcription');
    }
  };

  const handleTryAgain = () => {
    setShowControls(false);
    setElapsedTime(0);
    setTranscript('');
    setLiveTranscript('');
    setLiveMessages([]);
    setError('');
    setDebug('');
    chunksRef.current = [];
    mockIndexRef.current = 0;
    currentMessageRef.current = null;
    lastTranscriptRef.current = '';
    lastReceivedTextRef.current = '';
    pausedSpeakingRef.current = false;
    utteranceSegmentsRef.current.clear();
    
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
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
        <h1 className="text-2xl font-bold">Record Conversation</h1>
      </div>
      
      {renderPermissionMessage()}
      
      <TranscriptBox 
        isRecording={isRecording} 
        transcript={transcript}
        liveTranscript={liveTranscript}
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
