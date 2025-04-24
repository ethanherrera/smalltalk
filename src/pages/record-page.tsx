import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Mic, Square, LanguagesIcon } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';
import PlaybackControls from '@/components/record-page/playback-controls';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  // Speech-to-text functionality has been removed
  const [speechError, setSpeechError] = useState<string | null>(null);
  // Only support Spanish languages now
  const [selectedLanguage, setSelectedLanguage] = useState('es-ES'); // Default to Spanish (Spain)
  
  // Available languages for speech recognition - Spanish only
  const languages = [
    { code: 'es-ES', name: 'Spanish (Spain)' },
    { code: 'es-MX', name: 'Spanish (Mexico)' },
  ];
  
  // References for audio processing
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const speechInitialized = useRef<boolean>(false);

  // Timer effect for recording
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

  // Initialize audio element for playback and speech recognition service
  useEffect(() => {
    // Initialize audio element
    if (!audioElementRef.current) {
      const audio = new Audio();
      audio.preload = 'auto'; // Force preloading of audio
      
      // Add event listeners
      audio.addEventListener('timeupdate', () => {
        setCurrentPlaybackTime(audio.currentTime);
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentPlaybackTime(0);
      });
      
      // Prevent logging error handler completely
      audio.onerror = () => {
        // Don't do anything with the error
        // This completely silences the "Empty src attribute" errors
        setIsPlaying(false);
      };
      
      // Override console.error for audio errors
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        // Filter out all empty src attribute errors
        if (args.length > 0 && typeof args[0] === 'string' && 
            (args[0].includes('Empty src attribute') || 
             args[0].includes('MEDIA_ELEMENT_ERROR'))) {
          return; // Silently ignore these errors
        }
        originalConsoleError.apply(console, args); // Pass through other errors
      };
      
      // Add canplay listener to ensure audio is ready
      audio.addEventListener('canplay', () => {
        console.log('Audio is ready for playback');
      });
      
      audioElementRef.current = audio;
    }
    
    // Speech-to-text functionality has been disabled
    speechInitialized.current = true;

    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      }
    };
  }, []);

  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Start recording with Web Audio API and MediaRecorder
  const handleStartRecording = async () => {
    try {
      // Clear any previous errors
      setSpeechError(null);
      
      // Get microphone permission and stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      // Set up MediaRecorder with optimal format options
      const mimeOptions = [
        'audio/webm',
        'audio/mp4',
        'audio/ogg',
        'audio/wav'
      ];
      
      // Find the first supported mime type
      let selectedMimeType = '';
      for (const mimeType of mimeOptions) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log(`Using supported recording format: ${mimeType}`);
          break;
        }
      }
      
      // Fall back to default if none are explicitly supported
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType || undefined
      });
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Organize recording chunks
        
        // Try multiple formats to find one that works well
        const formatOptions = [
          { type: 'audio/webm', ext: 'webm' },
          { type: 'audio/mpeg', ext: 'mp3' },
          { type: 'audio/wav', ext: 'wav' },
          { type: 'audio/aac', ext: 'aac' }
        ];
        
        // Create blobs for each format to test
        const testAudio = new Audio();
        let bestFormat = formatOptions[0]; // Default to webm
        
        // Find best supported format
        for (const format of formatOptions) {
          const support = testAudio.canPlayType(format.type);
          console.log(`Support for ${format.type}: ${support}`);
          
          if (support === 'probably') {
            bestFormat = format;
            break;
          } else if (support === 'maybe' && bestFormat.type === 'audio/webm') {
            bestFormat = format;
          }
        }
        
        console.log('Using audio format:', bestFormat.type);
        
        // Create blob with best format
        const audioBlob = new Blob(audioChunksRef.current, { type: bestFormat.type });
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log('Audio URL created:', audioUrl);
        audioUrlRef.current = audioUrl;
        
        // Set up audio element for playback with explicit checks
        if (audioElementRef.current && audioUrl) {
          console.log('Setting audio source to:', audioUrl);
          audioElementRef.current.src = audioUrl;
          // Add an extra event listener to check source settings
          audioElementRef.current.addEventListener('loadedmetadata', () => {
            console.log('Audio metadata loaded successfully');
          });
          // Pre-load the audio to ensure it's ready for playback
          audioElementRef.current.load();
        }
      };
      
      // Speech-to-text functionality has been disabled
      console.log('Recording without speech-to-text');

      mediaRecorder.start(100);
      setIsRecording(true);
      setElapsedTime(0);
      setShowControls(false);
      setShowPlayback(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setSpeechError('Could not access microphone. Please check permissions.');
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks from the stream
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Speech-to-text functionality has been disabled
      
      setRecordedDuration(elapsedTime);
      setIsRecording(false);
      setShowControls(true);
      setShowPlayback(true);
    }
  };

  // Handle playback of recorded audio
  const handlePlayPause = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        // Ensure currentTime is reset to 0 if we're at the end
        if (audioElementRef.current.ended || audioElementRef.current.currentTime >= recordedDuration) {
          audioElementRef.current.currentTime = 0;
          setCurrentPlaybackTime(0);
        }
        audioElementRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
      }
    }
  };

  // Restart playback from the beginning
  const handleRestart = () => {
    if (audioElementRef.current) {
      audioElementRef.current.currentTime = 0;
      setCurrentPlaybackTime(0);
      if (!isPlaying) {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Reset and prepare for a new recording
  const handleTryAgain = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
    }
    
    // Reset error states
    setSpeechError(null);
    
    setShowControls(false);
    setShowPlayback(false);
    setElapsedTime(0);
    setCurrentPlaybackTime(0);
    setIsPlaying(false);
  };

  // Submit recording and navigate to feedback page
  const handleSubmit = () => {
    // Store the audio URL in localStorage before navigating
    if (audioUrlRef.current) {
      localStorage.setItem('recordedAudioURL', audioUrlRef.current);
      console.log('Audio URL saved to localStorage:', audioUrlRef.current);
      
      // Store the recorded duration in localStorage
      localStorage.setItem('recordedAudioDuration', recordedDuration.toString());
      console.log('Audio duration saved to localStorage:', recordedDuration);
    }
    navigate('/feedback');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-background flex items-center gap-2 py-4 px-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/home')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 text-white">Record</h1>
        
        {!isRecording && (
          <div className="flex items-center gap-2">
            <LanguagesIcon className="h-4 w-4 text-gray-500" />
            <Select 
              value={selectedLanguage} 
              onValueChange={(value) => {
                setSelectedLanguage(value);
                // Save to localStorage for future use
                localStorage.setItem('preferredLanguage', value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Spanish dialect" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex-1 mx-10 mb-32">
        <div className="border border-gray-300 rounded-lg p-6 h-[70vh] overflow-auto shadow-sm bg-gray-100">
          {speechError && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-700 text-sm font-medium">{speechError}</p>
                {speechError.includes('not supported') && (
                  <p className="text-amber-600 text-xs mt-1">Try using Chrome or Edge for best speech recognition support.</p>
                )}
                {speechError.includes('microphone') && (
                  <p className="text-amber-600 text-xs mt-1">Check your browser settings to ensure microphone permissions are granted.</p>
                )}
                {speechError.includes('language-not-supported') && (
                  <p className="text-amber-600 text-xs mt-1">Switching to English (US) as fallback language.</p>
                )}
              </div>
            </div>
          )}
          <TranscriptBox 
            className="mb-4" 
            transcript="" 
            isRecording={isRecording}
            speechStatus="not-supported"
            initialText="Speech-to-text functionality has been disabled. Record your speech without transcription." 
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-100">
        {isRecording ? (
          <div className="flex items-center gap-4 p-4 mx-10 border-2 border-red-200 rounded-full bg-white shadow-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
              onClick={handleStopRecording}
            >
              <Square className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <AudioVisualizer isRecording={isRecording} audioElement={audioElementRef.current} />
            </div>
            <div className="text-lg font-semibold text-red-600">
              {formatTime(elapsedTime)}
            </div>
          </div>
        ) : showPlayback ? (
          <div className="flex flex-col gap-4 mx-10">
            <PlaybackControls 
              onPlayPause={handlePlayPause}
              onRestart={handleRestart}
              isPlaying={isPlaying}
              currentTime={currentPlaybackTime}
              duration={recordedDuration}
              audioUrl={audioUrlRef.current || undefined}
            />
            {showControls && (
              <div className="flex gap-4 mt-4">
                <Button 
                  variant="outline" 
                  onClick={handleTryAgain}
                  className="flex-1 py-6 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-gray-800"
                >
                  Try Again
                </Button>
                <Button 
                  variant="default"
                  onClick={handleSubmit}
                  className="flex-1 py-6 rounded-full bg-primary hover:bg-primary/90 text-white font-bold"
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 mx-10 border-2 border-gray-200 rounded-full bg-white shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-primary/10 hover:bg-primary/20 text-primary"
              onClick={handleStartRecording}
            >
              <Mic className="h-6 w-6" />
            </Button>
            <div className="flex-1">
              <div className="h-8 flex items-center">
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <AudioVisualizer isRecording={false} audioElement={audioElementRef.current} />
                </div>
              </div>
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {formatTime(elapsedTime)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordPage;