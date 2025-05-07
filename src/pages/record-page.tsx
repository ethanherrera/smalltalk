import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, RotateCcw, Send } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';
import { transcribeAndAnalyzeLanguage } from '@/services/assemblyai';
import { usePastConversations } from '@/contexts/PastConversationsContext';

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
  const { pastConversations, setPastConversations } = usePastConversations();
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
        setDebug('Transcribing audio with AssemblyAI and analyzing language...');
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        console.log('Processing audio with AssemblyAI, size:', audioBlob.size, 'bytes');
        
        // Call AssemblyAI service with language analysis
        const result = await transcribeAndAnalyzeLanguage(audioBlob);
        
        if (result.error) {
          setError(`Transcription error: ${result.error}`);
        } else if (result.utterances && result.utterances.length > 0) {
          // Convert the utterances to messages for the UI
          setLiveMessages(result.utterances);
          console.log('Transcription completed with diarization:', result.utterances);
          
          // Store the analysis result in sessionStorage for the feedback page
          if (result.languageAnalysis) {
            sessionStorage.setItem('languageAnalysis', JSON.stringify(result.languageAnalysis));
            console.log('Language analysis stored in session:', result.languageAnalysis);
          }
          
          // Store the conversation for context
          sessionStorage.setItem('conversation', JSON.stringify(result.utterances));
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

  const createConversationTitle = (messages: Message[]): string => {
    // Combine all messages into one string and get first 3 words
    const fullText = messages.map(msg => msg.text).join(' ');
    const words = fullText.trim().split(/\s+/);
    return words.slice(0, 3).join(' ') + '...';
  };

  const countSentences = (messages: Message[]): number => {
    const fullText = messages.map(msg => msg.text).join(' ');
    // Count periods that are followed by a space or end of string
    return (fullText.match(/\.\s|\.$|!\s|!$|\?\s|\?$/g) || []).length;
  };

  const handleSubmit = () => {
    if (liveMessages.length > 0) {
      const newConversation = {
        title: createConversationTitle(liveMessages),
        time: Math.floor(Math.random() * 20) + 5, // Random time between 5-25 minutes
        concepts: Math.floor(Math.random() * 15) + 5, // Random concepts between 5-20
        lines: countSentences(liveMessages),
        date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        transcript: liveMessages.map(msg => `${msg.speaker === "Person A" ? "You" : msg.speaker}: ${msg.text}`).join('\n')
      };

      // Add the new conversation to the beginning of the list
      setPastConversations([newConversation, ...pastConversations]);
    }

    // Navigate to feedback page
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
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-2 px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Record Conversation</h1>
      </div>
      
      {renderPermissionMessage()}
      
      <TranscriptBox 
        isRecording={isRecording} 
        transcript={transcript}
        liveTranscript={""}
        liveMessages={liveMessages.map(msg => ({
          ...msg,
          displaySpeaker: msg.speaker === "Person A" ? "You" : msg.speaker
        }))}
      />
      
      {error && (
        <div className="px-4 mt-4">
          <div className="max-w-screen-md mx-auto p-3 border border-red-500 text-red-800 rounded-md">
            {error}
          </div>
        </div>
      )}
      
      {debug && !isRecording && (
       <div className="flex justify-center px-4 mt-4">
          <div className="inline-block max-w-max whitespace-nowrap px-2 py-1 border border-green-500 bg-green-500/20 text-green-500 text-sm rounded-md">
            Status: {debug}
          </div>
        </div>
      )}
      
      {isTranscribing && (
        <div className="px-4 mt-4">
          <div className="max-w-screen-md mx-auto p-3 bg-blue-500/20 text-blue-800 rounded-md">
            Transcribing your conversation... Please wait.
          </div>
        </div>
      )}
      
      <div className="fixed bottom-6 w-11/12 left-1/2 -translate-x-1/2 px-4 z-10">
        {!isRecording && !showControls && (
          <Button
            onClick={handleStartRecording}
            className="w-full h-20 rounded-full bg-primary text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <Mic className="h-6 w-6" />
            Start Recording {USE_MOCK_TRANSCRIPTION ? '(Mock)' : ''}
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-20 rounded-lg overflow-hidden">
              <AudioVisualizer isRecording={true} />
            </div>
            <div className="text-lg font-medium text-primary">
              {formatTime(elapsedTime)}
            </div>
            <Button
              onClick={handleStopRecording}
              className="h-20 w-20 rounded-full bg-primary text-primary-foreground flex-shrink-0"
            >
              <Square className="h-6 w-6" />
            </Button>
          </div>
        )}

        {showControls && !isTranscribing && (
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={handleTryAgain}
              className="flex-1 h-20 rounded-full flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-6 w-6" />
              Try Again
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              className="flex-1 h-20 rounded-full flex items-center justify-center gap-2"
            >
              <Send className="h-6 w-6" />
              Submit
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default RecordPage;
