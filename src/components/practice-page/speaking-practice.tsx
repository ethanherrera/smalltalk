import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw } from 'lucide-react';
import AudioVisualizer from '@/components/record-page/audio-visualizer';

interface SpeakingPracticeProps {
  question: {
    question: string;
    prompt: string;
    instruction: string;
    correctResponse: string;
    feedback: string[];
  };
  onComplete: (isCorrect: boolean, answer?: string) => void;
  showFeedback: boolean;
  onNext: () => void;
}

const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  question,
  onComplete,
  showFeedback,
  onNext
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const maxRecordingTime = 30; // 30 seconds max
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => {
          // Automatically stop after max recording time
          if (prev >= maxRecordingTime - 1) {
            handleStopRecording();
            return maxRecordingTime;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setElapsedTime(0);
    setRecordingComplete(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordingComplete(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTryAgain = () => {
    setRecordingComplete(false);
    setElapsedTime(0);
  };

  const handleSubmit = () => {
    // In a real app, we'd analyze the recording here
    // For now, we'll just complete with a simulated "correct" response
    onComplete(true, question.correctResponse);
  };

  // Display the instruction in a more formatted way
  const instructions = question.instruction.split('\n').map((line, index) => (
    <p key={index} className="mb-1">{line}</p>
  ));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base font-semibold">Speak and improve</h2>
      
      <div className="mt-2">
        <p className="whitespace-pre-wrap">{question.question}</p>
        <p className="font-semibold mt-4">{question.prompt}</p>
        <div className="bg-gray-100 p-4 rounded-lg mt-2 text-gray-500">
          {instructions}
        </div>
      </div>
      
      <div className="mt-auto pt-10">
        {isRecording ? (
          <div className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"
              onClick={handleStopRecording}
            >
              <Square className="h-6 w-6 text-white" />
            </Button>
            
            <div className="flex-1">
              <AudioVisualizer isRecording={isRecording} audioElement={null} />
            </div>
            
            <div className="text-lg font-semibold">
              {formatTime(elapsedTime)}
            </div>
          </div>
        ) : !recordingComplete ? (
          <div className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-full bg-gray-800 hover:bg-gray-900"
              onClick={handleStartRecording}
            >
              <Play className="h-6 w-6 ml-1 text-white" />
            </Button>
            
            <div className="flex-1">
              <div className="h-8 flex items-center">
                <div className="w-full h-0.5 bg-gray-200">
                  {/* Placeholder for audio waveform */}
                </div>
              </div>
            </div>
            
            <div className="text-lg font-semibold">
              {formatTime(elapsedTime)}
            </div>
          </div>
        ) : !showFeedback ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full">
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300"
                onClick={() => {}}
              >
                <Play className="h-6 w-6 ml-1" />
              </Button>
              
              <div className="flex-1">
                <AudioVisualizer isRecording={false} audioElement={null} />
              </div>
              
              <div className="text-lg font-semibold">
                {formatTime(elapsedTime)}
              </div>
            </div>
            
            <div className="flex gap-4 mt-4">
              <Button
                className="flex-1 py-5 text-base font-bold rounded-full border border-gray-300 hover:bg-gray-100 text-black"
                onClick={handleTryAgain}
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Try Again
              </Button>
              <Button
                className="flex-1 py-5 text-base font-bold rounded-full bg-gray-800 hover:bg-gray-900 text-white"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        ) : null}
      </div>
      
      {showFeedback && (
        <div className="mt-8 pt-6 pb-4 fixed bottom-0 left-0 right-0 bg-gray-100 rounded-t-2xl shadow-lg">
          <div className="px-10">
            <h3 className="text-lg font-bold text-black">Great job!</h3>
            <div className="mt-2">
              <p className="font-semibold text-gray-800">Your response:</p>
              <p className="text-gray-700">{question.correctResponse}</p>
              <div className="mt-3 space-y-2">
                {question.feedback.map((item, index) => (
                  <p key={index} className="font-medium text-gray-700">{item}</p>
                ))}
              </div>
            </div>
            
            <Button
              className="w-full py-5 mt-6 text-base font-bold rounded-full bg-gray-200 hover:bg-gray-300 text-black"
              onClick={onNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakingPractice;