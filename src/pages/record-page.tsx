import { Button } from '@/components/ui/button';
import { ArrowLeft, Mic, Square, RotateCcw, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptBox from '@/components/record-page/transcript-box';
import AudioVisualizer from '@/components/record-page/audio-visualizer';

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setElapsedTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setShowControls(true);
  };

  const handleTryAgain = () => {
    setShowControls(false);
    setElapsedTime(0);
  };

  const handleSubmit = () => {
    navigate('/feedback');
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
      <TranscriptBox />
      <div className="flex justify-center mb-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 px-6 py-2 border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={() => navigate('/practice')}
        >
          <span className="font-medium">Switch to Practice Mode</span>
        </Button>
      </div>
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
            Start Recording
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
