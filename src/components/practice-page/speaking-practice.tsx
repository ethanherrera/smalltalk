import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Play, Pause, X } from 'lucide-react';
import type { SpeakingPracticeData } from '@/types/practice';

interface SpeakingPracticeProps {
  question: SpeakingPracticeData;
  onComplete: (isCorrect: boolean) => void;
  showFeedback: boolean;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  question,
  onComplete,
  showFeedback,
  onNext,
  onPrev,
  onClose,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setRecordingComplete(true);
        setTimeout(() => onComplete(true), 1000);
      };
      mr.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.onended = () => setIsPlaying(false);
  }, [audioUrl]);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{question.question}</h2>
        <p className="text-sm text-muted-foreground">{question.prompt}</p>
      </div>

      <Card className="p-4 bg-white text-black border border-gray-200 dark:bg-black dark:text-white dark:border-gray-700 rounded-md">
        <div className="font-medium">Practice Instructions</div>
        <p className="text-sm mt-1 whitespace-pre-line">
          {question.instruction}
        </p>
      </Card>

      <div className="flex flex-col items-center gap-4 py-4">
        {!recordingComplete ? (
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full h-16 w-16 flex items-center justify-center
              bg-primary text-white dark:bg-primary dark:text-black
              hover:bg-gray-800 dark:hover:bg-gray-200
              ${isRecording ? 'animate-pulse border-red-800 dark:border-red-500' : ''}
            `}
          >
            {isRecording ? <MicOff size={24}/> : <Mic size={24}/>}
          </Button>
        ) : (
          <div className="flex flex-col items-center gap-2 w-full">
            <audio ref={audioRef} src={audioUrl!} className="hidden" />
            <div className="flex items-center gap-3 p-3 border rounded-full bg-black text-white shadow-sm w-full">
              <Button
                variant="ghost"
                onClick={togglePlayback}
                className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
              >
                {isPlaying ? <Pause size={18}/> : <Play size={18}/>}
              </Button>
              <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gray-500 animate-progress" />
              </div>
              <span className="text-sm font-medium text-gray-300">0:00 / 0:00</span>
            </div>
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="fixed bottom-2 inset-x-0 px-4 z-10">
          <Card className="relative w-full max-w-2xl mx-auto p-6 rounded-lg bg-card text-card-foreground border-border shadow-lg">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted/50 focus:outline-none"
            >
              <X className="h-5 w-5 text-card-foreground" />
            </button>

            <p className="font-medium text-lg">Feedback</p>
            <p className="mt-2 text-sm">Correct: {question.correctResponse}</p>

            <div className="mt-4 p-4 rounded-lg border border-primary/50">
              <p className="text-sm text-card-foreground font-semibold">
                Performance: {question.feedback.join(', ')}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-6">
              <Button
                onClick={onPrev}
                className="py-8 px-12 text-lg rounded-full bg-secondary text-secondary-foreground"
              >
                Back
              </Button>
              <Button
                onClick={onNext}
                className="py-8 px-14 text-lg rounded-full bg-primary text-white"
              >
                Continue
              </Button>
            </div>
          </Card>
        </div>
      )}

      <style jsx global>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress { animation: progress 20s linear; }
      `}</style>
    </div>
  );
};

export default SpeakingPractice;
