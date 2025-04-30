import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause } from 'lucide-react';
import type { SpeakingPracticeData } from '@/types/practice';

interface SpeakingPracticeProps {
  question: SpeakingPracticeData;
  onComplete: (isCorrect: boolean) => void;
  showFeedback: boolean;
  onNext: () => void;
}

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  question,
  onComplete,
  showFeedback,
  onNext,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setRecordingComplete(true);
        
        // Simulate AI evaluation
        // In a real app, send the audio to the backend for evaluation
        setTimeout(() => {
          onComplete(true);
        }, 1000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const togglePlayback = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  useEffect(() => {
    return () => {
      // Clean up resources when component unmounts
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
      
      // Revoke any object URLs to avoid memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [audioUrl]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <p className="text-gray-600 text-sm">{question.prompt}</p>
      </div>

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="font-medium">Practice Instructions</div>
        <p className="text-sm mt-1 whitespace-pre-line">{question.instruction}</p>
      </Card>

      <div className="flex flex-col items-center gap-4 py-4">
        {!recordingComplete ? (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full h-16 w-16 flex items-center justify-center ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <audio ref={audioRef} src={audioUrl || undefined} className="hidden" />
            
            <div className="flex items-center gap-3 p-3 border rounded-full bg-white shadow-sm w-full">
              <Button
                variant="ghost"
                onClick={togglePlayback}
                className="h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
              </Button>
              
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full w-0 animate-progress"></div>
              </div>
              
              <span className="text-sm font-medium text-gray-700">0:00 / 0:00</span>
            </div>
          </div>
        )}
        
        <div className="text-center text-sm text-gray-500">
          {isRecording ? 'Recording... Click to stop' : !recordingComplete ? 'Click to start recording' : 'Recording complete'}
        </div>
      </div>

      {showFeedback && (
        <div>
          <h3 className="font-semibold mb-2">Feedback</h3>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 font-medium">Correct Response:</p>
              <p className="text-sm mt-1">{question.correctResponse}</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">Your Performance:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {question.feedback.map((item, index) => (
                  <span key={index} className="inline-block px-3 py-1 text-sm bg-white rounded-full border border-blue-200">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
              Continue
            </Button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 20s linear;
        }
      `}</style>
    </div>
  );
};

export default SpeakingPractice;